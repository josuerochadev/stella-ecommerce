import { useState, useRef, useCallback, useEffect } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

interface UseTouchInteractionsOptions {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  enableHapticFeedback?: boolean;
}

export const useTouchInteractions = (options: UseTouchInteractionsOptions = {}) => {
  const {
    minSwipeDistance = 50,
    maxSwipeTime = 300,
    enableHapticFeedback = false
  } = options;

  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>({
    direction: null,
    distance: 0,
    velocity: 0
  });

  const elementRef = useRef<HTMLElement>(null);

  // Détection des gestes
  const detectSwipe = useCallback((start: TouchPoint, end: TouchPoint): SwipeDirection => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const deltaTime = end.timestamp - start.timestamp;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    if (distance < minSwipeDistance || deltaTime > maxSwipeTime) {
      return { direction: null, distance, velocity };
    }

    const angle = Math.atan2(Math.abs(deltaY), Math.abs(deltaX)) * 180 / Math.PI;

    let direction: 'left' | 'right' | 'up' | 'down' | null = null;

    if (angle < 45) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return { direction, distance, velocity };
  }, [minSwipeDistance, maxSwipeTime]);

  // Feedback haptique
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (enableHapticFeedback && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [50],
        heavy: [100]
      };
      navigator.vibrate(patterns[type]);
    }
  }, [enableHapticFeedback]);

  // Gestionnaires d'événements
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    });
    setIsPressed(true);
    triggerHaptic('light');
  }, [triggerHaptic]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const currentPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    // Mise à jour en temps réel pour les indicateurs visuels
    const tempSwipe = detectSwipe(touchStart, currentPoint);
    setSwipeDirection(tempSwipe);
  }, [touchStart, detectSwipe]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const endPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };

    setTouchEnd(endPoint);
    setIsPressed(false);

    const finalSwipe = detectSwipe(touchStart, endPoint);
    setSwipeDirection(finalSwipe);

    if (finalSwipe.direction) {
      triggerHaptic('medium');
    }
  }, [touchStart, detectSwipe, triggerHaptic]);

  // Attacher les événements tactiles
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    elementRef,
    isPressed,
    swipeDirection,
    triggerHaptic,
    resetSwipe: () => setSwipeDirection({ direction: null, distance: 0, velocity: 0 })
  };
};

// Hook spécialisé pour les carousels tactiles
export const useTouchCarousel = (itemsLength: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { elementRef, swipeDirection, resetSwipe } = useTouchInteractions({
    minSwipeDistance: 80,
    enableHapticFeedback: true
  });

  useEffect(() => {
    if (swipeDirection.direction === 'left' && currentIndex < itemsLength - 1) {
      setCurrentIndex(prev => prev + 1);
      resetSwipe();
    } else if (swipeDirection.direction === 'right' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetSwipe();
    }
  }, [swipeDirection.direction, currentIndex, itemsLength, resetSwipe]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < itemsLength) {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  return {
    elementRef,
    currentIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    canGoNext: currentIndex < itemsLength - 1,
    canGoPrev: currentIndex > 0
  };
};