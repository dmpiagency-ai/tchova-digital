#!/usr/bin/env node

// 🔌 PLUG-IN SYSTEM: GitHub Repository Setup Script
// Automated setup for GitHub repository with proper configuration

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🐙 TchovaDigital - GitHub Repository Setup');
console.log('==========================================\n');

// 🔌 PLUG-IN: Check Git status
function checkGitStatus() {
  console.log('📋 Checking Git status...');

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('⚠️  You have uncommitted changes. Please commit or stash them first.');
      console.log('Run: git add . && git commit -m "Your message"');
      process.exit(1);
    }
    console.log('✅ Working directory is clean');
  } catch (error) {
    console.log('❌ Not a Git repository. Run: git init');
    process.exit(1);
  }
}

// 🔌 PLUG-IN: Check GitHub CLI
function checkGitHubCLI() {
  console.log('\n📋 Checking GitHub CLI...');

  try {
    const version = execSync('gh --version', { encoding: 'utf8' }).split('\n')[0];
    console.log(`✅ ${version}`);
    return true;
  } catch (error) {
    console.log('⚠️  GitHub CLI not found. Install from: https://cli.github.com/');
    console.log('   Or create repository manually on GitHub.com');
    return false;
  }
}

// 🔌 PLUG-IN: Check GitHub authentication
function checkGitHubAuth() {
  console.log('\n📋 Checking GitHub authentication...');

  try {
    const authStatus = execSync('gh auth status', { encoding: 'utf8' });
    if (authStatus.includes('Logged in to github.com')) {
      console.log('✅ Authenticated with GitHub');
      return true;
    }
  } catch (error) {
    console.log('⚠️  Not authenticated with GitHub');
    console.log('Run: gh auth login');
    return false;
  }
}

// 🔌 PLUG-IN: Create GitHub repository
function createGitHubRepo(hasCLI) {
  console.log('\n📦 Creating GitHub repository...');

  const repoName = 'tchova-digital';
  const description = 'Ecossistema Digital 360 - Design, Desenvolvimento Web, Marketing Digital e Assistência GSM para Moçambique';
  const homepage = 'https://tchovadigital.com';

  if (hasCLI) {
    try {
      console.log(`Creating repository: ${repoName}`);

      // Create private repository first (can be made public later)
      execSync(`gh repo create ${repoName} --description "${description}" --homepage "${homepage}" --public --source=. --remote=origin --push`, {
        stdio: 'inherit'
      });

      console.log('✅ Repository created and pushed to GitHub!');
      return true;
    } catch (error) {
      console.log('⚠️  Could not create repository automatically');
      console.log('Please create it manually on GitHub.com');
      return false;
    }
  } else {
    console.log('📋 Please create the repository manually:');
    console.log('');
    console.log('1. Go to https://github.com/new');
    console.log(`2. Repository name: ${repoName}`);
    console.log(`3. Description: ${description}`);
    console.log(`4. Homepage: ${homepage}`);
    console.log('5. Make it Public');
    console.log('6. Do NOT initialize with README, .gitignore, or license');
    console.log('');
    console.log('After creating, run:');
    console.log('git push -u origin master');
    console.log('');
    return false;
  }
}

// 🔌 PLUG-IN: Setup repository settings
function setupRepositorySettings(hasCLI) {
  if (!hasCLI) return;

  console.log('\n⚙️  Configuring repository settings...');

  try {
    // Add topics
    execSync('gh repo edit --add-topic "react,typescript,firebase,mozambique,digital-agency"', { stdio: 'pipe' });

    // Enable issues and discussions
    execSync('gh repo edit --enable-issues --enable-discussions', { stdio: 'pipe' });

    // Add description
    execSync('gh repo edit --description "Ecossistema Digital 360 - Design, Desenvolvimento Web, Marketing Digital e Assistência GSM para Moçambique"', { stdio: 'pipe' });

    console.log('✅ Repository settings configured');
  } catch (error) {
    console.log('⚠️  Could not configure repository settings');
  }
}

// 🔌 PLUG-IN: Create GitHub Actions workflow
function createGitHubActions() {
  console.log('\n🤖 Setting up GitHub Actions...');

  const workflowsDir = path.join(__dirname, '..', '.github', 'workflows');
  const deployWorkflow = path.join(workflowsDir, 'firebase-deploy.yml');

  // Create workflows directory
  if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
  }

  // Create Firebase deploy workflow
  const workflowContent = `# Firebase Deploy Workflow
name: Deploy to Firebase

on:
  push:
    branches: [ master, main ]
  pull_request:
    branches: [ master, main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: \${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_PROJECT_ID: \${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_AUTH_DOMAIN: \${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_WHATSAPP_NUMBER: \${{ secrets.VITE_WHATSAPP_NUMBER }}

    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: \${{ secrets.GITHUB_TOKEN }}
        firebaseServiceAccount: \${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        channelId: live
        projectId: tchova-digital-prod
`;

  fs.writeFileSync(deployWorkflow, workflowContent);
  console.log('✅ GitHub Actions workflow created');
}

// 🔌 PLUG-IN: Final setup instructions
function printFinalInstructions(autoCreated) {
  console.log('\n🎉 GitHub Repository Setup Complete!');
  console.log('=====================================');

  if (autoCreated) {
    console.log('\n✅ Repository created and configured automatically!');
    console.log('🌐 Visit: https://github.com/dmpiagency-ai/tchova-digital');
  } else {
    console.log('\n📋 Next Steps:');
    console.log('1. Create repository on GitHub.com (see instructions above)');
    console.log('2. Run: git push -u origin master');
    console.log('3. Visit your repository on GitHub');
  }

  console.log('\n🔧 Optional Enhancements:');
  console.log('- Add repository secrets for GitHub Actions');
  console.log('- Configure branch protection rules');
  console.log('- Add collaborators and teams');
  console.log('- Setup project boards for task management');

  console.log('\n📚 Useful Commands:');
  console.log('git remote -v              # Check remote repository');
  console.log('git log --oneline         # View commit history');
  console.log('gh repo view              # View repository info');
  console.log('gh repo clone <repo>      # Clone repository');

  console.log('\n🎯 Repository URL: https://github.com/dmpiagency-ai/tchova-digital');
}

// 🔌 PLUG-IN: Main execution
async function main() {
  try {
    console.log('🐙 TchovaDigital GitHub Repository Setup');
    console.log('=========================================\n');

    checkGitStatus();

    const hasCLI = checkGitHubCLI();
    const isAuthenticated = hasCLI ? checkGitHubAuth() : false;

    let autoCreated = false;
    if (hasCLI && isAuthenticated) {
      autoCreated = createGitHubRepo(hasCLI);
      if (autoCreated) {
        setupRepositorySettings(hasCLI);
      }
    } else {
      createGitHubRepo(false);
    }

    createGitHubActions();
    printFinalInstructions(autoCreated);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have GitHub CLI installed: https://cli.github.com/');
    console.log('2. Authenticate with GitHub: gh auth login');
    console.log('3. Check your internet connection');
    console.log('4. Verify repository permissions');
    process.exit(1);
  }
}

// Run the script
main();