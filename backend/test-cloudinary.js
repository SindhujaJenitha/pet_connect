require('dotenv').config();

console.log('Testing Cloudinary Configuration...\n');

console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log('\nCloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY);
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET.substring(0, 10) + '...');
}