import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMedicineById, markMedicineAsTaken, deleteMedicine, getDrugInfoFromFDA } from '../services/medicineService';
import ConfirmModal from '../components/ConfirmModal';
import { Pill, Clock, Calendar, CheckCircle2, ArrowLeft, Edit3, Trash2, Info, Check, Search, ShieldAlert, Sparkles, Activity, AlertTriangle } from 'lucide-react';

const MedicineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fdaInfo, setFdaInfo] = useState(null);
  const [fdaLoading, setFdaLoading] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const data = await getMedicineById(id);
        setMedicine(data);
        // Automatically fetch clinical & FDA drug description for this medicine
        try {
          const info = await getDrugInfoFromFDA(data.name);
          setFdaInfo(info);
        } catch (e) {
          setFdaInfo(null);
        }
      } catch (err) {
        setError('Medicine record not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleMarkTaken = async () => {
    try {
      const updated = await markMedicineAsTaken(id);
      setMedicine(updated);
    } catch (err) {
      alert('Failed to mark as taken.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMedicine(id);
      navigate('/');
    } catch (err) {
      alert('Failed to delete medicine.');
    }
  };

  const handleManualFetchFda = async () => {
    setFdaLoading(true);
    try {
      const data = await getDrugInfoFromFDA(medicine.name);
      setFdaInfo(data);
    } catch (e) {
      setFdaInfo({ found: false });
    } finally {
      setFdaLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading medicine details & clinical profile...</p>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', textAlign: 'center', padding: '3rem 0' }}>
        <div className="card">
          <Info size={40} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Record Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {medicine.name}
              </h1>
              <span className={`badge badge-${medicine.status.toLowerCase()}`}>
                {medicine.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Prescription schedule, clinical description & ideal dosage profile
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/medicines/edit/${medicine.id}`} className="btn btn-secondary">
              <Edit3 size={16} />
              <span>Edit Record</span>
            </Link>
            <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger">
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Scheduled Prescription Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Your Prescribed Dosage</span>
            <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '0.25rem', fontWeight: '700' }}>{medicine.dosage}</h4>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Frequency</span>
            <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '0.25rem', fontWeight: '700' }}>{medicine.frequency}</h4>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>Daily Alarm Time</span>
            <h4 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}>
              <Clock size={20} />
              <span>{medicine.reminderTime}</span>
            </h4>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Calendar size={20} color="var(--accent)" style={{ marginTop: '0.25rem' }} />
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Start Date</span>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{medicine.startDate}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Calendar size={20} color="var(--accent)" style={{ marginTop: '0.25rem' }} />
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>End Date</span>
              <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{medicine.endDate || 'Ongoing / Indefinite'}</p>
            </div>
          </div>
        </div>

        {medicine.instructions && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '0.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#065f46', marginBottom: '0.35rem' }}>
              Your Usage Notes & Timing Instructions
            </h4>
            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {medicine.instructions}
            </p>
          </div>
        )}

        {/* Clinical Drug Description & Ideal Dosage Card */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Clinical Tablet Description & Ideal Dosage
              </h3>
            </div>
            <button onClick={handleManualFetchFda} className="btn btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }} disabled={fdaLoading}>
              {fdaLoading ? (
                <div className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
              ) : (
                <>
                  <Search size={14} />
                  <span>Refresh Clinical Info</span>
                </>
              )}
            </button>
          </div>

          {fdaInfo ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Brand Name</span>
                  <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.05rem' }}>{fdaInfo.brandName}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Generic Name</span>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{fdaInfo.genericName}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Ideal Dosage</span>
                  <p style={{ fontWeight: '700', color: '#0d9488' }}>{fdaInfo.idealDosage || 'Consult Doctor'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Clinical Category</span>
                  <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{fdaInfo.category || 'Medication'}</p>
                </div>
              </div>

              {fdaInfo.purpose && fdaInfo.purpose !== 'N/A' && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Primary Indications & Purpose</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{fdaInfo.purpose}</p>
                </div>
              )}

              {fdaInfo.sideEffects && fdaInfo.sideEffects !== 'N/A' && (
                <div style={{ background: '#fffbeb', border: '1px solid #fef08a', padding: '0.875rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b45309', fontWeight: '700', fontSize: '0.85rem' }}>
                    <Activity size={16} />
                    <span>Possible Side Effects</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: '1.5' }}>{fdaInfo.sideEffects}</p>
                </div>
              )}

              {fdaInfo.warnings && fdaInfo.warnings !== 'N/A' && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.875rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#b91c1c', fontWeight: '700', fontSize: '0.85rem' }}>
                    <AlertTriangle size={16} />
                    <span>Official FDA Safety Warnings</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.25rem', lineHeight: '1.5' }}>{fdaInfo.warnings}</p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              Fetching official FDA and clinical tablet guidelines for "{medicine.name}"...
            </p>
          )}
        </div>

        {medicine.lastTakenAt && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Last marked as taken: {new Date(medicine.lastTakenAt).toLocaleString()}
          </div>
        )}

        <div style={{ marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          {medicine.status !== 'TAKEN' ? (
            <button onClick={handleMarkTaken} className="btn btn-success" style={{ padding: '0.75rem 1.5rem' }}>
              <CheckCircle2 size={18} />
              <span>Mark as Taken Today</span>
            </button>
          ) : (
            <div className="btn btn-secondary" style={{ color: '#0284c7', cursor: 'default' }}>
              <Check size={18} />
              <span>Dose Completed for Today</span>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Prescription"
        message={`Are you sure you want to permanently delete "${medicine.name}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default MedicineDetailPage;
