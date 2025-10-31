# Troubleshooting Blank Page

## Quick Checks

### 1. Check Browser Console
1. Open `http://localhost:3000`
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for **RED error messages**
5. **Copy any errors** and share them

### 2. Check Network Tab
1. In DevTools, go to **Network** tab
2. Refresh the page (F5)
3. Look for failed requests (red)
4. Check if `index.html` loads successfully

### 3. Common Issues

#### Issue: JavaScript Error
**Symptoms:** Blank page, errors in console
**Solution:** Check console for specific error messages

#### Issue: Dev Server Not Ready
**Symptoms:** Can't connect to localhost:3000
**Solution:** Wait for dev server to show "ready" message

#### Issue: Port Already in Use
**Symptoms:** Error about port 3000
**Solution:** 
```bash
# Kill existing process or use different port
npm run dev -- --port 3001
```

#### Issue: Build Error
**Symptoms:** Errors in terminal when running `npm run dev`
**Solution:** Check terminal output for compilation errors

## Quick Fix Steps

1. **Check Terminal Output**
   - Look at the terminal where you ran `npm run dev`
   - Should see: `➜  Local:   http://localhost:3000/`
   - Check for any ERROR messages

2. **Clear Browser Cache**
   - Press `Ctrl+Shift+R` (hard refresh)
   - Or clear browser cache

3. **Restart Dev Server**
   - Stop dev server (Ctrl+C)
   - Run again: `npm run dev`

4. **Check Browser Console**
   - Most important! Open F12 → Console
   - Look for errors

## What to Share

If still not working, please share:
1. **Browser console errors** (F12 → Console)
2. **Terminal output** from `npm run dev`
3. **Network tab** - any failed requests?

---

**Most likely issue:** Check the browser console (F12) - there's probably a JavaScript error there!

