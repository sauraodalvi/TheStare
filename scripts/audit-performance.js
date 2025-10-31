const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const reportGenerator = require('lighthouse/report/generator/report-generator');

const PORT = 8041;
const URLS = [
  'http://localhost:8041',
  'http://localhost:8041/resources/courses'
];

async function runLighthouse(url, outputPath) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
    port: PORT + 1
  });

  try {
    const options = {
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['performance'],
      port: chrome.port,
      hostname: 'localhost',
      throttling: {
        rttMs: 150,
        throughputKbps: 1.6 * 1024,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 150,
        downloadThroughputKbps: 1.6 * 1024,
        uploadThroughputKbps: 750
      }
    };

    const runnerResult = await lighthouse(url, options);
    const reportHtml = reportGenerator.generateReport(runnerResult.lhr, 'html');
    
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, reportHtml);
    
    const { lhr } = runnerResult;
    return {
      url,
      performance: lhr.categories.performance.score * 100,
      metrics: {
        firstContentfulPaint: lhr.audits['first-contentful-paint'].displayValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint'].displayValue,
        totalBlockingTime: lhr.audits['total-blocking-time'].displayValue,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].displayValue,
        speedIndex: lhr.audits['speed-index'].displayValue,
        timeToInteractive: lhr.audits['interactive'].displayValue,
      },
      opportunities: lhr.audits['render-blocking-resources']?.details?.items?.map(item => ({
        url: item.url,
        totalBytes: item.totalBytes,
        wastedMs: item.wastedMs
      })) || []
    };
  } finally {
    await chrome.kill();
  }
}

async function analyzeBundle() {
  console.log('\n🔍 Analyzing bundle size...');
  try {
    const result = execSync('npx source-map-explorer dist/assets/*.js --json', { stdio: 'pipe' }).toString();
    const bundleData = JSON.parse(result);
    
    const bundleSizes = Object.entries(bundleData.files)
      .map(([file, size]) => ({
        file: file.split('/').pop(),
        size: (size / 1024).toFixed(2) + ' KB',
        gzip: (size * 0.3 / 1024).toFixed(2) + ' KB (gzip estimate)'
      }))
      .sort((a, b) => {
        const sizeA = parseFloat(a.size);
        const sizeB = parseFloat(b.size);
        return sizeB - sizeA;
      });

    console.log('\n📦 Bundle Sizes:');
    console.table(bundleSizes);
    
    return bundleSizes;
  } catch (error) {
    console.error('Error analyzing bundle:', error.message);
    return [];
  }
}

async function main() {
  console.log('🚀 Starting performance audit...');
  
  // Build the production version
  console.log('\n🔨 Building production version...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Start the preview server
  const previewProcess = exec('npm run preview', { stdio: 'pipe' });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    const results = [];
    
    // Run Lighthouse for each URL
    for (const url of URLS) {
      console.log(`\n📊 Running Lighthouse audit for ${url}...`);
      const outputPath = `./audit/report-${new URL(url).pathname.replace(/\//g, '-') || 'home'}.html`;
      const result = await runLighthouse(url, outputPath);
      results.push(result);
      console.log(`✅ Report generated: ${path.resolve(outputPath)}`);
    }
    
    // Analyze bundle size
    const bundleAnalysis = await analyzeBundle();
    
    // Print summary
    console.log('\n📈 Performance Summary:');
    console.table(results.map(r => ({
      URL: r.url,
      'Performance Score': `${r.performance.toFixed(0)}%`,
      'LCP': r.metrics.largestContentfulPaint,
      'CLS': r.metrics.cumulativeLayoutShift,
      'TBT': r.metrics.totalBlockingTime,
      'Opportunities': r.opportunities.length
    })));
    
    console.log('\n🎉 Performance audit completed!');
    
  } catch (error) {
    console.error('Error during audit:', error);
  } finally {
    // Cleanup
    previewProcess.kill();
  }
}

main().catch(console.error);
