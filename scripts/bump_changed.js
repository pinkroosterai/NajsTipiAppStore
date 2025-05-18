#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function nowMillis() {
  return Date.now();
}

function bumpConfig(appDir) {
  const configPath = path.join('apps', appDir, 'config.json');
  if (!fs.existsSync(configPath)) {
    console.warn(`No config.json found for app: ${appDir}`);
    return;
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  // Bump tipi_version (ensure it's a number)
  let tipiVersion = Number(config.tipi_version);
  if (isNaN(tipiVersion)) tipiVersion = 1;
  config.tipi_version = tipiVersion + 1;
  config.updated_at = nowMillis();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  console.log(`Bumped tipi_version for ${appDir}`);
}

const changedApps = process.argv.slice(2);
if (changedApps.length === 0) {
  console.log('No changed apps provided.');
  process.exit(0);
}

changedApps.forEach(bumpConfig);
