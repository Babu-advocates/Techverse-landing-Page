'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export type SelectGroup = {
  group: string;
  items: readonly string[];
};

type CustomSelectProps = {
  id?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | readonly SelectGroup[];
  placeholder: string;
  required?: boolean;
  className?: string;
};

function isGroupArray(opts: readonly string[] | readonly SelectGroup[]): opts is readonly SelectGroup[] {
  return opts.length > 0 && typeof opts[0] === 'object' && 'group' in opts[0];
}

export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = '',
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const isGrouped = isGroupArray(options);

  function toggleOpen() {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 280px below and more space above, flip upwards
      if (spaceBelow < 280 && spaceAbove > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
    setOpen((prev) => !prev);
  }

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${open ? 'custom-select--open' : ''} ${className}`}
    >
      <input type="hidden" id={id} name={name} value={value} required={required} />

      <button
        type="button"
        className={`custom-select-trigger ${value ? 'custom-select-trigger--filled' : ''}`}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-trigger__label">{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={`custom-select-trigger__icon ${open ? 'custom-select-trigger__icon--rotated' : ''}`}
        />
      </button>

      {open && (
        <div
          className={`custom-select-dropdown ${openUpwards ? 'custom-select-dropdown--up' : ''}`}
          role="listbox"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          {isGrouped ? (
            (options as readonly SelectGroup[]).map((grp) => (
              <div key={grp.group} className="custom-select-group">
                <div className="custom-select-group__title">{grp.group}</div>
                {grp.items.map((item) => {
                  const isSelected = item === value;
                  return (
                    <button
                      key={item}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`custom-select-option ${isSelected ? 'custom-select-option--selected' : ''}`}
                      onClick={() => handleSelect(item)}
                    >
                      <span>{item}</span>
                      {isSelected && <Check size={14} className="custom-select-option__check" />}
                    </button>
                  );
                })}
              </div>
            ))
          ) : (
            (options as readonly string[]).map((item) => {
              const isSelected = item === value;
              return (
                <button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`custom-select-option ${isSelected ? 'custom-select-option--selected' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <span>{item}</span>
                  {isSelected && <Check size={14} className="custom-select-option__check" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
