import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Loader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-amber-600 font-medium">Loading your notes...</p>
        </div>
    </div>
);

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        const token = localStorage.getItem('firebaseToken');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('firebaseToken');
            if (!token) {
                setError("Please sign in to view notes");
                setLoading(false);
                return;
            }
            const response = await fetch("/api/notes", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                setError(`Failed to fetch notes: ${response.status}`);
                setLoading(false);
                return;
            }
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            setError("Error fetching notes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('firebaseToken');
            const response = await fetch("/api/notes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newNote)
            });
            if (response.ok) {
                setShowModal(false);
                setNewNote({ title: '', content: '' });
                fetchNotes();
            }
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    if (loading) return <Loader />;
    if (error) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">{error}</div>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <div className="w-full px-6 lg:px-12 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                        My Notes
                    </h1>
                    <p className="text-amber-700/60 mt-1">Capture your thoughts and ideas</p>
                </div>

                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-amber-800 font-medium text-lg">No notes yet</p>
                        <p className="text-amber-600/60">Create your first note to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {notes.map(note => (
                            <div
                                key={note._id}
                                onClick={() => navigate(`/note/${note._id}`)}
                                className="group p-5 bg-white/80 backdrop-blur-sm border border-amber-100 rounded-2xl cursor-pointer hover:shadow-xl hover:shadow-orange-100 hover:border-orange-200 hover:-translate-y-1 transition-all duration-300"
                            >
                                <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate group-hover:text-orange-600 transition-colors">{note.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{note.content}</p>
                                <div className="mt-4 flex items-center text-xs text-amber-500">
                                    <span>Click to view</span>
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Add Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-orange-100 transition-all duration-300 flex items-center justify-center z-40"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">Create New Note</h2>
                        </div>
                        <form onSubmit={handleAddNote} className="p-6">
                            <input
                                type="text"
                                placeholder="Note title..."
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                className="w-full p-3 border border-amber-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all bg-white text-gray-800"
                                required
                            />
                            <textarea
                                placeholder="Write your note content..."
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                className="w-full p-3 border border-amber-200 rounded-xl mb-4 h-36 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all bg-white text-gray-800"
                                required
                            />
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-md"
                                >
                                    Create Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notes
