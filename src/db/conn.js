const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/registration', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connection successful');
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

connectToDatabase();
