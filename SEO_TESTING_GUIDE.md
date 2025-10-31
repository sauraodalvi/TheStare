# SEO Testing Guide - Local Testing

## 🧪 Quick Local Test Checklist

### 1. Verify Dev Server is Running
The dev server should be starting. Once it's up, visit:
- **Local URL**: http://localhost:3000

### 2. Test SEO Tags in Browser

#### Method 1: View Page Source
1. Open any page (e.g., http://localhost:3000)
2. Right-click → "View Page Source" (or Ctrl+U)
3. Look for:
   - `<title>` tag (should match page-specific title)
   - `<meta name="description">` tag
   - `<meta property="og:title">` tags
   - `<script type="application/ld+json">` (structured data)

#### Method 2: Browser DevTools
1. Open DevTools (F12)
2. Go to Elements/Inspector tab
3. Check `<head>` section
4. Verify all meta tags are present

#### Method 3: React DevTools
1. Install React DevTools browser extension
2. Open DevTools → React tab
3. Find `Helmet` component
4. Check that it's rendering correctly

### 3. Test Each Page

Navigate to each page and verify SEO tags:

- ✅ **Homepage** (`/`)
  - Title: "Stare - Product Management Case Studies & Resources | Learn PM Skills"
  - Should have Website & SearchAction schemas
  
- ✅ **Case Studies** (`/case-studies`)
  - Title: "Product Management Case Studies | Real-World PM Examples | Stare"
  - Should have Breadcrumb schema
  
- ✅ **About** (`/about`)
  - Title: "About Stare - Empowering Product Managers Worldwide"
  - Should have Organization schema
  
- ✅ **Resources** (`/resources`)
  - Title: "Product Management Resources - Books, Courses & Tools | Stare"
  
- ✅ **Courses** (`/courses`)
  - Title: "Product Management Courses & Free PM Sessions | Stare"
  
- ✅ **Pricing** (`/pricing`)
  - Title: "Pricing - Product Management Resources & Premium Plans | Stare"
  
- ✅ **Portfolio** (`/portfolio`)
  - Title: "Product Manager Portfolio Examples & Tools | Stare"
  
- ✅ **Resume** (`/resume`)
  - Title: "Product Manager Resume Examples & Templates | Stare"

### 4. Verify Structured Data

#### Check JSON-LD in Page Source:
1. View page source
2. Search for `application/ld+json`
3. Copy the JSON
4. Validate at: https://validator.schema.org/
5. Or test at: https://search.google.com/test/rich-results

### 5. Test Sitemap Generation (Optional)

Before testing sitemap, make sure you have environment variables:
```bash
# Check if .env file exists with Supabase credentials
# The sitemap generator needs:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

Test sitemap generation:
```bash
npm run generate:sitemap
```

Then check:
- `public/sitemap.xml` should be created
- Open it in browser or view source
- Verify it includes all static pages and case studies

### 6. Quick Visual Checks

1. **Page Titles in Browser Tab**
   - Each page should show unique title in browser tab
   
2. **Social Sharing Preview** (if you have sharing buttons)
   - Should show proper Open Graph images
   
3. **No Console Errors**
   - Check browser console (F12)
   - Should see no React/Helmet errors

### 7. Expected Behavior

✅ **What Should Work:**
- Unique title tags on each page
- Meta descriptions on each page
- Open Graph tags present
- Twitter Card tags present
- Structured data (JSON-LD) in head
- Canonical URLs
- No console errors

❌ **What to Watch For:**
- Multiple title tags (should only be one per page)
- Missing meta descriptions
- Console errors about Helmet
- Structured data not rendering

## 🐛 Troubleshooting

### Issue: SEO tags not appearing
**Solution**: 
- Make sure `HelmetProvider` wraps the app (already done in main.tsx)
- Check browser console for errors
- Hard refresh (Ctrl+Shift+R)

### Issue: Same title on all pages
**Solution**: 
- Verify SEO component is imported and used on each page
- Check that each page has unique title prop

### Issue: Structured data not showing
**Solution**:
- Verify schema is passed correctly to SEO component
- Check JSON-LD syntax is valid (use schema validator)

### Issue: Sitemap generation fails
**Solution**:
- Check `.env` file has Supabase credentials
- Verify Supabase connection
- Check that `case_studies` table has `slug` and `seo_index` columns

## 📊 Testing Checklist

- [ ] Dev server starts without errors
- [ ] Homepage loads with correct title
- [ ] All pages have unique titles
- [ ] Meta descriptions appear in page source
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Structured data (JSON-LD) appears in head
- [ ] No console errors
- [ ] Browser tab shows correct title per page
- [ ] Sitemap generates successfully (if testing)

## 🚀 Ready for Production?

Once local testing passes:
1. Run production build: `npm run build`
2. Test production build locally: `npm run preview`
3. Verify SEO tags in production build
4. Deploy to hosting
5. Submit sitemap to Google Search Console
6. Test with online validators

## 🔗 Useful Testing Tools

- **Schema Validator**: https://validator.schema.org/
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Google Search Console**: https://search.google.com/search-console

---

**Happy Testing! 🎉**

