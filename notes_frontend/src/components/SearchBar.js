import { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function SearchBar({ value, onChange, placeholder = 'Search notes...' }) {
  /** A debounced search input that calls onChange after user stops typing. */
  const [internal, setInternal] = useState(value || '');
  const timerRef = useRef(null);

  useEffect(() => {
    setInternal(value || '');
  }, [value]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (onChange) onChange(internal);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [internal, onChange]);

  return (
    <div className="searchbar">
      <input
        className="input"
        type="text"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        aria-label="Search notes"
      />
    </div>
  );
}
