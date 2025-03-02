import React from 'react';
import { render } from '@testing-library/react';

// Create a special render function that handles the styled issue
export function renderAppWithMocks(ui, options = {}) {
  // No need to use ThemeProvider here since it's mocked separately
  return render(ui, options);
} 