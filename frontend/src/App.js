// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = 'http://localhost:5000/api';

// ── Icons (inline SVG to avoid extra deps) ──
const Icon = {
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  logout: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  plus:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  clock:  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  tasks:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  fire:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 0-5 5-5 11a7 7 0 0 0 14 0c0-6-5-11-5-11z"/><path d="M12 12c0 0-2 2-2 4a2 2 0 0 0 4 0c0-2-2-4-2-4z"/></svg>,
};

const CATEGORIES = ['General', 'Work', 'Study', 'Personal', 'Health', 'Finance'];
const PRIORITIES  = ['low', 'medium', 'high'];

const priorityColor = (p) => ({
  low:    'var(--green)',
  medium: 'var(--amber)',
  high:   'var(--red)',
}[p] || 'transparent');

// ─────────────────────────────────────────────
// AUTH SCREEN
// ─────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab,      setTab]      = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const signup = async () => {
    if (!email || !password) return toast.error('Fill in all fields');
    setLoading(true);
    try {
      await axios.post(`${API}/auth/signup`, { email, password });
      toast.success('Account created! Please log in.');
      setTab('login');
    } catch {
      toast.error('Signup failed. Email may already exist.');
    } finally { setLoading(false); }
  };

  const login = async () => {
    if (!email || !password) return toast.error('Fill in all fields');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Welcome back!');
      onLogin(res.data.token);
    } catch {
      toast.error('Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">Taskflow</div>
        <p className="auth-sub">Your minimal productivity companion</p>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Sign In</button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? login() : signup())}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? login() : signup())}
          />
        </div>

        <button
          className="btn btn-accent"
          style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '13px' }}
          onClick={tab === 'login' ? login : signup}
          disabled={loading}
        >
          {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}

