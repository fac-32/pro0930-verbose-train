import exampleService from './exampleService.js';

describe('Example Service', () => {
  it('should fetch data with a message', () => {
    const data = exampleService.fetchData();
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Hello from the service!');
  });
});
