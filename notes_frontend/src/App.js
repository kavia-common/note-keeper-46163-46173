import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { fetchNotes, getNote, createNote, updateNote, deleteNote } from './api';
import SearchBar from './components/SearchBar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';

// PUBLIC_INTERFACE
function App() {
  /** Notes application UI with sidebar, search, and editor. */
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load notes list
  const loadNotes = async (query = '') => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await fetchNotes(query);
      setNotes(data || []);
      return data || [];
    } catch (e) {
      setError(e.message || 'Failed to load notes');
      return [];
    } finally {
      setLoadingList(false);
    }
  };

  // Load specific note
  const loadNote = async (id) => {
    if (!id) {
      setSelectedNote(null);
      return;
    }
    setLoadingNote(true);
    setError(null);
    try {
      const data = await getNote(id);
      setSelectedNote(data);
    } catch (e) {
      setError(e.message || 'Failed to load note');
    } finally {
      setLoadingNote(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadNotes('');
  }, []);

  // When selection changes, load that note
  useEffect(() => {
    if (selectedNoteId) {
      loadNote(selectedNoteId);
    } else {
      setSelectedNote(null);
    }
  }, [selectedNoteId]);

  const onSearch = async (q) => {
    setSearchQuery(q);
    const list = await loadNotes(q);
    // Keep selection if still present; otherwise clear
    if (selectedNoteId && !list.some((n) => n.id === selectedNoteId)) {
      setSelectedNoteId(null);
    }
  };

  const handleSelect = (id) => {
    setSelectedNoteId(id);
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await deleteNote(id);
      // Refresh list and selection
      const list = await loadNotes(searchQuery);
      if (selectedNoteId === id) {
        // Choose next available note or clear
        if (list.length > 0) {
          setSelectedNoteId(list[0].id);
        } else {
          setSelectedNoteId(null);
        }
      }
    } catch (e) {
      setError(e.message || 'Delete failed');
    }
  };

  const handleNew = () => {
    // Clear selection to create new
    setSelectedNoteId(null);
    setSelectedNote({ title: '', content: '' });
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setError(null);
    try {
      if (selectedNoteId) {
        const updated = await updateNote(selectedNoteId, payload);
        // Refresh list and reload selected note
        await loadNotes(searchQuery);
        setSelectedNoteId(updated.id);
        setSelectedNote(updated);
      } else {
        const created = await createNote(payload);
        const list = await loadNotes(searchQuery);
        // Ensure the newly created is selected if it's in the list
        setSelectedNoteId(created.id);
        // If query filters it out, still keep editor with created data
        setSelectedNote(created);
      }
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const headerTitle = useMemo(() => 'Notes', []);

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          <span className="brand-dot" />
          <h1>{headerTitle}</h1>
        </div>
        <div className="header-actions">
          <SearchBar value={searchQuery} onChange={onSearch} />
        </div>
      </header>

      <div className="content">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="muted">{loadingList ? 'Loading…' : `${notes.length} notes`}</span>
          </div>
          <NotesList
            notes={notes}
            selectedId={selectedNoteId}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </aside>

        <main className="main">
          {error && <div className="alert error" role="alert">{error}</div>}
          {loadingNote && <div className="muted">Loading note…</div>}
          {!selectedNoteId && !selectedNote && <EmptyState />}
          <NoteEditor
            note={selectedNote}
            onSave={handleSave}
            onNew={handleNew}
            saving={saving}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
