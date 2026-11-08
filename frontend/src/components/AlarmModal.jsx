import React from 'react';
import { BellRing, CheckCircle2, X } from 'lucide-react';

const AlarmModal = ({ alarmMedicine, onMarkTaken, onDismiss }) => {
  if (!alarmMedicine) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 999 }}>
      <div className="modal-content" style={{ textAlign: 'center', border: '2px solid #10b981', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)', padding: '2.5rem 2rem' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          color: '#10b981',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <BellRing size={36} />
        </div>

        <span className="badge badge-active" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          ⏰ REMINDER ALARM ({alarmMedicine.reminderTime})
        </span>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.5rem 0' }}>
          Time to take {alarmMedicine.name}!
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          Dosage: <strong style={{ color: 'var(--text-primary)' }}>{alarmMedicine.dosage}</strong> • {alarmMedicine.frequency}
        </p>

        {alarmMedicine.instructions && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.875rem', borderRadius: '0.5rem', marginBottom: '1.75rem', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            "{alarmMedicine.instructions}"
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={onDismiss} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
            <X size={18} />
            <span>Snooze / Dismiss</span>
          </button>
          <button onClick={() => onMarkTaken(alarmMedicine.id)} className="btn btn-success" style={{ padding: '0.75rem 1.5rem' }}>
            <CheckCircle2 size={18} />
            <span>Mark as Taken Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;
