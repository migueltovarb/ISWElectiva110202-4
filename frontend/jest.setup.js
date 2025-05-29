console.log("jest.setup.js is being loaded");

// Mock window.alert para evitar errores en tests
global.alert = jest.fn();

// Mock console.error para tests más limpios (opcional)
global.console.error = jest.fn();

// Setup para @testing-library/jest-dom
import '@testing-library/jest-dom';         