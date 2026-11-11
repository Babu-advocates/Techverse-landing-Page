'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { countryCodes, type CountryCodeItem } from '@/content';

type PhoneInputProps = {
  id?: string;
  name?: string;
  required?: boolean;
  value?: string;
  onChange?: (fullPhone: string) => void;
  className?: string;
};

export default function PhoneInput({
  id = 'phone',
  name = 'phone',
  required = false,
  value = '',
  onChange,
  className = '',
}: PhoneInputProps) {
  // Default to India (+91)
  const defaultCountry = countryCodes.find((c) => c.code === 'IN') || countryCodes[0];
  const [country, setCountry] = useState<CountryCodeItem>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click or Escape
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
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function toggleOpen() {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
    setOpen((prev) => !prev);
  }

  // Filter countries by search query
  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countryCodes;
    return countryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  // Enforce digits only and country character limit
  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Keep only numbers
    const digitsOnly = raw.replace(/\D/g, '');
    const trimmed = digitsOnly.slice(0, country.maxLength);
    setPhoneNumber(trimmed);

    const full = trimmed ? `${country.dialCode} ${trimmed}` : '';
    onChange?.(full);
  }

  function handleSelectCountry(selected: CountryCodeItem) {
    setCountry(selected);
    setOpen(false);
    setSearch('');
    // Trim phone number if it exceeds the new country's maxLength
    const trimmed = phoneNumber.slice(0, selected.maxLength);
    setPhoneNumber(trimmed);
    const full = trimmed ? `${selected.dialCode} ${trimmed}` : '';
    onChange?.(full);
  }

  const fullPhone = phoneNumber ? `${country.dialCode} ${phoneNumber}` : '';

  return (
    <div ref={containerRef} className={`custom-phone-wrapper ${className}`}>
      {/* Hidden inputs for form data submission */}
      <input type="hidden" name={name} value={fullPhone} required={required} />
      <input type="hidden" name="countryCode" value={country.dialCode} />
      <input type="hidden" name="countryIso" value={country.code} />

      <div className={`custom-phone-input-row ${open ? 'custom-phone--focus' : ''}`}>
        {/* Country code selector button */}
        <button
          type="button"
          className="custom-phone-country-btn"
          onClick={toggleOpen}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="custom-phone-flag" aria-hidden="true">
            {country.flag}
          </span>
          <span className="custom-phone-dialcode">{country.dialCode}</span>
          <ChevronDown
            size={14}
            className={`custom-phone-chevron ${open ? 'custom-phone-chevron--rotated' : ''}`}
          />
        </button>

        {/* Separator */}
        <span className="custom-phone-sep" aria-hidden="true" />

        {/* Phone number input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phoneNumber}
          onChange={handleNumberChange}
          placeholder={`${country.maxLength} digits`}
          maxLength={country.maxLength}
          required={required}
          className="custom-phone-number-field"
        />

        {/* Character count guide */}
        <span className="custom-phone-counter">
          {phoneNumber.length}/{country.maxLength}
        </span>
      </div>

      {/* Custom Country Dropdown Popover */}
      {open && (
        <div
          className={`custom-country-dropdown ${openUpwards ? 'custom-country-dropdown--up' : ''}`}
          role="listbox"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="custom-country-search-wrap">
            <Search size={14} className="custom-country-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="custom-country-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code…"
            />
          </div>

          <div
            className="custom-country-list"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
          >
            {filteredCountries.length === 0 ? (
              <div className="custom-country-empty">No country found</div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === country.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`custom-country-item ${isSelected ? 'custom-country-item--selected' : ''}`}
                    onClick={() => handleSelectCountry(c)}
                  >
                    <div className="custom-country-item__left">
                      <span className="custom-country-item__flag">{c.flag}</span>
                      <span className="custom-country-item__name">{c.name}</span>
                    </div>
                    <div className="custom-country-item__right">
                      <span className="custom-country-item__limit">{c.maxLength}d</span>
                      <span className="custom-country-item__code">{c.dialCode}</span>
                      {isSelected && <Check size={14} className="custom-country-item__check" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
