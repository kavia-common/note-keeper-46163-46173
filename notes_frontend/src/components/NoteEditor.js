import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditor({
  note,
  onSave,
  onNew,
  saving = false,
}) {
  /** Editor for a single note with title, content, Save and New Note actions. */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note?.id]); // reset when selected note changes

  const handleSave = () => {
    onSave && onSave({ title, content });
  };

  return (
    <div className="editor">
      <div className="editor-actions">
        <button className="btn" onClick={onNew} title="Create a new note">
          + New Note
        </button>
        <button className="btn primary" onClick={handleSave} disabled={saving} title="Save note">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <input
        className="input title-input"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Note title"
      />
      <textarea
        className="textarea"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Note content"
      />
    </div>
  );
}
