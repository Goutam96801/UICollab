import { useState } from 'react';

export function useTheme() {
  const [backgroundColor, setBackgroundColor] = useState("#e8e8e8");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const isColorDark = (color) => {
    // Convert hex color to RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Define the threshold for dark colors
    return luminance < 128; // Lower value means darker
  };

  const toggleDarkMode = () => {
    if (isColorDark(backgroundColor)) {
      setBackgroundColor("#e8e8e8"); // Light mode color
      setIsDarkMode(false);
    } else {
      setBackgroundColor("#212121"); // Dark mode color
      setIsDarkMode(true);
    }
  };

  return { backgroundColor, setBackgroundColor, isDarkMode, toggleDarkMode };
}
