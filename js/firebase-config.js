// Firebase and Cloudinary Configuration Credentials
// Saved with your project database & media hosting keys.

const firebaseConfig = {
  apiKey: "AIzaSyBu1t-Aag-lH-YW9m__Qu2nwSwsherJFk4",
  authDomain: "techhub-a270f.firebaseapp.com",
  projectId: "techhub-a270f",
  storageBucket: "techhub-a270f.firebasestorage.app",
  messagingSenderId: "620602462312",
  appId: "1:620602462312:web:7d97cc1e73578b2586ebdd"
};

const cloudinaryConfig = {
  cloudName: "dn2yrgpud",
  uploadPreset: "techhub_upload" // Signed Mode: Unsigned, Folder: posts
};

// Checkers to identify if credentials have been populated
function isFirebaseConfigured() {
  return (
    firebaseConfig &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "YOUR_FIREBASE_PROJECT_ID" &&
    firebaseConfig.projectId.trim() !== ""
  );
}

function isCloudinaryConfigured() {
  return (
    cloudinaryConfig &&
    cloudinaryConfig.cloudName &&
    cloudinaryConfig.cloudName !== "YOUR_CLOUDINARY_CLOUD_NAME" &&
    cloudinaryConfig.cloudName.trim() !== ""
  );
}
