import express from "express";
const router = express.Router();
import verifyFirebaseToken from "../verifyFirebaseToken.js";
import Note from '../models/note.js';



router.get('/', (req, res) => {
    res.send('hii');
});

router.route('/notes')
    .get(verifyFirebaseToken, async (req, res) => {
        try {
            const userId = req.user.uid; // Firebase UID from verified token
            const User = (await import('../models/user.js')).default;
            const user = await User.findOne({ firebaseId: userId });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            const notes = await Note.find({ user: user._id });
            res.json(notes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(verifyFirebaseToken, async (req, res) => {
        try {
            const { title, content } = req.body;
            const userId = req.user.uid; // Firebase UID from verified token

            // Find or create user by firebaseId
            const User = (await import('../models/user.js')).default;
            let user = await User.findOne({ firebaseId: userId });
            if (!user) {
                return res.status(404).json({ message: 'User not found, please sign in again' });
            }

            const newNote = new Note({ title, content, user: user._id });
            const savedNote = await newNote.save();

            res.status(201).json(savedNote);
            console.log('Note created:', savedNote);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.get('/notes/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.uid;
        const User = (await import('../models/user.js')).default;
        const user = await User.findOne({ firebaseId: userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const note = await Note.findOne({ _id: noteId, user: user._id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/notes/:id', verifyFirebaseToken, async(req,res)=>{
    try{
        const noteId = req.params.id;
        const { title, content } = req.body;
        const userId = req.user.uid;
        const User = (await import('../models/user.js')).default;
        const user = await User.findOne({ firebaseId: userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, user: user._id },
            { title, content, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json(updatedNote);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});

router.delete('/notes/:id', verifyFirebaseToken, async(req,res)=>{
    try{
        const noteId = req.params.id;
        const userId = req.user.uid;
        const User = (await import('../models/user.js')).default;
        const user = await User.findOne({ firebaseId: userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const deletedNote = await Note.findOneAndDelete({ _id: noteId, user: user._id });
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found or access denied' });
        }
        res.json({ message: 'Note deleted successfully' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});   

export default router;