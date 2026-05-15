import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'

const Loader = () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
                width: '32px', height: '32px', border: '3px solid #e9e9e7',
                borderTopColor: '#37352f', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
            }} />
            <p style={{ fontSize: '14px', color: '#9b9a97', fontWeight: 500 }}>Loading your notes...</p>
        </div>
    </div>
);

// Note color palette (Notion-like)
const NOTE_COLORS = [
    { bg: '#faf3dd', border: '#f0e6b2', label: 'Yellow' },
    { bg: '#e8f5e9', border: '#c8e6c9', label: 'Green' },
    { bg: '#e3f2fd', border: '#bbdefb', label: 'Blue' },
    { bg: '#fce4ec', border: '#f8bbd9', label: 'Pink' },
    { bg: '#f3e5f5', border: '#e1bee7', label: 'Purple' },
    { bg: '#fff3e0', border: '#ffe0b2', label: 'Orange' },
    { bg: '#f7f7f5', border: '#e9e9e7', label: 'Gray' },
];

const getColor = (id) => NOTE_COLORS[parseInt(id?.slice(-2), 16) % NOTE_COLORS.length] || NOTE_COLORS[6];

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [addError, setAddError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Helper: always get a fresh, non-expired token from Firebase
    const getFreshToken = async () => {
        const user = auth.currentUser;
        if (!user) return null;
        try {
            return await user.getIdToken(/* forceRefresh */ false);
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('firebaseToken');
        if (!token && !auth.currentUser) navigate('/');
    }, [navigate]);

    const fetchNotes = async () => {
        try {
            const token = await getFreshToken();
            if (!token) { setError("Please sign in to view notes"); setLoading(false); navigate('/'); return; }
            const response = await fetch("/api/notes", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) { setError(`Failed to fetch notes: ${response.status}`); setLoading(false); return; }
            const data = await response.json();
            setNotes(data);
        } catch (err) {
            setError("Error fetching notes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotes(); }, []);

    const handleAddNote = async (e) => {
        e.preventDefault();
        setAddError(null);
        try {
            const token = await getFreshToken();
            if (!token) { setAddError('Session expired. Please sign in again.'); return; }
            const response = await fetch("/api/notes", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newNote)
            });
            if (response.ok) {
                setShowModal(false);
                setNewNote({ title: '', content: '' });
                fetchNotes();
            } else {
                const data = await response.json();
                setAddError(data.message || 'Failed to create note.');
            }
        } catch (err) {
            setAddError("Network error. Please try again.");
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <Loader />;
    if (error) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px 24px', borderRadius: '10px', fontSize: '14px' }}>
                ⚠️ {error}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 52px)', backgroundColor: '#ffffff' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#37352f', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        My Notes
                    </h1>
                    <p style={{ fontSize: '14px', color: '#9b9a97' }}>
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'} — capture your thoughts and ideas
                    </p>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9b9a97' }}
                            width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px 8px 36px',
                                borderRadius: '8px',
                                border: '1px solid #e9e9e7',
                                fontSize: '14px',
                                color: '#37352f',
                                backgroundColor: '#f7f7f5',
                                outline: 'none',
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#2383e2'}
                            onBlur={e => e.target.style.borderColor = '#e9e9e7'}
                        />
                    </div>

                    {/* New Note button */}
                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#37352f',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1915'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#37352f'}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        New Note
                    </button>
                </div>

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#9b9a97' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                        <p style={{ fontSize: '16px', fontWeight: 500, color: '#37352f', marginBottom: '8px' }}>
                            {searchQuery ? 'No matching notes' : 'No notes yet'}
                        </p>
                        <p style={{ fontSize: '14px' }}>
                            {searchQuery ? 'Try a different search term' : 'Click "New Note" to create your first note'}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '16px',
                    }}>
                        {filteredNotes.map(note => {
                            const color = getColor(note._id);
                            return (
                                <div
                                    key={note._id}
                                    onClick={() => navigate(`/note/${note._id}`)}
                                    style={{
                                        padding: '20px',
                                        backgroundColor: color.bg,
                                        border: `1px solid ${color.border}`,
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                        minHeight: '140px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <h3 style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        color: '#37352f',
                                        marginBottom: '10px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {note.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        lineHeight: 1.6,
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        flex: 1,
                                    }}>
                                        {note.content}
                                    </p>
                                    <div style={{ marginTop: '14px', fontSize: '12px', color: '#9b9a97', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Open
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Note Modal */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 50, padding: '16px',
                        animation: 'backdropIn 0.15s ease',
                    }}
                    onClick={e => e.target === e.currentTarget && setShowModal(false)}
                >
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '520px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        animation: 'modalSlideIn 0.2s ease',
                        overflow: 'hidden',
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '20px 24px 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#37352f' }}>New Note</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9b9a97', padding: '4px', borderRadius: '6px', display: 'flex' }}
                            >
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddNote} style={{ padding: '16px 24px 24px' }}>
                            {addError && (
                                <div style={{ marginBottom: '12px', padding: '10px 14px', backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#b91c1c' }}>
                                    {addError}
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Note title..."
                                value={newNote.title}
                                onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #e9e9e7',
                                    borderRadius: '8px',
                                    marginBottom: '12px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#37352f',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#2383e2'}
                                onBlur={e => e.target.style.borderColor = '#e9e9e7'}
                                required
                            />
                            <textarea
                                placeholder="Write your note content..."
                                value={newNote.content}
                                onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #e9e9e7',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    height: '140px',
                                    resize: 'none',
                                    fontSize: '14px',
                                    color: '#37352f',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    lineHeight: 1.6,
                                    transition: 'border-color 0.15s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#2383e2'}
                                onBlur={e => e.target.style.borderColor = '#e9e9e7'}
                                required
                            />
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setAddError(null); }}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '7px',
                                        border: '1px solid #e9e9e7',
                                        backgroundColor: 'transparent',
                                        color: '#37352f',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.15s',
                                    }}
                                    onMouseEnter={e => e.target.style.backgroundColor = '#f7f7f5'}
                                    onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: '7px',
                                        border: 'none',
                                        backgroundColor: '#37352f',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'background-color 0.15s',
                                    }}
                                    onMouseEnter={e => e.target.style.backgroundColor = '#1a1915'}
                                    onMouseLeave={e => e.target.style.backgroundColor = '#37352f'}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
