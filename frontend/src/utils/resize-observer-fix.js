export function fixResizeObserverLoop() {
    const THROTTLE_TIMEOUT = 20;
  
    if (!window.ResizeObserver) {
      return;
    }
  
    const originalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class ResizeObserver extends originalResizeObserver {
      constructor(callback) {
        super((entries, observer) => {
          window.requestAnimationFrame(() => {
            if (!Array.isArray(entries) || !entries.length) {
              return;
            }
            callback(entries, observer);
          });
        });
      }
    };
  
    window.addEventListener('DOMContentLoaded', () => {
      const observer = new window.ResizeObserver((entries) => {
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) {
            return;
          }
          entries.forEach((entry) => {
            if (entry.target.style.height !== `${entry.contentRect.height}px`) {
              entry.target.style.height = `${entry.contentRect.height}px`;
            }
          });
        });
      });
  
      document.querySelectorAll('*').forEach((el) => observer.observe(el));
    });
  }
  
  