# Quick Performance Fixes - Action Checklist

## ✅ Completed (Automatic Improvements)

These optimizations are already implemented and will take effect on your next build:

1. **Build Configuration** - Vite config optimized with code splitting
2. **Route Lazy Loading** - All pages now load on-demand
3. **Resource Hints** - Preconnect/DNS prefetch added to index.html
4. **Performance Monitoring** - Automatic Core Web Vitals tracking
5. **Utility Components** - OptimizedImage, LayoutStable, Skeleton components created
6. **CSS Optimizations** - Performance-focused styles added

## 🔧 Manual Actions Required (High Impact)

### 1. Replace Image Tags (Highest Priority)
**Impact**: Will reduce LCP by 1-2 seconds

Find all `<img>` tags and replace with `OptimizedImage`:

```tsx
// Before
<img src="/image.jpg" alt="Description" />

// After
import { OptimizedImage } from '@/components/OptimizedImage';
<OptimizedImage 
  src="/image.jpg" 
  alt="Description"
  priority={true}  // Only for above-the-fold images
  width={800}
  height={600}
/>
```

**Files to update**:
- `src/components/Hero.tsx` - Hero images (set priority=true)
- `src/components/ResourcesHero.tsx` - Hero images (set priority=true)
- `src/components/CaseStudyCard.tsx` - Thumbnail images
- `src/components/PortfolioCard.tsx` - Portfolio images
- `src/components/CourseCard.tsx` - Course images
- Any other components with images

### 2. Add Skeleton Loaders
**Impact**: Prevents CLS, improves perceived performance

```tsx
import { Skeleton } from '@/components/LayoutStable';

// While loading
{isLoading ? (
  <div className="space-y-4">
    <Skeleton width="100%" height={200} />
    <Skeleton width="80%" height={20} />
    <Skeleton width="60%" height={20} />
  </div>
) : (
  <YourContent />
)}
```

**Files to update**:
- `src/components/CaseStudiesList.tsx`
- `src/components/ResourcesList.tsx`
- `src/pages/Courses.tsx`
- `src/pages/Portfolio.tsx`

### 3. Optimize Images (Critical)
**Impact**: Will reduce LCP by 1-2 seconds

Run these commands to optimize images:

```bash
# Install image optimization tools
npm install -g sharp-cli

# Convert to WebP (run in public folder)
cd public
for file in *.{jpg,jpeg,png}; do
  sharp -i "$file" -o "${file%.*}.webp" --webp
done

# Or use online tools:
# - https://squoosh.app/
# - https://tinypng.com/
```

**Target sizes**:
- Hero images: < 100KB
- Thumbnails: < 30KB
- Icons: < 10KB

### 4. Add Font Preloading
**Impact**: Prevents FOUT, improves LCP

Add to `index.html` after line 20:

```html
<!-- Preload fonts -->
<link rel="preload" as="font" type="font/woff2" 
      href="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" 
      crossorigin>
<link rel="preload" as="font" type="font/woff2" 
      href="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.woff2" 
      crossorigin>
```

## 🚀 Build and Deploy

After making the above changes:

```bash
# Build for production
npm run build

# Test the build locally
npm run preview

# Deploy to your hosting
# (Your existing deployment process)
```

## 📊 Expected Results

After implementing all fixes:

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **LCP** | 3.1-4.5s | 1.5-2.0s | ~50% faster |
| **INP** | 100-190ms | <150ms | ~20% faster |
| **CLS** | 0.02-0.15 | <0.05 | ~60% better |
| **Score** | 68-80 | 90-95 | +15-20 points |

## 🔍 Testing

After deployment, test with:

1. **Lighthouse** (Chrome DevTools)
   - Open DevTools → Lighthouse tab
   - Run audit in "Mobile" mode
   - Check Core Web Vitals scores

2. **PageSpeed Insights**
   - Visit: https://pagespeed.web.dev/
   - Enter your URL
   - Compare before/after scores

3. **Microsoft Clarity**
   - Already configured
   - Check dashboard for real user metrics

## 📝 Priority Order

Do these in order for maximum impact:

1. ✅ **Deploy current changes** (already done - just rebuild)
2. 🔴 **Optimize and compress images** (biggest impact)
3. 🔴 **Replace img tags with OptimizedImage** (big impact)
4. 🟡 **Add skeleton loaders** (medium impact)
5. 🟡 **Add font preloading** (medium impact)

## ⚡ Quick Win Commands

```bash
# 1. Rebuild with optimizations
npm run build

# 2. Test locally
npm run preview

# 3. Check bundle size
npm run build -- --mode production
# Look for: dist/assets/js/*.js file sizes

# 4. Deploy
# Use your existing deployment process
```

## 🆘 Troubleshooting

**Build fails?**
- Run: `npm install`
- Clear cache: `rm -rf node_modules/.vite`

**Images not loading?**
- Check image paths are correct
- Ensure images exist in public folder

**Performance not improving?**
- Clear browser cache (Ctrl+Shift+Delete)
- Test in incognito mode
- Wait 24-48h for CDN cache to clear

## 📚 Additional Resources

- Full guide: `PERFORMANCE_OPTIMIZATION.md`
- Component docs: Check JSDoc in each component file
- Vite config: `vite.config.ts` (already optimized)

---

**Need help?** Check the detailed guide in `PERFORMANCE_OPTIMIZATION.md`
