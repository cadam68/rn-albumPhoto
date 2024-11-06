
import { FIREBASE_PROJECT_ID } from '@env';


module.exports = {
  // --- authentication ---
  storageBucket: process.env.FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID,
  // --- business properties ---
  imageRepository: 'album/tmp/%(userId)s',
  imageName: '%(userId)s-%(isoCountryCode)s-%(category)s-%(date)s.jpg'
};


