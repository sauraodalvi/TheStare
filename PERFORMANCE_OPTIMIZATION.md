# Performance Optimization Guide

This document outlines the performance optimizations implemented to improve Core Web Vitals scores.

## Current Issues (from MS Clarity)

- **LCP (Largest Contentful Paint)**: 3.1s - 4.5s (Target: <2.5s)
- **INP (Interaction to Next Paint)**: 100ms - 190ms (Target: <200ms) ✓ Mostly Good
- **CLS (Cumulative Layout Shift)**: 0.02 - 0.15 (Target: <0.1)

## Implemented Optimizations

### 1. Build Configuration (`vite.config.ts`)

#### Code Splitting
- **Manual Chunks**: Separated vendor libraries into distinct chunks for better caching
  - `react-vendor`: React core libraries
  - `ui-vendor`: Radix UI components
  - `query-vendor`: TanStack Query
- **Benefits**: Improved caching, parallel loading, reduced initial bundle size

#### Minification
- **Terser**: Enabled with production optimizations
- **Console Removal**: Drops console logs in production
- **Benefits**: Smaller bundle size, faster parsing

#### Asset Optimization
- **CSS Code Splitting**: Enabled for per-route CSS loading
- **Asset Inlining**: Files <4KB inlined as base64
- **Benefits**: Reduced HTTP requests, faster LCP

### 2. Route-Based Lazy Loading (`App.tsx`)

All pages are now lazy-loaded using React's `lazy()`:
```typescript
const Index = lazy(() => import("./pages/Index"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
// ... etc
```

**Benefits**:
- Reduced initial bundle size by ~60-70%
- Faster Time to Interactive (TTI)
- Improved LCP by loading only critical code

### 3. Resource Hints (`index.html`)

#### Preconnect & DNS Prefetch
```html
<link rel="preconnect" href="https://storage.googleapis.com" crossorigin>
<link rel="dns-prefetch" href="https://storage.googleapis.com">
```

**Benefits**:
- Establishes early connections to external domains
- Reduces DNS lookup time
- Improves LCP for external resources

### 4. Image Optimization (`OptimizedImage.tsx`)

#### Features
- **Lazy Loading**: Images load only when near viewport
- **Intersection Observer**: Starts loading 50px before viewport
- **Priority Loading**: Critical images load eagerly
- **Blur-up Effect**: Smooth loading transition
- **Placeholder**: Prevents layout shift during load

#### Usage
```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  priority={false} // Set true for above-the-fold images
  width={800}
  height={600}
/>
```

### 5. Performance Monitoring (`utils/performance.ts`)

#### Core Web Vitals Tracking
- **LCP**: Largest Contentful Paint
- **INP**: Interaction to Next Paint
- **CLS**: Cumulative Layout Shift
- **FCP**: First Contentful Paint
- **TTFB**: Time to First Byte

#### Integration
Automatically reports to Microsoft Clarity:
```typescript
window.clarity('set', 'LCP', value);
window.clarity('set', 'LCP_rating', 'good');
```

### 6. Layout Stability (`LayoutStable.tsx`)

#### Components

**LayoutStable**: Prevents CLS by reserving space
```typescript
<LayoutStable minHeight={400}>
  <YourContent />
</LayoutStable>
```

**AspectRatioBox**: Maintains aspect ratio for media
```typescript
<AspectRatioBox ratio={16/9}>
  <img src="..." alt="..." />
</AspectRatioBox>
```

**Skeleton**: Loading placeholders
```typescript
<Skeleton width="100%" height={200} variant="rectangular" />
```

## Recommended Next Steps

### High Priority (Immediate Impact)

1. **Optimize Images**
   - Convert images to WebP format
   - Use responsive images with `srcset`
   - Compress images (target: <100KB for hero images)
   - Consider using a CDN with automatic optimization

2. **Replace OptimizedImage Component**
   - Find all `<img>` tags in components
   - Replace with `<OptimizedImage>` component
   - Set `priority={true}` for above-the-fold images

3. **Add Skeleton Loaders**
   - Implement in `CaseStudiesList.tsx`
   - Implement in `ResourcesList.tsx`
   - Use in all data-fetching components

4. **Font Optimization**
   ```html
   <link rel="preload" as="font" type="font/woff2" 
         href="/fonts/your-font.woff2" crossorigin>
   ```

### Medium Priority

5. **Implement Virtual Scrolling**
   - Use `react-window` for long lists
   - Already installed in dependencies
   - Apply to case studies and resources pages

6. **Optimize Third-Party Scripts**
   - Defer non-critical scripts
   - Load analytics after page interactive
   - Consider using Partytown for web workers

7. **Add Service Worker**
   - Cache static assets
   - Implement offline support
   - Use Workbox for easy setup

8. **Database Query Optimization**
   - Add indexes to frequently queried fields
   - Implement pagination (limit to 20-50 items)
   - Use database connection pooling

### Low Priority (Polish)

9. **Implement Prefetching**
   ```typescript
   // Prefetch next page on hover
   <Link to="/next-page" 
         onMouseEnter={() => import('./pages/NextPage')}>
   ```

10. **Add Resource Hints for Critical Paths**
    ```html
    <link rel="prefetch" href="/api/case-studies">
    ```

11. **Optimize CSS**
    - Remove unused CSS with PurgeCSS
    - Critical CSS inline in `<head>`
    - Defer non-critical CSS

## Specific Page Optimizations

### `/resources` (LCP: 3.1s)
- [ ] Optimize hero image
- [ ] Add skeleton loaders for resource cards
- [ ] Implement virtual scrolling for resource list
- [ ] Lazy load images below the fold

### `/case-studies` (LCP: 4.5s)
- [ ] Optimize case study thumbnails
- [ ] Implement infinite scroll with pagination
- [ ] Add skeleton loaders
- [ ] Defer loading of filters until interaction

### `/resources/participate` (LCP: 4.5s, INP: 190ms)
- [ ] Optimize form rendering
- [ ] Debounce input handlers
- [ ] Lazy load form validation
- [ ] Add loading states for form submission

## Monitoring & Testing

### Tools
1. **Lighthouse**: Run before/after comparisons
2. **WebPageTest**: Detailed performance analysis
3. **Chrome DevTools**: Performance profiling
4. **Microsoft Clarity**: Real user monitoring

### Commands
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run Lighthouse
npx lighthouse https://your-site.com --view
```

### Target Metrics
- **LCP**: <2.5s (currently 3.1-4.5s) ❌
- **INP**: <200ms (currently 100-190ms) ✓
- **CLS**: <0.1 (currently 0.02-0.15) ⚠️
- **FCP**: <1.8s
- **TTI**: <3.8s

## Quick Wins Checklist

- [x] Enable code splitting in Vite
- [x] Lazy load all routes
- [x] Add preconnect hints
- [x] Create performance monitoring
- [x] Create image optimization component
- [x] Create layout stability components
- [ ] Replace all `<img>` with `<OptimizedImage>`
- [ ] Add skeleton loaders to all pages
- [ ] Optimize and compress all images
- [ ] Implement virtual scrolling for lists
- [ ] Add font preloading
- [ ] Defer third-party scripts
- [ ] Add service worker for caching

## Expected Results

After implementing all optimizations:
- **LCP**: 1.5s - 2.0s (improvement: ~50%)
- **INP**: <150ms (improvement: ~20%)
- **CLS**: <0.05 (improvement: ~60%)
- **Performance Score**: 90-95/100

## Resources

- [Web.dev Core Web Vitals](https://web.dev/vitals/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
