import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedicines, markMedicineAsTaken, deleteMedicine, searchDrugSuggestions } from '../services/medicineService';
import StatsCard from '../components/StatsCard';
import MedicineCard from '../components/MedicineCard';
import ConfirmModal from '../components/ConfirmModal';
import { Pill, Activity, CheckCircle2, Bell, Search, Filter, PlusCircle, RefreshCw, Sparkles } from 'lucide-react';

const DashboardPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchMedicines = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getMedicines(search, statusFilter);
      setMedicines(data);
    } catch (err) {
      setError('Failed to load medicines. Please refresh or check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [search, statusFilter]);

  useEffect(() => {
    if (search.trim().length > 0) {
      searchDrugSuggestions(search.trim())
        .then((list) => setSearchSuggestions(list))
        .catch(() => setSearchSuggestions([]));
    } else {
      setSearchSuggestions([]);
    }
  }, [search]);

  const handleMarkTaken = async (id) => {
    try {
      const updated = await markMedicineAsTaken(id);
      setMedicines(medicines.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      alert('Failed to mark medicine as taken.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMedicine(deleteTarget.id);
      setMedicines(medicines.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete medicine.');
    }
  };

  const totalCount = medicines.length;
  const activeCount = medicines.filter((m) => m.status === 'ACTIVE').length;
  const takenCount = medicines.filter((m) => m.status === 'TAKEN').length;
  const upcomingCount = medicines.filter((m) => m.status === 'ACTIVE' && m.reminderTime).length;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Medicine Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            Manage daily prescriptions, live reminder alarms & clinical drug descriptions
          </p>
        </div>
        <Link to="/medicines/add" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
          <PlusCircle size={18} />
          <span>Add New Medicine</span>
        </Link>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total Prescriptions" value={totalCount} icon={Pill} color="2, 132, 199" subtitle="All recorded medicines" />
        <StatsCard title="Active Medicines" value={activeCount} icon={Activity} color="13, 148, 136" subtitle="Currently scheduled" />
        <StatsCard title="Taken Today" value={takenCount} icon={CheckCircle2} color="16, 185, 129" subtitle="Completed doses" />
        <StatsCard title="Upcoming Reminders" value={upcomingCount} icon={Bell} color="217, 119, 6" subtitle="Scheduled alarms" />
      </div>

      {/* Filter and Interactive Search Bar with Google-style suggestions */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search medicine by name (e.g. Paracetamol, Dolo, Amoxicillin)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} color="var(--primary)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />

            {/* Live Google-style Autocomplete Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="autocomplete-dropdown" style={{ top: '100%', left: 0, right: 0 }}>
                <div style={{ padding: '0.4rem 0.875rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={14} />
                  <span>MATCHING MEDICINES</span>
                </div>
                {searchSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearch(item.name);
                      setShowSuggestions(false);
                    }}
                    className="autocomplete-item"
                  >
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</div>
                    {item.defaultDosage && <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>{item.defaultDosage}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="TAKEN">TAKEN</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>

            <button onClick={fetchMedicines} className="btn btn-secondary" title="Refresh List">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your medicine schedule...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '1px solid #fecaca', background: '#fef2f2' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem', fontWeight: '600' }}>{error}</p>
          <button onClick={fetchMedicines} className="btn btn-primary">
            Retry
          </button>
        </div>
      ) : medicines.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ background: '#e6fffa', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <Pill size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Medicines Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
            {search || statusFilter
              ? 'No medicines match your current search or filter criteria.'
              : 'You have not added any medicines yet. Click below to add your first reminder!'}
          </p>
          <Link to="/medicines/add" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Medicine</span>
          </Link>
        </div>
      ) : (
        <div className="medicines-grid">
          {medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onMarkTaken={handleMarkTaken}
              onDeleteClick={(med) => setDeleteTarget(med)}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Medicine"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your reminder list? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default DashboardPage;
