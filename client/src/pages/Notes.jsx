import React, { useState, useEffect } from 'react'
// import fetch from 'node-fetch';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem('firebaseToken');
                if (!token) {
                    console.error("No token found, please sign in");
                    return;
                }
                const response = await fetch("http://localhost:5000/api/notes", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    console.error("Failed to fetch notes:", response.status);
                    return;
                }
                const data = await response.json();
                setNotes(data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }

        }
        fetchNotes();
    }, [])
        return (
            <>
                <button onClick={() => setNotes([...notes, { title: "New Note", content: "Sample content" }])}>
                    Add Note ({notes.length})
                </button>
                <div>
                    {notes.map(note => (
                        <div key={note._id || note.title}>
                            <p>{note.title}</p>
                            <span>{note.content}</span>
                        </div>
                    ))}
                </div>
            </>
        )
}

export default Notes
