# How to Start Dev Server

## Step-by-Step Instructions:

### 1. Open Terminal/PowerShell
Make sure you're in the project directory:
```powershell
cd c:\git_projects\stare\stare-revived-ui
```

### 2. Start the Dev Server
```powershell
npm run dev
```

### 3. What You Should See
The terminal should show something like:
```
  VITE v7.1.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 4. If Port 3000 is Busy
If you see an error about port 3000 being in use, try:
```powershell
npm run dev -- --port 3001
```
Then use: `http://localhost:3001`

### 5. Wait for "ready" Message
- Don't open the browser until you see "ready" message
- Look for: `➜  Local:   http://localhost:3000/`

### 6. Open Browser
Once you see "ready", open:
```
http://localhost:3000
```

---

## Troubleshooting

### If server doesn't start:
1. Check Node.js: `node --version` (should be 16+)
2. Reinstall dependencies: `npm install`
3. Clear cache: `rm -rf node_modules/.vite` (or delete the folder)

### If you see errors:
- Copy the error message
- Share it so I can help fix it

### Common Issues:
- **Port in use**: Use different port (3001, 3002, etc.)
- **Module not found**: Run `npm install`
- **Syntax error**: Check the error message location

---

## Quick Test

Run these commands one by one:

```powershell
# 1. Check Node version
node --version

# 2. Check npm
npm --version

# 3. Install dependencies (if needed)
npm install

# 4. Start server
npm run dev
```

Then wait for the "ready" message and open `http://localhost:3000`

