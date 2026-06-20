const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Set public DNS servers to resolve MongoDB Atlas SRV records reliably
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const url = process.env.MONGODB_URL;
console.log('Testing connection to MONGODB_URL:', url);

async function run() {
  try {
    const start = Date.now();
    await mongoose.connect(url || '');
    console.log(`Connected successfully in ${Date.now() - start}ms`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

run();
