/**
 * Remove White Backgrounds from Discord Assets
 * Makes white backgrounds transparent for Discord Rich Presence
 * 
 * Run: node scripts/remove-backgrounds.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../discord_assets_final');
const OUTPUT_DIR = path.join(__dirname, '../discord_assets_transparent');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all PNG files
const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'));

console.log(`\n🖼️  Processing ${files.length} images...\n`);

let successCount = 0;
let failCount = 0;

// Process each image using ImageMagick
files.forEach(file => {
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);
  
  try {
    console.log(`Processing: ${file}...`);
    execSync(`convert "${inputPath}" -fuzz 5% -transparent white "${outputPath}"`, {
      stdio: 'pipe'
    });
    console.log(`  ✅ Done`);
    successCount++;
  } catch (error) {
    console.log(`  ❌ Failed (ImageMagick not installed or error)`);
    // Copy file anyway
    fs.copyFileSync(inputPath, outputPath);
    failCount++;
  }
});

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ Successfully processed: ${successCount}`);
console.log(`❌ Failed (copied original): ${failCount}`);
console.log(`📁 Output directory: ${OUTPUT_DIR}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

if (failCount > 0) {
  console.log(`\n⚠️  ImageMagick may not be installed. Install it with:`);
  console.log(`   Ubuntu/Debian: sudo apt-get install imagemagick`);
  console.log(`   macOS: brew install imagemagick`);
  console.log(`   Windows: Download from https://imagemagick.org\n`);
}
