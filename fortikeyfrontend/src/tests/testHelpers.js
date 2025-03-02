import { screen, waitFor } from "@testing-library/react";

/**
 * Wait for an element to be visible and then click it
 * This is more reliable than plain fireEvent.click
 */
export const waitAndClick = async (matcher, options = {}) => {
  const element = await waitFor(() => {
    const found = typeof matcher === 'function' 
      ? matcher() 
      : screen.getByText(matcher);
    expect(found).toBeInTheDocument();
    return found;
  }, options);
  
  // Now click the element
  fireEvent.click(element);
  return element;
};

/**
 * Wait for a button with specific text and click it
 */
export const waitAndClickButton = async (textMatcher, options = {}) => {
  const button = await waitFor(() => {
    const found = screen.getByRole('button', { name: textMatcher });
    expect(found).toBeInTheDocument();
    return found;
  }, options);
  
  fireEvent.click(button);
  return button;
};

/**
 * Find all elements matching a text pattern
 */
export const findAllElementsByText = (textPattern) => {
  return screen.getAllByText(textPattern).map(el => ({
    text: el.textContent,
    tag: el.tagName,
    role: el.getAttribute('role'),
    className: el.className
  }));
}; 