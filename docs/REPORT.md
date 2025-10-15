# Report: Frontend Refactoring and Feature Enhancement

This document summarizes the key decisions and outcomes from our development session.

## 1. Primary Goal

The initial objective was to enhance the frontend experience of the application, focusing on innovation while adhering to a "no frameworks" and "no libraries" constraint.

## 2. Architectural Refactoring: Web Components

To improve code structure and maintainability, we decided to refactor the frontend into native Web Components.

- **Decision**: Instead of using a framework, we chose the browser's native component model to align with the project's existing philosophy.
- **Actions Taken**:
- The "Journey Planner" was encapsulated into a `<journey-planner>` component.
- The "Chatbot" was encapsulated into a `<chat-bot>` component.
- **Technical Challenges & Solutions**:
- **Map Rendering**: The Leaflet map failed to render correctly inside the Shadow DOM. This was resolved by calling `map.invalidateSize()` to force a redraw after the component was loaded.
- **CSS Encapsulation**: The chatbot's fixed-position button was not visible. This was resolved by moving all component-specific styles directly inside the component's `<template>` to make it fully self-contained.

## 3. Visual Enhancements: Animated Journey Path

To make the UI more visually appealing, we implemented a dynamic journey path on the map.

- **Decision**: We chose to use native SVG and CSS animations to create a "drawing" effect for the journey path, avoiding any external animation libraries.
- **Implementation**: An SVG overlay was added to the map, and a CSS animation on the `stroke-dashoffset` property was used to render the path dynamically.

## 4. Backend Feature Enhancement: Full Journey Itinerary

We enhanced the AI itinerary feature to provide suggestions for the entire journey, not just the destination.

- **Decision**: The backend was modified to fetch points of interest for every stop along a journey.
- **Technical Challenges & Solutions**:
- **Google API Debugging**: We diagnosed why the Google Places API was returning empty results. The root causes were identified as a missing **billing account** on the Google Cloud project and an incorrectly named **API key** in the `.env` file.
- **Journey Logic Bug**: We discovered and fixed a critical bug where the backend was only processing the first "leg" of a multi-leg journey.
- **Data Integrity Bug**: We fixed a subsequent bug where interchange stations (like Bank) were being filtered out because their coordinate data was not immediately available. The logic was corrected to fetch missing coordinates when needed.

## Current State

The application is now architected with a clean, component-based model. The backend logic is more robust and provides a richer data set for AI suggestions.

**Next steps will focus on fixing a minor visual bug with the "pitstop" animations on the map.**
