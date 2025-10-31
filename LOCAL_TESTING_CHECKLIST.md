# 🧪 Local Testing Checklist

## Quick Start
Your dev server is starting! Once it shows "ready", follow these steps:

## ✅ Test Google Verification

### 1. Check Verification File
Once dev server is running, visit:
```
http://localhost:3000/googledc5c1306054a7154.html
```

**Expected Result:** You should see:
```
google-site-verification: googledc5c1306054a7154.html
```

### 2. Check Meta Tag in Homepage
1. Go to: `http://localhost:3000`
2. Right-click → **View Page Source** (or press `Ctrl+U`)
3. Look for in `<head>` section:
```html
<meta name="google-site-verification" content="dc5c1306054a7154" />
```

## ✅ Test SEO on Each Page

### Homepage (`/`)
1. Visit: `http://localhost:3000`
2. **Check Browser Tab:** Should show: "Stare - Product Management Case Studies & Resources | Learn PM Skills"
3. **View Source** → Look for:
   - `<title>` tag
   - `<meta name="description">`
   - `<script type="application/ld+json">` (structured data)

### Case Studies (`/case-studies`)
1. Visit: `http://localhost:3000/case-studies`
2. **Check Browser Tab:** Should show: "Product Management Case Studies | Real-World PM Examples | Stare"
3. **View Source** → Verify unique meta tags

### About (`/about`)
1. Visit: `http://localhost:3000/about`
2. **Check Browser Tab:** Should show: "About Stare - Empowering Product Managers Worldwide"
3. **View Source** → Verify Organization schema

### Other Pages to Test:
- `/resources` - "Product Management Resources - Books, Courses & Tools | Stare"
- `/courses` - "Product Management Courses & Free PM Sessions | Stare"
- `/pricing` - "Pricing - Product Management Resources & Premium Plans | Stare"
- `/portfolio` - "Product Manager Portfolio Examples & Tools | Stare"
- `/resume` - "Product Manager Resume Examples & Templates | Stare"

## ✅ Quick Verification Steps

### Method 1: Browser DevTools (Fastest)
1. Open any page
2. Press `F12` (DevTools)
3. Go to **Elements/Inspector** tab
4. Expand `<head>` section
5. Look for:
   - Unique `<title>` tag per page
   - `<meta name="description">` tag
   - `<meta name="google-site-verification">` (on homepage)
   - `<script type="application/ld+json">` (structured data)

### Method 2: View Page Source
1. Right-click on page → **View Page Source**
2. Press `Ctrl+F` to search
3. Search for: `title`
4. Search for: `description`
5. Search for: `application/ld+json`

### Method 3: Browser Tab Title
- Navigate between pages
- Watch the browser tab title change for each page
- This confirms SEO component is working!

## 🎯 What to Verify

- [ ] Dev server starts without errors
- [ ] Verification file accessible: `/googledc5c1306054a7154.html`
- [ ] Google meta tag appears in homepage source
- [ ] Each page has unique title in browser tab
- [ ] Meta descriptions appear in page source
- [ ] Structured data (JSON-LD) appears on homepage
- [ ] No console errors (F12 → Console tab)
- [ ] All pages load correctly

## 🐛 Troubleshooting

### If verification file doesn't load:
- Make sure dev server is running
- Check file exists in `public/googledc5c1306054a7154.html`
- Try hard refresh: `Ctrl+Shift+R`

### If SEO tags not showing:
- Check browser console for errors (F12)
- Verify HelmetProvider is in main.tsx (already done ✅)
- Hard refresh the page

### If same title on all pages:
- Verify SEO component imported on each page
- Check that each page passes unique title prop

## 📝 Testing Notes

**Current Status:**
- ✅ SEO component created
- ✅ Google verification file added
- ✅ Google meta tag added to index.html
- ✅ SEO added to all major pages
- ✅ Structured data configured

**Ready to Test:** Everything is set up! Just start testing the URLs above.

---

**Happy Testing! 🚀**

Once everything works locally, you're ready to deploy!

