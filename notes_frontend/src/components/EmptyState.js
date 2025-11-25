import React from 'react';

// PUBLIC_INTERFACE
export default function EmptyState({ title = 'Select or create a note', description = 'Choose a note from the sidebar or start a new one.' }) {
  /** Simple empty state placeholder for the editor area. */
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
