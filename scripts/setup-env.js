const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envExamplePath = path.join(__dirname, '..', '.env.example');
const envPath = path.join(__dirname, '..', '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
}

console.log('🚀 Setting up your .env file...\n');

// Read the example file
const envExample = fs.readFileSync(envExamplePath, 'utf8');

// Replace placeholders with user input
const questions = [
  { key: 'VITE_SUPABASE_URL', message: 'Enter your Supabase URL:' },
  { key: 'VITE_SUPABASE_ANON_KEY', message: 'Enter your Supabase Anon Key:' },
  { key: 'VITE_SUPABASE_SERVICE_ROLE_KEY', message: 'Enter your Supabase Service Role Key:' },
  { key: 'VITE_GEMINI_API_KEY', message: 'Enter your Gemini API Key:' }
];

const answers = {};

const askQuestion = (index) => {
  if (index >= questions.length) {
    // All questions answered, write the .env file
    let envContent = envExample;
    Object.entries(answers).forEach(([key, value]) => {
      const regex = new RegExp(`${key}=.*`, 'g');
      envContent = envContent.replace(regex, `${key}=${value}`);
    });
    
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('🔒 Make sure to add .env to your .gitignore file!');
    process.exit(0);
  }

  const { key, message } = questions[index];
  rl.question(`${message} `, (answer) => {
    answers[key] = answer.trim();
    askQuestion(index + 1);
  });
};

// Start asking questions
askQuestion(0);
