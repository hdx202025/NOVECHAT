'use client'

import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type OrientationType = 'portrait' | 'landscape';

interface ResponsiveInfo {
  deviceType: DeviceType;
  orientation: OrientationType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export default function useResponsive(): ResponsiveInfo {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [orientation, setOrientation] = useState<OrientationType>('portrait');
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Detect device type based on screen width
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }

      // Detect orientation
      if (window.innerHeight > window.innerWidth) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    // Detect OS
    const detectOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      setIsAndroid(/android/.test(userAgent));
    };

    // Initial detection
    handleResize();
    detectOS();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return {
    deviceType,
    orientation,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    isIOS,
    isAndroid,
  };
} 