#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Nike E-commerce Database...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create .env.local with your DATABASE_URL first.');
  console.log('You can copy from env.example as a starting point.\n');
  process.exit(1);
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL=')) {
  console.log('❌ DATABASE_URL not found in .env.local!');
  console.log('Please add your database connection string to .env.local\n');
  process.exit(1);
}

try {
  console.log('📊 Generating database schema...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  
  console.log('\n📤 Pushing schema to database...');
  execSync('npm run db:push', { stdio: 'inherit' });
  
  console.log('\n🌱 Seeding database with sample products...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup completed successfully!');
  console.log('🎉 You can now run "npm run dev" to start the application.');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\nPlease check your DATABASE_URL and try again.');
  process.exit(1);
}
