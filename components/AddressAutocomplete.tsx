"use client";

import { useEffect, useRef, useState } from "react";
import { searchPlaces, type GeocodeResult } from "@/lib/geocode";

interface AddressAutocompleteProps {
  value: string;
  onChange: (text: string) => void;
  onSelect: (suggestion: GeocodeResult) => void;
  placeholder?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const skipNextSearch = useRef(false);

  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }
    const query = value.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const results = await searchPlaces(query, 5, controller.signal);
        setSuggestions(results);
        setOpen(results.length > 0);
        setHighlighted(-1);
      } catch {
        // Aborted or network error — keep whatever we had.
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  function select(suggestion: GeocodeResult) {
    skipNextSearch.current = true;
    onSelect(suggestion);
    setOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      select(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
        placeholder={placeholder}
        className="field-input"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
      />
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-10 mt-1 max-h-56 overflow-y-auto rounded-xl border border-zinc-700 bg-[#18181d] py-1 shadow-xl shadow-black/50"
        >
          {suggestions.map((s, i) => (
            <li key={`${s.lat},${s.lon}`} role="option" aria-selected={i === highlighted}>
              <button
                type="button"
                // mousedown fires before the input's blur closes the list
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(s);
                }}
                onMouseEnter={() => setHighlighted(i)}
                className={`block w-full px-3 py-2 text-left text-sm ${
                  i === highlighted
                    ? "bg-white/10 text-white"
                    : "text-zinc-300"
                }`}
              >
                {s.displayName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
