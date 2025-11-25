import React from 'react';

// PUBLIC_INTERFACE
export default function NotesList({ notes, selectedId, onSelect, onDelete }) {
  /** Renders a list of notes with title and preview; supports select and delete. */
  return (
    <div className="notes-list" role="navigation" aria-label="Notes list">
      {notes && notes.length > 0 ? (
        notes.map((n) => {
          const isActive = n.id === selectedId;
          const preview =
            (n.content || '').length > 80
              ? `${n.content.slice(0, 80)}…`
              : (n.content || '');
          return (
            <div
              key={n.id}
              className={`note-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelect && onSelect(n.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect && onSelect(n.id);
                }
              }}
            >
              <div className="note-item-main">
                <div className="note-title">{n.title || 'Untitled'}</div>
                <div className="note-preview">{preview}</div>
              </div>
              <button
                className="btn btn-ghost danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(n.id);
                }}
                aria-label={`Delete note ${n.title || n.id}`}
                title="Delete"
              >
                ✕
              </button>
            </div>
          );
        })
      ) : (
        <div className="empty-hint">No notes found.</div>
      )}
    </div>
  );
}
