import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMedicine, getDrugInfoFromFDA } from '../services/medicineService';
import MedicineAutocomplete from '../components/MedicineAutocomplete';
import { Pill, ArrowLeft, Save, AlertCircle, Sparkles, Info, ShieldCheck } from 'lucide-react';

const AddMedicinePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once a day',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    reminderTime: '09:00',
    instructions: '',
    status: 'ACTIVE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofillNotice, setAutofillNotice] = useState('');
  const [clinicalInfo, setClinicalInfo] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSelectSuggestion = async (item) => {
    setFormData((prev) => ({
      ...prev,
      name: item.name,
      dosage: item.defaultDosage && item.defaultDosage !== 'Consult Doctor' ? item.defaultDosage : prev.dosage,
      frequency: item.defaultFrequency || prev.frequency,
      instructions: item.defaultInstructions || prev.instructions,
    }));

    setAutofillNotice(`Auto-filled ideal dosage (${item.defaultDosage}) and instructions for ${item.name}!`);
    setTimeout(() => setAutofillNotice(''), 4000);

    // Fetch rich clinical drug details
    try {
      const info = await getDrugInfoFromFDA(item.name);
      if (info && info.found) {
        setClinicalInfo(info);
      }
    } catch (e) {
      setClinicalInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        endDate: formData.endDate ? formData.endDate : null,
      };
      await createMedicine(payload);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save medicine. Please check input fields.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Add New Medicine & Set Alarm
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Search for medicine names below to auto-fill ideal dosage, frequency, and safety instructions
        </p>
      </div>

      <div className="card" style={{ padding: '2.25rem' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {autofillNotice && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#e6fffa', border: '1px solid #99f6e4', color: '#0f766e', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
            <Sparkles size={18} color="#0d9488" />
            <span>{autofillNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Medicine Name *</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>(Type for Google-style suggestions)</span>
              </label>
              <MedicineAutocomplete
                value={formData.name}
                onChange={(val) => setFormData({ ...formData, name: val })}
                onSelectSuggestion={handleSelectSuggestion}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dosage *</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g., 500mg, 1 tablet, 10ml"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Frequency *</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="Once a day">Once a day</option>
                <option value="Twice a day">Twice a day</option>
                <option value="Three times a day">Three times a day</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="Every 12 hours">Every 12 hours</option>
                <option value="As needed">As needed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reminder Alarm Time *</label>
              <input
                type="time"
                name="reminderTime"
                value={formData.reminderTime}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date (Optional)</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Instructions / Notes (Optional)</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="e.g., Take after food with warm water"
            ></textarea>
          </div>

          {/* Clinical Drug Reference Card */}
          {clinicalInfo && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '0.75rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#065f46', fontWeight: '700' }}>
                <ShieldCheck size={20} />
                <span>Clinical Tablet Reference: {clinicalInfo.brandName}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div><strong>Generic:</strong> {clinicalInfo.genericName}</div>
                <div><strong>Ideal Dosage:</strong> {clinicalInfo.idealDosage}</div>
                <div><strong>Category:</strong> {clinicalInfo.category}</div>
                <div><strong>Purpose:</strong> {clinicalInfo.purpose}</div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Medicine & Set Alarm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicinePage;
