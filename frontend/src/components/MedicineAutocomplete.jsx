import React, { useState, useEffect, useRef } from 'react';
import { searchDrugSuggestions } from '../services/medicineService';
import { Pill, Search, Sparkles } from 'lucide-react';

const MedicineAutocomplete = ({ value, onChange, onSelectSuggestion, placeholder = "Start typing medicine name (e.g., Paracetamol, Dolo, Ibuprofen)..." }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.trim().length === 0) {
        setLoading(true);
        try {
          const list = await searchDrugSuggestions('');
          setSuggestions(list);
        } catch (e) {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const list = await searchDrugSuggestions(value.trim());
        setSuggestions(list);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onSelectSuggestion(item);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="form-control"
          placeholder={placeholder}
          style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
          required
        />
        <Search size={18} color="var(--primary)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
        {loading && (
          <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}></div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="autocomplete-dropdown">
          <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: '1px solid #e2e8f0' }}>
            <Sparkles size={14} />
            <span>SELECT TO AUTO-FILL IDEAL DOSAGE & USAGE</span>
          </div>
          {suggestions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="autocomplete-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Pill size={18} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.category || 'General Medication'}
                  </div>
                </div>
              </div>

              {item.defaultDosage && item.defaultDosage !== 'Consult Doctor' && (
                <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                  Ideal: {item.defaultDosage}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineAutocomplete;
