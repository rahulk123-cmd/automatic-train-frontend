#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Trusted Supplier Marketplace Frontend Setup');
console.log('==============================================\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.blue}${step}${colors.reset} ${message}`);
}

// Check if .env exists and create if needed
function setupEnvironment() {
  logStep('📝', 'Setting up environment variables...');
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ .env file created from template', 'green');
      log('⚠️  Please update the .env file with your backend URL', 'yellow');
    } else {
      log('❌ .env.example file not found', 'red');
      process.exit(1);
    }
  } else {
    log('✅ .env file already exists', 'green');
  }
}

// Check dependencies
function checkDependencies() {
  logStep('📦', 'Checking dependencies...');
  
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json not found', 'red');
    process.exit(1);
  }
  
  if (!fs.existsSync(nodeModulesPath)) {
    log('📦 Dependencies not installed', 'yellow');
    log('   Run: npm install', 'blue');
    return false;
  } else {
    log('✅ Dependencies are installed', 'green');
    return true;
  }
}

// Validate environment variables
function validateEnvironment() {
  logStep('🔍', 'Validating environment configuration...');
  
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found', 'red');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['VITE_API_URL'];
  
  const missingVars = requiredVars.filter(varName => {
    return !envContent.includes(`${varName}=`);
  });
  
  if (missingVars.length > 0) {
    log('⚠️  Missing required environment variables:', 'yellow');
    missingVars.forEach(varName => {
      log(`   - ${varName}`, 'red');
    });
    return false;
  }
  
  log('✅ Environment variables configured', 'green');
  return true;
}

// Test build process
function testBuild() {
  logStep('🧪', 'Testing build process...');
  
  try {
    // Check if Vite config exists
    const viteConfigPath = path.join(__dirname, 'vite.config.ts');
    if (!fs.existsSync(viteConfigPath)) {
      log('❌ vite.config.ts not found', 'red');
      return false;
    }
    
    // Check if main entry point exists
    const mainPath = path.join(__dirname, 'src', 'main.jsx');
    if (!fs.existsSync(mainPath)) {
      log('❌ src/main.jsx not found', 'red');
      return false;
    }
    
    log('✅ Build configuration looks good', 'green');
    return true;
  } catch (error) {
    log('❌ Build test failed', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Check for common issues
function checkCommonIssues() {
  logStep('🛠️', 'Checking for common issues...');
  let issues = false;

  // Check if backend is running
  try {
    const apiUrl = getApiUrl();
    if (apiUrl) {
      const healthUrl = apiUrl.replace(/\/api$/, '/health');
      execSync(`curl --max-time 2 -s ${healthUrl}`, { stdio: 'ignore' });
      log('✅ Backend health check passed', 'green');
    } else {
      log('⚠️  VITE_API_URL not set, cannot check backend health', 'yellow');
      issues = true;
    }
  } catch {
    log('❌ Backend health check failed. Is your backend running?', 'red');
    issues = true;
  }

  // Check for port conflicts (default Vite port 5173)
  try {
    execSync('netstat -ano | findstr :5173', { stdio: 'pipe' });
    log('⚠️  Port 5173 appears to be in use. You may need to stop another process or change the Vite port.', 'yellow');
    issues = true;
  } catch {
    // No conflict
  }

  // Check for .env misconfiguration
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (/localhost:3001\/api/.test(envContent) && !envContent.includes('VITE_API_URL=')) {
      log('⚠️  .env file may be misconfigured. Please check VITE_API_URL.', 'yellow');
      issues = true;
    }
  }

  if (issues) {
    log('\nSome issues were detected. Please review the messages above and consult the README for troubleshooting tips.', 'yellow');
  } else {
    log('No common issues detected. You are good to go!', 'green');
  }
}

function getApiUrl() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return null;
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^VITE_API_URL=(.*)$/m);
  return match ? match[1].trim() : null;
}

