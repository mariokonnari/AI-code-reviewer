const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCRVtSY92GJjN-dZZ2OI88Ds5uBCfy9Txc'); // Replace with actual key

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    
    // Method 1: Try to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCRVtSY92GJjN-dZZ2OI88Ds5uBCfy9Txc` // Replace with actual key
    );
    
    const data = await response.json();
    
    if (data.models) {
      console.log('✅ Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        console.log(`  Supported: ${model.supportedGenerationMethods?.join(', ')}`);
      });
    } else {
      console.log('❌ Error:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();