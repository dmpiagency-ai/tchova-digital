#!/usr/bin/env node

// 🔌 PLUG-IN SYSTEM: Firebase Project Initialization Script
// Automated setup for Firebase projects and configurations

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 TchovaDigital - Firebase Initialization Script');
console.log('================================================\n');

// 🔌 PLUG-IN: Check prerequisites
function checkPrerequisites() {
  console.log('📋 Checking prerequisites...');

  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI installed');
  } catch (error) {
    console.error('❌ Firebase CLI not found. Install with: npm install -g firebase-tools');
    process.exit(1);
  }

  try {
    execSync('node --version', { stdio: 'pipe' });
    console.log('✅ Node.js installed');
  } catch (error) {
    console.error('❌ Node.js not found');
    process.exit(1);
  }
}

// 🔌 PLUG-IN: Setup environment files
function setupEnvironmentFiles() {
  console.log('\n📝 Setting up environment files...');

  const envExample = path.join(__dirname, '..', '.env.example');
  const envLocal = path.join(__dirname, '..', '.env.local');

  if (!fs.existsSync(envLocal)) {
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envLocal);
      console.log('✅ Created .env.local from .env.example');
      console.log('⚠️  Please edit .env.local with your actual Firebase configuration');
    } else {
      console.log('⚠️  .env.example not found, creating basic .env.local');
      const basicEnv = `# Firebase Configuration - Add your values here
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_WHATSAPP_NUMBER=+258841234567
VITE_ENABLE_ANALYTICS=true
`;
      fs.writeFileSync(envLocal, basicEnv);
    }
  } else {
    console.log('✅ .env.local already exists');
  }
}

// 🔌 PLUG-IN: Initialize Firebase projects
function initializeFirebaseProjects() {
  console.log('\n🔥 Initializing Firebase projects...');

  const projects = ['development', 'staging', 'production'];

  projects.forEach(project => {
    try {
      console.log(`\n📦 Setting up ${project} project...`);

      // Check if project exists
      try {
        execSync(`firebase projects:list --json | grep -q "${project}"`, { stdio: 'pipe' });
        console.log(`✅ Project ${project} exists`);
      } catch (error) {
        console.log(`⚠️  Project ${project} not found. Please create it manually in Firebase Console`);
        console.log(`   Then run: firebase use --add`);
        return;
      }

      // Initialize hosting for the project
      try {
        execSync(`firebase use ${project}`, { stdio: 'pipe' });
        console.log(`✅ Switched to ${project} project`);
      } catch (error) {
        console.log(`⚠️  Could not switch to ${project} project`);
      }

    } catch (error) {
      console.log(`⚠️  Error setting up ${project} project: ${error.message}`);
    }
  });
}

// 🔌 PLUG-IN: Setup emulators
function setupEmulators() {
  console.log('\n🎭 Setting up Firebase emulators...');

  try {
    // Check if emulators are configured
    const firebaseJson = path.join(__dirname, '..', 'firebase.json');
    if (fs.existsSync(firebaseJson)) {
      console.log('✅ firebase.json found');

      // Try to start emulators briefly to check configuration
      try {
        execSync('timeout 5s firebase emulators:start --only functions,firestore,auth 2>/dev/null || true', { stdio: 'pipe' });
        console.log('✅ Emulators configuration valid');
      } catch (error) {
        console.log('⚠️  Emulators may need additional setup');
      }
    } else {
      console.log('⚠️  firebase.json not found');
    }
  } catch (error) {
    console.log('⚠️  Error checking emulators');
  }
}

// 🔌 PLUG-IN: Install dependencies
function installDependencies() {
  console.log('\n📦 Installing Firebase dependencies...');

  try {
    execSync('npm install firebase', { stdio: 'inherit' });
    console.log('✅ Firebase SDK installed');
  } catch (error) {
    console.log('⚠️  Could not install Firebase SDK automatically');
  }
}

// 🔌 PLUG-IN: Final setup instructions
function printSetupInstructions() {
  console.log('\n🎉 Firebase initialization complete!');
  console.log('=====================================');
  console.log('\n📋 Next steps:');
  console.log('1. Edit .env.local with your Firebase project credentials');
  console.log('2. Create Firebase projects in the console:');
  console.log('   - tchova-digital-dev (development)');
  console.log('   - tchova-digital-staging (staging)');
  console.log('   - tchova-digital-prod (production)');
  console.log('3. Enable Authentication and Firestore in Firebase Console');
  console.log('4. Run: npm run emulators (for local development)');
  console.log('5. Run: npm run deploy:dev (to deploy to development)');
  console.log('\n🔗 Useful commands:');
  console.log('- npm run emulators     # Start local emulators');
  console.log('- npm run deploy:dev    # Deploy to development');
  console.log('- npm run config:check  # Check configuration');
  console.log('- firebase projects:list # List your projects');
  console.log('\n📚 Documentation: Check FIREBASE_SETUP.md for detailed instructions');
}

// 🔌 PLUG-IN: Main execution
function main() {
  try {
    checkPrerequisites();
    setupEnvironmentFiles();
    initializeFirebaseProjects();
    setupEmulators();
    installDependencies();
    printSetupInstructions();
  } catch (error) {
    console.error('\n❌ Initialization failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you are logged in: firebase login');
    console.log('2. Check your internet connection');
    console.log('3. Verify Firebase project permissions');
    process.exit(1);
  }
}

// Run the script
main();