#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

function nowMillis() {
  return Date.now();
}

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function bumpConfig(appDir) {
  const configPath = path.join(__dirname, '..', 'apps', appDir, 'config.json');
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

// Get last run commit hash from file
const stateFile = path.join(__dirname, '.bump_changed_last_commit');
let lastCommit = null;
if (fs.existsSync(stateFile)) {
  lastCommit = fs.readFileSync(stateFile, 'utf8').trim();
}

// Get current HEAD commit hash
const currentCommit = execSync('git rev-parse HEAD').toString().trim();

// Find changed files since last run
let changedApps = [];
if (lastCommit && lastCommit !== currentCommit) {
  const diffOutput = execSync(`git diff --name-only ${lastCommit} ${currentCommit}`).toString();
  const changedFiles = diffOutput.split('\n').map(f => f.trim()).filter(Boolean);
  const appDirs = new Set();
  for (const file of changedFiles) {
    // Match apps/<appname>/...
    const match = file.match(/^apps\/([^\/]+)\//);
    if (match) {
      appDirs.add(match[1]);
    }
  }
  changedApps = Array.from(appDirs);
} else if (!lastCommit) {
  // First run: bump all apps
  const appsDir = path.join(__dirname, '..', 'apps');
  changedApps = fs.readdirSync(appsDir).filter(d => {
    const configPath = path.join(appsDir, d, 'config.json');
    return fs.existsSync(configPath);
  });
}

if (changedApps.length === 0) {
  console.log('No changed apps detected.');
  // Still update the state file
  fs.writeFileSync(stateFile, currentCommit);
  process.exit(0);
}

changedApps.forEach(bumpConfig);

// Save current commit hash for next run
fs.writeFileSync(stateFile, currentCommit);
