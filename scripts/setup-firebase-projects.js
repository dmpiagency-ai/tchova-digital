#!/usr/bin/env node

// 🔌 PLUG-IN SYSTEM: Firebase Projects Setup Script
// Automated configuration for Firebase projects and environments

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 TchovaDigital - Firebase Projects Setup');
console.log('==========================================\n');

// 🔌 PLUG-IN: Project configurations
const projects = {
  development: {
    id: 'tchova-digital-dev',
    name: 'TchovaDigital Dev',
    description: 'Development environment',
    analytics: true
  },
  staging: {
    id: 'tchova-digital-staging',
    name: 'TchovaDigital Staging',
    description: 'Staging environment',
    analytics: true
  },
  production: {
    id: 'tchova-digital-prod',
    name: 'TchovaDigital Prod',
    description: 'Production environment',
    analytics: true
  }
};

// 🔌 PLUG-IN: Check Firebase CLI
function checkFirebaseCLI() {
  console.log('📋 Checking Firebase CLI...');

  try {
    const version = execSync('firebase --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Firebase CLI ${version} installed`);
  } catch (error) {
    console.error('❌ Firebase CLI not found');
    console.log('Install with: npm install -g firebase-tools');
    process.exit(1);
  }
}

// 🔌 PLUG-IN: Check login status
function checkLoginStatus() {
  console.log('\n📋 Checking login status...');

  try {
    execSync('firebase projects:list --json', { stdio: 'pipe' });
    console.log('✅ Logged in to Firebase');
  } catch (error) {
    console.error('❌ Not logged in to Firebase');
    console.log('Login with: firebase login');
    process.exit(1);
  }
}

// 🔌 PLUG-IN: Setup project in Firebase CLI
function setupProjectInCLI(projectKey, projectConfig) {
  console.log(`\n📦 Setting up ${projectKey} project...`);

  try {
    // Check if project exists in Firebase
    const projectsList = JSON.parse(execSync('firebase projects:list --json', { encoding: 'utf8' }));

    const projectExists = projectsList.result.some(p => p.projectId === projectConfig.id);

    if (!projectExists) {
      console.log(`⚠️  Project "${projectConfig.id}" not found in your Firebase account`);
      console.log(`   Please create it manually in Firebase Console:`);
      console.log(`   https://console.firebase.google.com/`);
      console.log(`   Name: ${projectConfig.name}`);
      console.log(`   ID: ${projectConfig.id}`);
      console.log('');
      return false;
    }

    // Add project to local Firebase configuration
    try {
      execSync(`firebase use --add`, { input: `${projectConfig.id}\n${projectKey}\n`, stdio: 'pipe' });
      console.log(`✅ Added ${projectKey} project to local config`);
    } catch (error) {
      // Project might already be added
      console.log(`ℹ️  ${projectKey} project already configured locally`);
    }

    return true;
  } catch (error) {
    console.error(`❌ Error setting up ${projectKey} project:`, error.message);
    return false;
  }
}

// 🔌 PLUG-IN: Generate environment files
function generateEnvironmentFiles() {
  console.log('\n📝 Generating environment files...');

  const envExamplePath = path.join(__dirname, '..', '.env.example');
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  const envProdPath = path.join(__dirname, '..', '.env.production');

  // Read template
  let envTemplate = '';
  if (fs.existsSync(envExamplePath)) {
    envTemplate = fs.readFileSync(envExamplePath, 'utf8');
  } else {
    console.log('⚠️  .env.example not found, creating basic template');
    envTemplate = `# Firebase Configuration Template
# Replace with actual values from Firebase Console

# Development
VITE_FIREBASE_API_KEY=your_dev_api_key
VITE_FIREBASE_PROJECT_ID=tchova-digital-dev
VITE_FIREBASE_AUTH_DOMAIN=tchova-digital-dev.firebaseapp.com

# Production
# VITE_FIREBASE_API_KEY=your_prod_api_key
# VITE_FIREBASE_PROJECT_ID=tchova-digital-prod
# VITE_FIREBASE_AUTH_DOMAIN=tchova-digital-prod.firebaseapp.com

VITE_WHATSAPP_NUMBER=+258879097249
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
`;
  }

  // Generate .env.local (development)
  if (!fs.existsSync(envLocalPath)) {
    const devEnv = envTemplate.replace(/your_dev_/g, 'your_');
    fs.writeFileSync(envLocalPath, devEnv);
    console.log('✅ Created .env.local for development');
  } else {
    console.log('ℹ️  .env.local already exists');
  }

  // Generate .env.production
  if (!fs.existsSync(envProdPath)) {
    const prodEnv = envTemplate
      .replace(/your_dev_/g, 'your_prod_')
      .replace(/tchova-digital-dev/g, 'tchova-digital-prod')
      .replace(/tchova-digital-dev\.firebaseapp\.com/g, 'tchova-digital-prod.firebaseapp.com');
    fs.writeFileSync(envProdPath, prodEnv);
    console.log('✅ Created .env.production for production');
  } else {
    console.log('ℹ️  .env.production already exists');
  }
}

// 🔌 PLUG-IN: Setup hosting configuration
function setupHostingConfig() {
  console.log('\n🏠 Setting up hosting configuration...');

  const firebaseJsonPath = path.join(__dirname, '..', 'firebase.json');

  if (fs.existsSync(firebaseJsonPath)) {
    console.log('✅ firebase.json already exists');
  } else {
    console.log('⚠️  firebase.json not found');
    console.log('Run: firebase init hosting');
  }
}

// 🔌 PLUG-IN: Generate setup summary
function generateSetupSummary(successfulProjects) {
  console.log('\n🎉 Firebase Projects Setup Complete!');
  console.log('====================================');

  console.log('\n📋 Summary:');
  Object.keys(projects).forEach(key => {
    const status = successfulProjects.includes(key) ? '✅' : '❌';
    console.log(`${status} ${key}: ${projects[key].name}`);
  });

  console.log('\n📝 Next Steps:');
  console.log('1. Go to Firebase Console and create the missing projects');
  console.log('2. Enable Authentication, Firestore, and Hosting for each project');
  console.log('3. Copy API keys from Console to .env files');
  console.log('4. Run: npm run emulators (to test locally)');
  console.log('5. Run: npm run deploy:dev (to deploy development)');

  console.log('\n🔗 Useful Links:');
  console.log('- Firebase Console: https://console.firebase.google.com/');
  console.log('- Setup Guide: FIREBASE_CONSOLE_SETUP.md');
  console.log('- Project Documentation: FIREBASE_SETUP.md');

  console.log('\n🔧 Commands:');
  console.log('- firebase projects:list  # List your projects');
  console.log('- firebase use           # Check active project');
  console.log('- npm run config:check   # Validate configuration');
}

// 🔌 PLUG-IN: Main execution
async function main() {
  try {
    console.log('🔌 TchovaDigital Firebase Projects Setup');
    console.log('=========================================\n');

    checkFirebaseCLI();
    checkLoginStatus();

    const successfulProjects = [];

    // Setup each project
    for (const [key, config] of Object.entries(projects)) {
      if (setupProjectInCLI(key, config)) {
        successfulProjects.push(key);
      }
    }

    generateEnvironmentFiles();
    setupHostingConfig();
    generateSetupSummary(successfulProjects);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you are logged in: firebase login');
    console.log('2. Check your internet connection');
    console.log('3. Verify project permissions in Firebase Console');
    process.exit(1);
  }
}

// Run the script
main();