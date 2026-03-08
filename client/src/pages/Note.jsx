import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Loader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-amber-200 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-amber-600 font-medium">Loading note...</p>
        </div>
    </div>
);

const Note = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: '', content: '' });

    // Redirect if not authenticated
    useEffect(() => {
        const token = localStorage.getItem('firebaseToken');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem('firebaseToken');
                const response = await fetch(`/api/notes/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    setError('Note not found');
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setNote(data);
                setEditData({ title: data.title, content: data.content });
            } catch (error) {
                setError('Error fetching note');
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            const token = localStorage.getItem('firebaseToken');
            await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/notes');
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('firebaseToken');
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editData)
            });
            if (response.ok) {
                const updated = await response.json();
                setNote(updated);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    if (loading) return <Loader />;
    if (error) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">{error}</div>
        </div>
    );
    if (!note) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-amber-600">Note not found</div>
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <div className="w-full px-6 lg:px-12 py-8">
                <button
                    onClick={() => navigate('/notes')}
                    className="mb-6 flex items-center gap-2 text-amber-600 hover:text-orange-600 transition-colors font-medium group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Notes
                </button>

                {isEditing ? (
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleUpdate} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-amber-100 shadow-xl">
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full p-4 border border-amber-200 rounded-xl mb-4 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent bg-white text-gray-800"
                                required
                            />
                            <textarea
                                value={editData.content}
                                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                className="w-full p-4 border border-amber-200 rounded-xl mb-6 h-64 resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent bg-white text-gray-800"
                                required
                            />
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-md"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 border border-amber-200 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-amber-100 shadow-xl">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-6">{note.title}</h1>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg mb-8">{note.content}</p>
                            <div className="flex gap-3 pt-6 border-t border-amber-100">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-medium shadow-md flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium shadow-md flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
        </div>
    )
}


export default Note
