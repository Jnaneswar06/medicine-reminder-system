import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getMedicineById, updateMedicine } from '../services/medicineService';
import MedicineAutocomplete from '../components/MedicineAutocomplete';
import { ArrowLeft, Save, AlertCircle, Sparkles } from 'lucide-react';

const EditMedicinePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Once a day',
    startDate: '',
    endDate: '',
    reminderTime: '09:00',
    instructions: '',
    status: 'ACTIVE',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [autofillNotice, setAutofillNotice] = useState('');

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const data = await getMedicineById(id);
        setFormData({
          name: data.name || '',
          dosage: data.dosage || '',
          frequency: data.frequency || 'Once a day',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          reminderTime: data.reminderTime ? data.reminderTime.substring(0, 5) : '09:00',
          instructions: data.instructions || '',
          status: data.status || 'ACTIVE',
        });
      } catch (err) {
        setError('Medicine record not found or unauthorized access.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSelectSuggestion = (item) => {
    setFormData((prev) => ({
      ...prev,
      name: item.name,
      dosage: item.defaultDosage && item.defaultDosage !== 'Consult Doctor' ? item.defaultDosage : prev.dosage,
      frequency: item.defaultFrequency || prev.frequency,
      instructions: item.defaultInstructions || prev.instructions,
    }));
    setAutofillNotice(`Updated dosage (${item.defaultDosage}) and instructions for ${item.name}!`);
    setTimeout(() => setAutofillNotice(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        endDate: formData.endDate ? formData.endDate : null,
      };
      await updateMedicine(id, payload);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update medicine details.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading medicine details...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'inline-flex', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Edit Medicine Schedule
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Update prescription schedule, reminder alarm, and dosage instructions
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
              <label className="form-label">Medicine Name *</label>
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
              <label className="form-label">Current Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="TAKEN">TAKEN</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
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
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicinePage;
