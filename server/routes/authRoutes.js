import express from "express";
const router = express.Router();
import verifyFirebaseToken from "../verifyFirebaseToken.js";
import User from '../models/user.js';

router.post("/google", verifyFirebaseToken, async (req, res) => {

  console.log('Decoded Firebase user:', req.user);
  const { uid, email, name } = req.user;

  let user = await User.findOne({ firebaseId: uid });

  if (!user) {
    try {
      user = await User.create({
      firebaseId: uid,
      email,
      username: name || email,
      name: name || ''
      });
        console.log(user);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }else{
    console.log("error")
  }

  res.json(user);
});

export default router;