/**
 * Performance monitoring utilities for Core Web Vitals
 * Tracks LCP, INP, CLS and reports to analytics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

type MetricCallback = (metric: PerformanceMetric) => void;

// Thresholds based on Core Web Vitals standards
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(value: number, thresholds: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(callback: MetricCallback) {
  if (typeof window === 'undefined') return;

  // LCP - Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
    const value = lastEntry.renderTime || lastEntry.loadTime || 0;
    
    callback({
      name: 'LCP',
      value,
      rating: getRating(value, THRESHOLDS.LCP),
      delta: value,
    });
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP observer not supported');
  }

  // INP - Interaction to Next Paint
  if ('PerformanceEventTiming' in window) {
    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEventTiming[];
      entries.forEach((entry) => {
        const value = entry.processingStart - entry.startTime;
        callback({
          name: 'INP',
          value,
          rating: getRating(value, THRESHOLDS.INP),
          delta: value,
        });
      });
    });

    try {
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 } as any);
    } catch (e) {
      console.warn('INP observer not supported');
    }
  }

  // CLS - Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        callback({
          name: 'CLS',
          value: clsValue,
          rating: getRating(clsValue, THRESHOLDS.CLS),
          delta: (entry as any).value,
        });
      }
    }
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS observer not supported');
  }

  // FCP - First Contentful Paint
  const fcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const firstEntry = entries[0];
    const value = firstEntry.startTime;
    
    callback({
      name: 'FCP',
      value,
      rating: getRating(value, THRESHOLDS.FCP),
      delta: value,
    });
  });

  try {
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.warn('FCP observer not supported');
  }

  // TTFB - Time to First Byte
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    callback({
      name: 'TTFB',
      value: ttfb,
      rating: getRating(ttfb, THRESHOLDS.TTFB),
      delta: ttfb,
    });
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;

  reportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric.name}:`, {
        value: `${Math.round(metric.value)}ms`,
        rating: metric.rating,
      });
    }

    // Send to analytics (Microsoft Clarity)
    if (window.clarity) {
      window.clarity('set', metric.name, metric.value.toString());
      window.clarity('set', `${metric.name}_rating`, metric.rating);
    }

    // You can also send to other analytics services here
    // Example: Google Analytics 4
    // if (window.gtag) {
    //   window.gtag('event', metric.name, {
    //     value: Math.round(metric.value),
    //     metric_rating: metric.rating,
    //   });
    // }
  });
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(resources: Array<{ href: string; as: string; type?: string }>) {
  resources.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  });
}

/**
 * Defer non-critical scripts
 */
export function deferNonCriticalScripts() {
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach((script) => {
    const newScript = document.createElement('script');
    newScript.src = script.getAttribute('src') || '';
    newScript.defer = true;
    script.parentNode?.replaceChild(newScript, script);
  });
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    clarity?: (action: string, key: string, value: string) => void;
    gtag?: (...args: any[]) => void;
  }
}

export default {
  reportWebVitals,
  initPerformanceMonitoring,
  preloadCriticalResources,
  deferNonCriticalScripts,
};
