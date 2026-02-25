import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id: {
        type: String,
        default: uuidv4,
        unique: true
    }
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
