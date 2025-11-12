import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

/**
 * CHALLENGE #21: Responsive Design
 *
 * React Native doesn't have CSS media queries.
 * We must use JavaScript to listen for dimension changes.
 *
 * Issues:
 * 1. No CSS @media queries
 * 2. Must use JavaScript state for everything
 * 3. Causes re-renders on window resize
 * 4. Can't use CSS breakpoints
 * 5. More complex than web CSS
 */

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => subscription?.remove();
  }, []);

  const width = dimensions.window.width;

  return {
    width,
    height: dimensions.window.height,
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
    isWide: width >= BREAKPOINTS.wide,
    // Helper for getting responsive values
    responsive: (mobile, tablet, desktop) => {
      if (width >= BREAKPOINTS.desktop) return desktop;
      if (width >= BREAKPOINTS.tablet) return tablet;
      return mobile;
    },
  };
};

/**
 * Usage Example:
 *
 * const { isMobile, isDesktop, responsive } = useResponsive();
 *
 * const fontSize = responsive(14, 16, 18);
 * const columns = responsive(1, 2, 3);
 *
 * if (isMobile) {
 *   return <MobileView />;
 * }
 * return <DesktopView />;
 */

/**
 * COMPARISON TO WEB CSS:
 *
 * Web (simple):
 * @media (max-width: 768px) {
 *   .container { font-size: 14px; }
 * }
 * @media (min-width: 768px) {
 *   .container { font-size: 18px; }
 * }
 *
 * React Native (complex):
 * - Import useResponsive hook
 * - Use in every component
 * - Causes re-renders
 * - More code, more complexity
 */
