'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const lastHoverCheck = useRef(0);
  const hoverCheckThrottle = 50; // Проверяем hover каждые 50ms

  useEffect(() => {
    // Проверка на мобильные устройства
    if (typeof window === 'undefined') return;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     window.innerWidth < 768;
    
    if (isMobile) {
      return;
    }

    setIsVisible(true);
    
    // Устанавливаем начальную позицию в центре экрана
    const initialX = window.innerWidth / 2;
    const initialY = window.innerHeight / 2;
    setPosition({ x: initialX, y: initialY });
    
    // Оптимизированная функция для проверки интерактивности
    const isInteractiveElement = (element: EventTarget | null): boolean => {
      if (!element || !(element instanceof HTMLElement)) return false;
      
      const target = element;
      
      try {
        // Быстрая проверка тега
        const tagName = target.tagName?.toUpperCase();
        if (tagName === 'A' || tagName === 'BUTTON' || tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return true;
        }

        // Проверяем родительские элементы (быстрее чем closest для всех)
        let current: HTMLElement | null = target;
        let depth = 0;
        while (current && depth < 3) {
          if (current.tagName === 'A' || current.tagName === 'BUTTON' || 
              current.getAttribute('role') === 'button' ||
              current.getAttribute('onclick')) {
            return true;
          }
          current = current.parentElement;
          depth++;
        }
      } catch (e) {
        return false;
      }

      return false;
    };

    // Обработчик движения мыши - обновляем позицию напрямую без задержек
    const handleMouseMove = (e: MouseEvent) => {
      // Обновляем позицию сразу без RAF для мгновенной реакции
      setPosition({ x: e.clientX, y: e.clientY });

      // Throttle для проверки hover (не каждый кадр)
      const now = Date.now();
      if (now - lastHoverCheck.current > hoverCheckThrottle) {
        lastHoverCheck.current = now;
        try {
          setIsHovering(isInteractiveElement(e.target));
        } catch (error) {
          // Игнорируем ошибки
        }
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    // Показываем курсор при первом движении мыши
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: 1,
        visibility: position.x === 0 && position.y === 0 ? 'hidden' : 'visible',
      }}
    />
  );
}
