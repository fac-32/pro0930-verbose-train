import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock the node-fetch module
jest.unstable_mockModule('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Dynamically import the modules after the mock has been set up
const { getStationSuggestions } = await import('./tflservice.js');
const { default: fetch } = await import('node-fetch');

describe('TFL Service - getStationSuggestions', () => {
  beforeEach(() => {
    // Clear mock history before each test
    fetch.mockClear();
  });

  it('should return station suggestions based on a search term', async () => {
    const mockTflResponse = {
      matches: [
        { name: 'Victoria Station', modes: ['tube'] },
        { name: 'Victoria Coach Station', modes: [] },
        { name: 'Victoria Underground Station', modes: ['tube'] }
      ]
    };

    // Use the globally available Response object
    fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(mockTflResponse))));

    const suggestions = await getStationSuggestions('victoria');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('victoria'));
    expect(suggestions).toHaveLength(2);
    expect(suggestions[0].name).toBe('Victoria Station');
    expect(suggestions[1].name).toBe('Victoria Underground Station');
  });
});
