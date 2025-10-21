/**
 * Script to find all image usages in the codebase
 * Helps identify which files need to be updated with OptimizedImage component
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const results = {
  imgTags: [],
  imageImports: [],
  backgroundImages: [],
};

function searchDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      searchDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const relativePath = path.relative(path.join(__dirname, '..'), filePath);

        // Find <img> tags
        if (line.includes('<img')) {
          results.imgTags.push({
            file: relativePath,
            line: lineNumber,
            content: line.trim(),
          });
        }

        // Find background-image in style
        if (line.includes('background-image') || line.includes('backgroundImage')) {
          results.backgroundImages.push({
            file: relativePath,
            line: lineNumber,
            content: line.trim(),
          });
        }

        // Find image imports
        if (line.includes('import') && (line.includes('.png') || line.includes('.jpg') || line.includes('.jpeg') || line.includes('.webp') || line.includes('.svg'))) {
          results.imageImports.push({
            file: relativePath,
            line: lineNumber,
            content: line.trim(),
          });
        }
      });
    }
  });
}

console.log('🔍 Searching for images in the codebase...\n');
searchDirectory(srcDir);

console.log('📊 Results:\n');
console.log(`Found ${results.imgTags.length} <img> tags`);
console.log(`Found ${results.imageImports.length} image imports`);
console.log(`Found ${results.backgroundImages.length} background images\n`);

if (results.imgTags.length > 0) {
  console.log('🖼️  <img> tags to replace with OptimizedImage:\n');
  results.imgTags.forEach(item => {
    console.log(`  📄 ${item.file}:${item.line}`);
    console.log(`     ${item.content}\n`);
  });
}

if (results.imageImports.length > 0) {
  console.log('📦 Image imports found:\n');
  results.imageImports.forEach(item => {
    console.log(`  📄 ${item.file}:${item.line}`);
    console.log(`     ${item.content}\n`);
  });
}

if (results.backgroundImages.length > 0) {
  console.log('🎨 Background images found:\n');
  results.backgroundImages.forEach(item => {
    console.log(`  📄 ${item.file}:${item.line}`);
    console.log(`     ${item.content}\n`);
  });
}

// Save results to JSON file
const outputPath = path.join(__dirname, '../image-audit.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log(`\n💾 Full results saved to: image-audit.json`);

// Summary
console.log('\n📋 Summary:');
console.log('─'.repeat(50));
console.log(`Total files to update: ${new Set([...results.imgTags.map(r => r.file), ...results.imageImports.map(r => r.file)]).size}`);
console.log(`Priority: Replace ${results.imgTags.length} <img> tags first`);
console.log('\n✅ Next steps:');
console.log('1. Review the files listed above');
console.log('2. Replace <img> tags with OptimizedImage component');
console.log('3. Set priority={true} for above-the-fold images');
console.log('4. Run: npm run build');
console.log('5. Test with Lighthouse\n');