// Display setup instructions
function displayInstructions() {
  logStep('📋', 'Setup Instructions');
  
  console.log(`
${colors.bold}1. Backend Setup${colors.reset}
   • Ensure your backend is running on http://localhost:3001
   • Backend should be accessible at http://localhost:3001/health

${colors.bold}2. Environment Configuration${colors.reset}
   • Update .env file with your backend URL:
     VITE_API_URL=http://localhost:3001/api

${colors.bold}3. Start the Frontend${colors.reset}
   • Run: npm run dev
   • Frontend will start on http://localhost:5173

${colors.bold}4. Test the Application${colors.reset}
   • Open http://localhost:5173 in your browser
   • Try logging in with demo credentials
   • Test different user roles (vendor, supplier, admin)

${colors.bold}5. Build for Production${colors.reset}
   • Run: npm run build
   • Deploy the dist folder to your hosting service
`);
}

// Display feature summary
function displayFeatureSummary() {
  logStep('🔗', 'Available Features');
  
  console.log(`
${colors.bold}Authentication:${colors.reset}
   • User registration and login
   • Role-based access control
   • JWT token management

${colors.bold}Vendor Features:${colors.reset}
   • Browse products and suppliers
   • Create and join group orders
   • Manage orders and profile

${colors.bold}Supplier Features:${colors.reset}
   • Add and manage products
   • View group orders
   • Update supplier profile

${colors.bold}Admin Features:${colors.reset}
   • Dashboard with metrics
   • Manage users and suppliers
   • Approve/reject suppliers
   • System statistics

${colors.bold}Shared Features:${colors.reset}
   • Multi-language support (English/Hindi)
   • Real-time notifications
   • Responsive design
`);
}

// Main setup function
async function runSetup() {
  let failed = false;
  try {
    // Step 1: Setup environment
    setupEnvironment();
    
    // Step 2: Check dependencies
    const depsInstalled = checkDependencies();
    if (!depsInstalled) failed = true;
    
    // Step 3: Validate environment
    const envValid = validateEnvironment();
    if (!envValid) failed = true;
    
    // Step 4: Test build
    const buildTest = testBuild();
    if (!buildTest) failed = true;
    
    // Step 5: Display results
    console.log('\n' + '='.repeat(50));
    log('📊 Setup Summary', 'bold');
    console.log('='.repeat(50));
    
    log(`✅ Environment file: ${fs.existsSync(path.join(__dirname, '.env')) ? 'Ready' : 'Missing'}`, 
        fs.existsSync(path.join(__dirname, '.env')) ? 'green' : 'red');
    
    log(`✅ Dependencies: ${depsInstalled ? 'Installed' : 'Missing'}`, 
        depsInstalled ? 'green' : 'yellow');
    
    log(`✅ Environment vars: ${envValid ? 'Configured' : 'Missing'}`, 
        envValid ? 'green' : 'yellow');
    
    log(`✅ Build test: ${buildTest ? 'Passed' : 'Failed'}`, 
        buildTest ? 'green' : 'red');
    
    console.log('\n' + '='.repeat(50));
    
    // Step 6: Display instructions
    displayInstructions();
    
    // Step 7: Display feature summary
    displayFeatureSummary();
    
    // Step 8: Check for common issues
    checkCommonIssues();
    
    // Step 9: Final recommendations
    console.log('\n' + '='.repeat(50));
    log('🎯 Next Steps', 'bold');
    console.log('='.repeat(50));
    
    if (!depsInstalled) {
      log('1. Install dependencies: npm install', 'yellow');
    }
    
    if (!envValid) {
      log('2. Configure .env file with backend URL', 'yellow');
    }
    
    log('3. Start backend server (if not running)', 'blue');
    log('4. Start frontend: npm run dev', 'blue');
    log('5. Open http://localhost:5173 in browser', 'blue');
    log('6. Test with demo credentials', 'blue');
    
    console.log('\n' + '='.repeat(50));
    log('📚 For more details, see the README.md in this directory.', 'bold');
    log('🚀 Ready to build your marketplace!', 'bold');
    console.log('='.repeat(50));
    
    if (failed) {
      log('\n❌ One or more critical setup steps failed. Please fix the above issues and re-run this script.', 'red');
      process.exit(1);
    }
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the setup
runSetup(); 