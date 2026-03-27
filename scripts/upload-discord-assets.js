/**
 * Discord Rich Presence Asset Upload Helper
 * 
 * This script helps you upload assets to Discord Developer Portal
 * Since Discord doesn't have a public API for asset uploads, this
 * script provides instructions and organizes your assets.
 * 
 * Run: node scripts/upload-discord-assets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../discord_assets_transparent');
const DISCORD_APP_ID = '1486472122715996270';

// Asset metadata
const ASSETS = [
  { name: 'logo', file: 'logo.png', description: 'Nokiatis Launcher logo' },
  { name: 'minecraft', file: 'minecraft.png', description: 'Minecraft grass block' },
  { name: 'vanilla', file: 'vanilla.png', description: 'Vanilla Minecraft' },
  { name: 'forge', file: 'forge.png', description: 'Forge modloader' },
  { name: 'fabric', file: 'fabric.png', description: 'Fabric modloader' },
  { name: 'quilt', file: 'quilt.png', description: 'Quilt modloader' },
  { name: 'neoforge', file: 'neoforge.png', description: 'NeoForge modloader' },
  { name: 'modpack', file: 'modpack.png', description: 'Modpack icon' },
  { name: 'server', file: 'server.png', description: 'Multiplayer server' },
  { name: 'browse', file: 'browse.png', description: 'Browsing launcher' },
  { name: 'downloading', file: 'downloading.png', description: 'Downloading' },
  { name: 'installing', file: 'installing.png', description: 'Installing' },
  { name: 'playing', file: 'playing.png', description: 'Playing game' },
  { name: 'java', file: 'java.png', description: 'Java runtime' },
  { name: 'crash', file: 'crash.png', description: 'Game crashed' },
  { name: 'loading', file: 'loading.png', description: 'Loading world' },
  { name: 'death', file: 'death.png', description: 'Player died' },
  { name: 'achievement', file: 'achievement.png', description: 'Achievement unlocked' },
  { name: 'screenshot', file: 'screenshot.png', description: 'Taking screenshot' },
  { name: 'pause', file: 'pause.png', description: 'Game paused' },
  { name: 'menu', file: 'menu.png', description: 'In menu' },
  { name: 'idle', file: 'idle.png', description: 'AFK/Idle' },
];

console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║            DISCORD RICH PRESENCE ASSET UPLOAD GUIDE                  ║
╚══════════════════════════════════════════════════════════════════════╝

🎮 Discord Application ID: ${DISCORD_APP_ID}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STEP 1: Open Discord Developer Portal
   👉 https://discord.com/developers/applications/${DISCORD_APP_ID}/rich-presence/assets

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STEP 2: Upload Each Asset
   Click "Add Rich Presence Asset" for each file below:

`);

// Check which files exist
const existingFiles = fs.existsSync(ASSETS_DIR) 
  ? fs.readdirSync(ASSETS_DIR).filter(f => f.endsWith('.png'))
  : [];

console.log('   Asset Name          | File                 | Status  | Description');
console.log('   ' + '─'.repeat(75));

ASSETS.forEach(asset => {
  const exists = existingFiles.includes(asset.file);
  const status = exists ? '✅ Ready' : '❌ Missing';
  const filePath = path.join(ASSETS_DIR, asset.file);
  const size = exists ? Math.round(fs.statSync(filePath).size / 1024) + ' KB' : '---';
  
  console.log(`   ${asset.name.padEnd(20)} | ${asset.file.padEnd(20)} | ${status} | ${asset.description}`);
});

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 STEP 3: Asset Requirements
   • Format: PNG (recommended), JPG, GIF
   • Size: 512x512 to 1024x1024 pixels
   • Max file size: 5 MB
   • Name: lowercase letters, numbers, underscores only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 Assets Location: ${ASSETS_DIR}

💡 TIP: Run 'node scripts/remove-backgrounds.js' first to make 
   backgrounds transparent for better Discord integration!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 QUICK UPLOAD CHECKLIST:

`);

ASSETS.forEach((asset, index) => {
  console.log(`   [ ] ${index + 1}. Upload "${asset.file}" as "${asset.name}"`);
});

console.log(`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 After uploading, the assets will be available in your Discord RPC:
   
   Example usage in code:
   ┌──────────────────────────────────────────────────────────────┐
   │  largeImageKey: "minecraft",                                 │
   │  largeImageText: "Playing Minecraft",                        │
   │  smallImageKey: "forge",                                     │
   │  smallImageText: "Forge 1.20.4"                              │
   └──────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Need help? Check the Discord docs:
   https://discord.com/developers/docs/rich-presence/best-practices

`);

// Summary
const readyCount = ASSETS.filter(a => existingFiles.includes(a.file)).length;
console.log(`📊 Summary: ${readyCount}/${ASSETS.length} assets ready for upload\n`);
