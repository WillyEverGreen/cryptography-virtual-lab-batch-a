#!/usr/bin/env node

/**
 * ============================================================================
 * CRYPTOGRAPHY VIRTUAL LAB — EXPERIMENT MODULE VALIDATOR
 * Automated contract and rubric checker for student experiment PRs
 * Usage: node tools/validate-experiment.js <experiment-id>
 * Example: node tools/validate-experiment.js caesar-cipher
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const expId = process.argv[2];

if (!expId) {
  console.error('\x1b[31m[ERROR]\x1b[0m Please provide an experiment ID to validate.');
  console.log('Usage: node tools/validate-experiment.js <experiment-id>');
  process.exit(1);
}

const expDir = path.resolve(__dirname, '..', 'experiments', expId);

console.log(`\n\x1b[36m====================================================\x1b[0m`);
console.log(`\x1b[36m  CRYPTOGRAPHY VIRTUAL LAB: MODULE CONTRACT CHECK   \x1b[0m`);
console.log(`\x1b[36m  Validating Target: \x1b[1m${expId}\x1b[0m`);
console.log(`\x1b[36m====================================================\x1b[0m\n`);

if (!fs.existsSync(expDir)) {
  console.error(`\x1b[31m[FAIL]\x1b[0m Directory not found: ${expDir}`);
  process.exit(1);
}

let errors = 0;
let warnings = 0;

function pass(msg) {
  console.log(`  \x1b[32m✔ PASS:\x1b[0m ${msg}`);
}

function fail(msg) {
  console.error(`  \x1b[31m✖ FAIL:\x1b[0m ${msg}`);
  errors++;
}

function warn(msg) {
  console.warn(`  \x1b[33m▲ WARN:\x1b[0m ${msg}`);
  warnings++;
}

// 1. Check experiment.json manifest
const manifestPath = path.join(expDir, 'experiment.json');
if (fs.existsSync(manifestPath)) {
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);

    if (manifest.id === expId) {
      pass(`experiment.json has matching ID ('${manifest.id}')`);
    } else {
      fail(`experiment.json ID ('${manifest.id}') does not match directory ('${expId}')`);
    }

    if (manifest.title && manifest.title.length > 3) {
      pass(`experiment.json has valid title: "${manifest.title}"`);
    } else {
      fail(`experiment.json missing or short title`);
    }

    if (manifest.sectorId) {
      pass(`experiment.json sector assigned: ${manifest.sectorId}`);
    } else {
      fail(`experiment.json missing sectorId`);
    }

    if (Array.isArray(manifest.authors) && manifest.authors.length > 0) {
      pass(`experiment.json lists ${manifest.authors.length} author(s)`);
    } else {
      fail(`experiment.json missing authors list`);
    }
  } catch (err) {
    fail(`experiment.json is not valid JSON: ${err.message}`);
  }
} else {
  fail(`Missing required manifest: experiment.json`);
}

// 2. Check index.html and 5 standard tabs
const htmlPath = path.join(expDir, 'index.html');
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  pass(`index.html exists`);

  const requiredTabs = ['tab-theory', 'tab-procedure', 'tab-sim', 'tab-analysis', 'tab-quiz'];
  let missingTabs = 0;

  requiredTabs.forEach(tab => {
    if (!htmlContent.includes(tab)) {
      fail(`index.html missing required tab/section id: '${tab}'`);
      missingTabs++;
    }
  });

  if (missingTabs === 0) {
    pass(`All 5 mandatory workstation tabs are declared in index.html`);
  }

  // Check for forbidden external CDNs
  if (/https?:\/\/(cdn|unpkg|cdnjs|code\.jquery)/i.test(htmlContent)) {
    fail(`index.html contains external CDN scripts/styles. All assets must be offline/local.`);
  } else {
    pass(`No external CDN links found (offline compliant)`);
  }
} else {
  fail(`Missing entrypoint: index.html`);
}

// 3. Check quiz.json
const quizPath = path.join(expDir, 'quiz.json');
if (fs.existsSync(quizPath)) {
  try {
    const raw = fs.readFileSync(quizPath, 'utf8');
    const quiz = JSON.parse(raw);

    if (Array.isArray(quiz) && quiz.length >= 3) {
      pass(`quiz.json contains ${quiz.length} verified questions`);
    } else {
      warn(`quiz.json has only ${quiz.length || 0} questions (5 recommended)`);
    }
  } catch (err) {
    fail(`quiz.json is not valid JSON: ${err.message}`);
  }
} else {
  fail(`Missing required evaluation questions: quiz.json`);
}

// 4. Check README.md
const readmePath = path.join(expDir, 'README.md');
if (fs.existsSync(readmePath)) {
  pass(`README.md documentation present`);
} else {
  warn(`README.md missing`);
}

// Final Summary
console.log(`\n----------------------------------------------------`);
if (errors === 0) {
  console.log(`\x1b[32m✔ MODULE PASSED INTEGRATION VALIDATION! Ready for PR.\x1b[0m`);
  process.exit(0);
} else {
  console.error(`\x1b[31m✖ MODULE VALIDATION FAILED with ${errors} error(s). Fix issues above.\x1b[0m`);
  process.exit(1);
}
