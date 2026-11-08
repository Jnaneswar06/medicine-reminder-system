import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, Clock, Calendar, CheckCircle2, Eye, Edit3, Trash2 } from 'lucide-react';

const MedicineCard = ({ medicine, onMarkTaken, onDeleteClick }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'badge-active';
      case 'TAKEN': return 'badge-taken';
      case 'INACTIVE': return 'badge-inactive';
      case 'COMPLETED': return 'badge-completed';
      default: return 'badge-active';
    }
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--primary)',
            padding: '0.625rem',
            borderRadius: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Pill size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {medicine.name}
            </h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {medicine.dosage} • {medicine.frequency}
            </span>
          </div>
        </div>
        <span className={`badge ${getBadgeClass(medicine.status)}`}>
          {medicine.status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Clock size={15} color="var(--primary)" />
          <span>Reminder: <strong style={{ color: 'var(--text-primary)' }}>{medicine.reminderTime}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <Calendar size={15} color="var(--accent)" />
          <span>Duration: {medicine.startDate} {medicine.endDate ? `to ${medicine.endDate}` : '(Ongoing)'}</span>
        </div>
        {medicine.instructions && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.25rem' }}>
            "{medicine.instructions}"
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
        {medicine.status !== 'TAKEN' ? (
          <button
            onClick={() => onMarkTaken(medicine.id)}
            className="btn btn-success"
            style={{ flex: 1, padding: '0.5rem' }}
            title="Mark as Taken for Today"
          >
            <CheckCircle2 size={16} />
            <span>Mark Taken</span>
          </button>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#60a5fa', fontWeight: '600' }}>
            <CheckCircle2 size={16} />
            <span>Taken Today</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <Link to={`/medicines/${medicine.id}`} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="View Details">
            <Eye size={16} />
          </Link>
          <Link to={`/medicines/edit/${medicine.id}`} className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Edit Medicine">
            <Edit3 size={16} />
          </Link>
          <button onClick={() => onDeleteClick(medicine)} className="btn btn-danger" style={{ padding: '0.5rem' }} title="Delete Medicine">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
