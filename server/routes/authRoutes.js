import express from "express";
const router = express.Router();
import verifyFirebaseToken from "../verifyFirebaseToken.js";
import User from '../models/user.js';

router.post("/google", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    let user = await User.findOne({ firebaseId: uid });

    if (!user) {
      user = await User.create({
        firebaseId: uid,
        email,
        username: name || email,
        name: name || ''
      });
      console.log('New user created:', user);
    } else {
      console.log('Existing user signed in:', user.email);
    }

    res.json(user);
  } catch (error) {
    console.error("Error in Google auth route:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;