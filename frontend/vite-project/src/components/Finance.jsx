import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, fetchSummary, addExpense, deleteExpense } from '../store/slices/finance.slice.js';
import Loader from './ui/Loader.jsx';
import Empty from './ui/Empty.jsx';
import '../styles/dashboard.css';

const Finance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, summary, status } = useSelector(s => s.finance);

  const [form, setForm] = useState({ amount: '', category: '', note: '', date: '' });
  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchSummary());
  }, [dispatch]);

  const totalThisMonth = useMemo(() => summary?.total ?? items.reduce((s, e) => s + (Number(e.amount) || 0), 0), [summary, items]);
  const onAdd = (e) => {
    e.preventDefault();
    const payload = {
      amount: Number(form.amount),
      category: form.category?.trim(),
      note: form.note?.trim(),
      date: form.date ? new Date(form.date) : undefined,
    };
    if (!payload.amount || !payload.category) return;
    dispatch(addExpense(payload)).then(() => {
      setForm({ amount: '', category: '', note: '', date: '' });
      dispatch(fetchSummary());
    });
  };

  return (
    <div className="nx-container">
      <header className="nx-header">
        <div className="nx-logo">
          <i className="fas fa-wallet"></i>
          <span>Finance</span>
        </div>
        <div className="nx-pills">
          <div className="nx-pill" onClick={()=>navigate('/')}>Dashboard</div>
          <div className="nx-pill" onClick={()=>navigate('/tasks')}>Tasks</div>
          <div className="nx-pill" onClick={()=>navigate('/schedule')}>Schedule</div>
          <div className="nx-pill active">Finance</div>
        </div>
      </header>

      <main className="nx-main" style={{ width: '100%' }}>
        <section className="nx-welcome">
          <h1>Track expenses and budgets</h1>
          <p>Monitor spending by category, add transactions, and let the assistant optimize your budget.</p>
          <form onSubmit={onAdd} className="nx-actions" style={{ gap: 12 }}>
            <div className="nx-action" style={{ flexDirection:'row', gap:8, padding:'8px 10px' }}>
              <i className="fas fa-plus"></i><span>Add Expense</span>
            </div>
            <input placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={e=>setForm(f=>({ ...f, amount: e.target.value }))} className="nx-input" style={{ minWidth: 120 }} />
            <input placeholder="Category" value={form.category} onChange={e=>setForm(f=>({ ...f, category: e.target.value }))} className="nx-input" style={{ minWidth: 140 }} />
            <input placeholder="Note" value={form.note} onChange={e=>setForm(f=>({ ...f, note: e.target.value }))} className="nx-input" style={{ flex:1 }} />
            <input placeholder="Date" type="date" value={form.date} onChange={e=>setForm(f=>({ ...f, date: e.target.value }))} className="nx-input" />
            <button className="nx-btn" type="submit">Save</button>
          </form>
        </section>

        <section className="nx-grid nx-row-3">
          <div className="nx-card">
            <div className="nx-card-header"><div className="nx-card-title">This Month</div></div>
            <div className="nx-stats">
              <div className="nx-stat">
                <span>Spending</span>
                <div className="nx-bar"><div className="nx-fill" style={{width: `${Math.min(100, (totalThisMonth/ (summary?.budget || 2000)) * 100).toFixed(0)}%`}}></div></div>
                <span>${totalThisMonth?.toFixed ? totalThisMonth.toFixed(2) : totalThisMonth}</span>
              </div>
              <div className="nx-stat"><span>Top Category</span>
                <div className="nx-bar"><div className="nx-fill nx-steps" style={{width:`${Math.min(100, (summary?.byCategory?.[0]?.total || 0) / (summary?.total || 1) * 100).toFixed(0)}%`}}></div></div>
                <span>{summary?.byCategory?.[0]?.category || '—'}</span>
              </div>
              <div className="nx-stat"><span>Categories</span>
                <div className="nx-bar"><div className="nx-fill nx-hydr" style={{width:`${Math.min(100, (summary?.byCategory?.length || 0) * 10)}%`}}></div></div>
                <span>{summary?.byCategory?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="nx-card nx-card--lightblue">
            <div className="nx-card-header"><div className="nx-card-title">Recent Transactions</div></div>
            {status==='loading' && <Loader label="Loading expenses..." />}
            {status!=='loading' && items.length===0 && <Empty title="No expenses yet" subtitle="Add your first transaction" />}
            <ul className="nx-list">
              {items.slice(0, 8).map(e => (
                <li key={e.id} style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                  <span>{e.category} · ${Number(e.amount).toFixed(2)} {e.note ? `· ${e.note}` : ''}</span>
                  <button onClick={()=>dispatch(deleteExpense(e.id)).then(()=>dispatch(fetchSummary()))} className="nx-mini-btn" title="Delete" style={{ color:'#ff6b6b' }}>
                    <i className="fas fa-trash" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="nx-card nx-card--lightblue">
            <div className="nx-card-header"><div className="nx-card-title">Budgets</div></div>
            <ul className="nx-list">
              {(summary?.byCategory || []).map((c) => (
                <li key={c.category} style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                  <span>{c.category}</span>
                  <span>${Number(c.total).toFixed(2)}</span>
                </li>
              ))}
              {(!summary || (summary?.byCategory || []).length===0) && (
                <li><span style={{ color:'#a9add6' }}>No summary yet</span></li>
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Finance;
