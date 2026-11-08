import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = '16, 185, 129', subtitle }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{
        background: `rgba(${color}, 0.15)`,
        color: `rgb(${color})`,
        padding: '1rem',
        borderRadius: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={28} />
      </div>
      <div>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0.1rem 0' }}>
          {value}
        </h3>
        {subtitle && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
