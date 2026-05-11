import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const Loader = () => (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
                width: '32px', height: '32px', border: '3px solid #e9e9e7',
                borderTopColor: '#37352f', borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
            }} />
            <p style={{ fontSize: '14px', color: '#9b9a97', fontWeight: 500 }}>Loading note...</p>
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
    const [deleteError, setDeleteError] = useState(null);
    const [saveError, setSaveError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('firebaseToken');
        if (!token) navigate('/');
    }, [navigate]);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem('firebaseToken');
                const response = await fetch(`/api/notes/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) { setError('Note not found'); setLoading(false); return; }
                const data = await response.json();
                setNote(data);
                setEditData({ title: data.title, content: data.content });
            } catch (err) {
                setError('Error fetching note');
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        setDeleteError(null);
        try {
            const token = localStorage.getItem('firebaseToken');
            const res = await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                navigate('/notes');
            } else {
                const data = await res.json();
                setDeleteError(data.message || 'Failed to delete note.');
            }
        } catch (err) {
            setDeleteError('Network error. Please try again.');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaveError(null);
        try {
            const token = localStorage.getItem('firebaseToken');
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editData)
            });
            if (response.ok) {
                const updated = await response.json();
                setNote(updated);
                setIsEditing(false);
            } else {
                const data = await response.json();
                setSaveError(data.message || 'Failed to save changes.');
            }
        } catch (err) {
            setSaveError('Network error. Please try again.');
        }
    };

    if (loading) return <Loader />;
    if (error) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px 24px', borderRadius: '10px', fontSize: '14px' }}>
                ⚠️ {error}
            </div>
        </div>
    );
    if (!note) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '14px', color: '#9b9a97' }}>Note not found</div>
        </div>
    );

    return (
        <div style={{ minHeight: 'calc(100vh - 52px)', backgroundColor: '#ffffff' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

                {/* Back button */}
                <button
                    onClick={() => navigate('/notes')}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '32px',
                        padding: '6px 10px',
                        borderRadius: '7px',
                        border: '1px solid #e9e9e7',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f7f7f5'; e.currentTarget.style.color = '#37352f'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
                >
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Notes
                </button>

                {deleteError && (
                    <div style={{ marginBottom: '16px', padding: '12px 16px', backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#b91c1c' }}>
                        ⚠️ {deleteError}
                    </div>
                )}

                {isEditing ? (
                    /* ---- EDIT MODE ---- */
                    <form onSubmit={handleUpdate}>
                        {saveError && (
                            <div style={{ marginBottom: '12px', padding: '10px 14px', backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', color: '#b91c1c' }}>
                                {saveError}
                            </div>
                        )}
                        <input
                            type="text"
                            value={editData.title}
                            onChange={e => setEditData({ ...editData, title: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0',
                                border: 'none',
                                borderBottom: '2px solid #e9e9e7',
                                marginBottom: '24px',
                                paddingBottom: '12px',
                                fontSize: '36px',
                                fontWeight: 700,
                                color: '#37352f',
                                letterSpacing: '-0.02em',
                                outline: 'none',
                                fontFamily: 'inherit',
                                backgroundColor: 'transparent',
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={e => e.target.style.borderBottomColor = '#2383e2'}
                            onBlur={e => e.target.style.borderBottomColor = '#e9e9e7'}
                            placeholder="Untitled"
                            required
                        />
                        <textarea
                            value={editData.content}
                            onChange={e => setEditData({ ...editData, content: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0',
                                border: 'none',
                                borderBottom: '1px solid #e9e9e7',
                                marginBottom: '24px',
                                paddingBottom: '16px',
                                height: '320px',
                                resize: 'none',
                                fontSize: '16px',
                                color: '#37352f',
                                outline: 'none',
                                fontFamily: 'inherit',
                                lineHeight: 1.8,
                                backgroundColor: 'transparent',
                            }}
                            placeholder="Start writing..."
                            required
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
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
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); setSaveError(null); }}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '7px',
                                    border: '1px solid #e9e9e7',
                                    backgroundColor: 'transparent',
                                    color: '#6b7280',
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
                        </div>
                    </form>
                ) : (
                    /* ---- VIEW MODE ---- */
                    <div>
                        {/* Divider top */}
                        <div style={{ borderBottom: '1px solid #e9e9e7', marginBottom: '28px', paddingBottom: '20px' }}>
                            <h1 style={{
                                fontSize: '36px',
                                fontWeight: 700,
                                color: '#37352f',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.2,
                                marginBottom: '0',
                            }}>
                                {note.title}
                            </h1>
                        </div>

                        {/* Content */}
                        <div style={{
                            fontSize: '16px',
                            color: '#37352f',
                            lineHeight: 1.8,
                            whiteSpace: 'pre-wrap',
                            marginBottom: '48px',
                            minHeight: '200px',
                        }}>
                            {note.content}
                        </div>

                        {/* Actions */}
                        <div style={{
                            borderTop: '1px solid #e9e9e7',
                            paddingTop: '20px',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                        }}>
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 16px',
                                    borderRadius: '7px',
                                    border: '1px solid #e9e9e7',
                                    backgroundColor: 'transparent',
                                    color: '#37352f',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f7f7f5'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 16px',
                                    borderRadius: '7px',
                                    border: '1px solid #fecaca',
                                    backgroundColor: 'transparent',
                                    color: '#dc2626',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff5f5'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Note;
