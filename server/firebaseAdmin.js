import admin from "firebase-admin";
import fs from 'fs';

let serviceAccount;

// In production, use environment variable; locally use file
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;