// ── Fix: parse date without timezone shift ──
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  // Split to avoid UTC→local shift (e.g. "2025-05-03" stays May 3, not May 2)
  const [y, m, d] = dateStr.split('T')[0].split('-');
  return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isDateOverdue = (dateStr) => {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split('T')[0].split('-');
  const due = new Date(+y, +m - 1, +d);
  const today = new Date(); today.setHours(0,0,0,0);
  return due < today;
};

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
function TodoApp({ token, onLogout }) {
  const [todos,    setTodos]    = useState([]);
  const [task,     setTask]     = useState('');
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('General');
  const [dueDate,  setDueDate]  = useState('');
  const [editId,   setEditId]   = useState(null);
  const [search,   setSearch]   = useState('');
  const [filterP,  setFilterP]  = useState('all');
  const [filterC,  setFilterC]  = useState('all');
  const [filterS,  setFilterS]  = useState('all'); // all | active | done
  // ── Fix: dark mode state ──
  const [dark,     setDark]     = useState(() => localStorage.getItem('theme') === 'dark');

  // Apply dark mode class to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const headers = { Authorization: token };

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API}/todos`, { headers });
      setTodos(res.data);
    } catch { toast.error('Failed to load tasks'); }
  };

  useEffect(() => { fetchTodos(); }, []);

  // ── Add / Update ──
  const handleSubmit = async () => {
    if (!task.trim()) return toast.error('Task cannot be empty');
    try {
      if (editId) {
        await axios.put(`${API}/todos/${editId}`, { task, priority, category, dueDate }, { headers });
        toast.success('Task updated');
        setEditId(null);
      } else {
        await axios.post(`${API}/todos`, { task, priority, category, dueDate }, { headers });
        toast.success('Task added');
      }
      setTask(''); setDueDate(''); setCategory('General'); setPriority('low');
      fetchTodos();
    } catch { toast.error('Action failed'); }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/todos/${id}`, { headers });
      toast.success('Task removed');
      fetchTodos();
    } catch { toast.error('Delete failed'); }
  };

  const toggleTodo = async (id) => {
    try {
      await axios.patch(`${API}/todos/${id}`, {}, { headers });
      fetchTodos();
    } catch { toast.error('Toggle failed'); }
  };

  const startEdit = (t) => {
    setTask(t.task);
    setPriority(t.priority || 'low');
    // Fix: ensure category always valid
    setCategory(t.category && t.category.trim() ? t.category : 'General');
    // Fix: safely extract YYYY-MM-DD regardless of ISO format
    if (t.dueDate) {
      const raw = t.dueDate.includes('T') ? t.dueDate.split('T')[0] : t.dueDate.substring(0, 10);
      setDueDate(raw);
    } else {
      setDueDate('');
    }
    setEditId(t._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setTask(''); setDueDate(''); setCategory('General'); setPriority('low');
  };

  // ── Filter ──
  const filtered = todos.filter(t => {
    const matchSearch = t.task.toLowerCase().includes(search.toLowerCase());
    const matchP  = filterP === 'all' || t.priority === filterP;
    const matchC  = filterC === 'all' || t.category === filterC;
    const matchS  = filterS === 'all' || (filterS === 'done' ? t.completed : !t.completed);
    return matchSearch && matchP && matchC && matchS;
  });

  // ── Stats ──
  const total     = todos.length;
  const done      = todos.filter(t => t.completed).length;
  const overdue   = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const high      = todos.filter(t => !t.completed && t.priority === 'high').length;
  const progress  = total ? Math.round((done / total) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="app-shell">
      {/* ── Top Bar ── */}
      <header className="topbar">
        <div className="logo">Task<span>flow</span></div>
        <div className="topbar-right">
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{today}</span>
          {/* Fix: dark/light mode toggle */}
          <button className="btn btn-ghost btn-sm" onClick={() => setDark(d => !d)} title="Toggle theme">
            {dark ? '☀ Light' : '🌙 Dark'}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>
            {Icon.logout} Sign out
          </button>
        </div>
      </header>

      <div className="main-wrap">
        {/* ── Page Header ── */}
        <div className="page-header">
          <h1 className="page-title">My Tasks</h1>
          <p className="page-sub">{done} of {total} tasks completed</p>
        </div>

        {/* ── Progress ── */}
        {total > 0 && (
          <div className="progress-wrap">
            <span style={{ fontSize: 13, color: 'var(--text-2)', whiteSpace: 'nowrap' }}>Progress</span>
            <div className="progress-bar-outer">
              <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-pct">{progress}%</span>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total tasks</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-value">{done}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card" style={overdue ? { borderColor: 'rgba(255,95,107,0.3)' } : {}}>
            <div className="stat-value" style={overdue ? { color: 'var(--red)' } : {}}>{overdue}</div>
            <div className="stat-label">Overdue</div>
          </div>
          <div className="stat-card" style={high ? { borderColor: 'rgba(255,95,107,0.2)' } : {}}>
            <div className="stat-value" style={high ? { color: 'var(--red)' } : {}}>{high}</div>
            <div className="stat-label">High priority</div>
          </div>
        </div>

        {/* ── Add / Edit Panel ── */}
        <div className="add-panel">
          <div className="add-panel-title" style={{ color: editId ? 'var(--accent)' : undefined }}>
            {editId ? '✏ Editing task' : '+ New task'}
          </div>

          <input
            className="task-input"
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="What needs to be done?"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          <div className="add-row">
            <div className="field">
              <label>Due date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>

            <div className="field">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-accent" onClick={handleSubmit}>
                {editId ? Icon.edit : Icon.plus}
                {editId ? 'Update' : 'Add'}
              </button>
              {editId && (
                <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
              )}
            </div>
          </div>
        </div>

        {/* ── Search + Filter Bar ── */}
        <div className="filter-bar">
          <div className="search-wrap">
            {Icon.search}
            <input
              className="search-input"
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select className="filter-select" value={filterS} onChange={e => setFilterS(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="done">Done</option>
          </select>

          <select className="filter-select" value={filterP} onChange={e => setFilterP(e.target.value)}>
            <option value="all">Any priority</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>

          <select className="filter-select" value={filterC} onChange={e => setFilterC(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* ── Todo List ── */}
        <div className="section-label">
          {filtered.length} task{filtered.length !== 1 ? 's' : ''}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <div className="empty-title">
              {todos.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </div>
            <p style={{ fontSize: 14 }}>
              {todos.length === 0 ? 'Add your first task above to get started.' : 'Try adjusting the search or filters.'}
            </p>
          </div>
        ) : (
          <ul className="todo-list">
            {filtered.map(t => {
              // Fix: use timezone-safe helpers
              const isOverdue = !t.completed && isDateOverdue(t.dueDate);
              const dueFormatted = formatDate(t.dueDate);
              // Fix: always show a category
              const cat = (t.category && t.category.trim()) ? t.category : 'General';

              return (
                <li
                  key={t._id}
                  className={`todo-item ${t.completed ? 'done' : ''} ${isOverdue ? 'overdue' : ''}`}
                  style={{ '--priority-color': priorityColor(t.priority) }}
                >
                  <input
                    type="checkbox"
                    className="todo-check"
                    checked={t.completed}
                    onChange={() => toggleTodo(t._id)}
                  />

                  <div className="todo-body">
                    <div className="todo-task">{t.task}</div>
                    <div className="todo-meta">
                      <span className="badge badge-cat">{cat}</span>
                      <span className={`badge badge-priority-${t.priority || 'low'}`}>
                        {t.priority || 'low'}
                      </span>
                      {dueFormatted && (
                        <span className="todo-due">
                          {Icon.clock} {isOverdue ? 'Overdue · ' : ''}{dueFormatted}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="todo-actions">
                    <button className="btn-icon edit" onClick={() => startEdit(t)} title="Edit">
                      {Icon.edit}
                    </button>
                    <button className="btn-icon danger" onClick={() => deleteTodo(t._id)} title="Delete">
                      {Icon.trash}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        closeButton={false}
        pauseOnHover
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin  = (t) => setToken(t);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return token
    ? <TodoApp token={token} onLogout={handleLogout} />
    : <AuthScreen onLogin={handleLogin} />;
}