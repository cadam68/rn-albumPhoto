import { FIREBASE_PROJECT_ID } from "@env";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || FIREBASE_PROJECT_ID;
if (!firebaseProjectId) throw new Error("FIREBASE_PROJECT_ID is not defined. Please check your environment variables.");

module.exports = {
  // --- authentication ---
  storageBucket: firebaseProjectId,
  // --- business properties ---
  imageRepository: "album/tmp/%(userId)s",
  imageName: "%(userId)s-%(isoCountryCode)s-%(category)s-%(date)s.jpg",
};
