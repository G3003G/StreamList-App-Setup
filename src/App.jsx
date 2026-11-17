import React, { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import {
  Check,
  Circle,
  CircleCheck,
  Clapperboard,
  CircleHelp,
  Film,
  House,
  ListChecks,
  ListPlus,
  Pencil,
  Save,
  ShoppingCart,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

const navigation = [
  { label: 'StreamList', to: '/', icon: House, end: true },
  { label: 'Movies', to: '/movies', icon: Film },
  { label: 'Cart', to: '/cart', icon: ShoppingCart },
  { label: 'About', to: '/about', icon: CircleHelp },
];

function Header() {
  return (
    <header className="topbar">
      <NavLink className="brand" to="/" aria-label="StreamList home">
        <span className="brand-mark"><Clapperboard size={21} strokeWidth={2.3} /></span>
        <span>Stream<span className="brand-accent">List</span></span>
      </NavLink>
      <nav className="navigation" aria-label="Main navigation">
        {navigation.map(({ label, to, icon: Icon, end }) => (
          <NavLink key={label} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icon size={17} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="profile-chip"><span className="profile-dot">H</span><span>My space</span></div>
    </header>
  );
}

function StreamListPage() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [activity, setActivity] = useState([]);

  const completedCount = items.filter((item) => item.completed).length;
  const visibleItems = items.filter((item) => {
    if (filter === 'active') return !item.completed;
    if (filter === 'completed') return item.completed;
    return true;
  });

  function recordActivity(text) {
    const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    setActivity((current) => [{ id: crypto.randomUUID(), text, time }, ...current].slice(0, 5));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setMessage('Type a movie or show title first.');
      return;
    }

    const newItem = { id: crypto.randomUUID(), title: trimmedTitle, completed: false };
    setItems((current) => [...current, newItem]);
    console.log('StreamList input:', trimmedTitle);
    setTitle('');
    setMessage(`Added “${trimmedTitle}” to your list.`);
    recordActivity(`Added “${trimmedTitle}”`);
  }

  function toggleComplete(item) {
    const completed = !item.completed;
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, completed } : entry));
    const action = completed ? 'Marked watched' : 'Moved back to To watch';
    setMessage(`${action}: “${item.title}.”`);
    recordActivity(`${action}: “${item.title}”`);
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditDraft(item.title);
    setMessage(`Editing “${item.title}.”`);
  }

  function saveEdit(event, item) {
    event.preventDefault();
    const trimmedTitle = editDraft.trim();
    if (!trimmedTitle) {
      setMessage('A title cannot be blank. Enter a title or cancel the edit.');
      return;
    }
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, title: trimmedTitle } : entry));
    setEditingId(null);
    setEditDraft('');
    setMessage(`Updated title to “${trimmedTitle}.”`);
    recordActivity(`Renamed “${item.title}” to “${trimmedTitle}”`);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft('');
    setMessage('Edit canceled.');
  }

  function deleteItem(item) {
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    if (editingId === item.id) cancelEdit();
    setMessage(`Removed “${item.title}” from your list.`);
    recordActivity(`Removed “${item.title}”`);
  }

  function clearCompleted() {
    const removedCount = completedCount;
    setItems((current) => current.filter((item) => !item.completed));
    setMessage(`Cleared ${removedCount} watched ${removedCount === 1 ? 'title' : 'titles'}.`);
    recordActivity(`Cleared ${removedCount} watched ${removedCount === 1 ? 'title' : 'titles'}`);
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> YOUR NEXT WATCH, ORGANIZED</div>
          <h1>Keep your next<br /><span>great watch</span> close.</h1>
          <p>Build a personal list of movies and shows you’re excited to stream. Add a title and keep your watch ideas in one place.</p>
          <div className="hero-note"><span className="note-dot" /> A little list goes a long way.</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="poster poster-back"><span>TONIGHT</span><b>THE<br />UNKNOWN</b><i>01</i></div>
          <div className="poster poster-front"><div className="poster-sun" /><span>EZTECH ORIGINAL</span><b>AFTER<br />THE<br />LIGHTS</b><i>STREAMLIST PICK</i></div>
          <div className="floating-tag"><span className="tag-star">✦</span><span>Saved for later</span></div>
        </div>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div><span className="section-kicker">YOUR PERSONAL WATCHLIST</span><h2>Start your StreamList</h2></div>
          <span className="count-pill">{items.length - completedCount} to watch · {completedCount} watched</span>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="watch-title">Movie or show title</label>
          <ListPlus className="input-icon" size={19} />
          <input
            id="watch-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a movie or show you want to watch..."
            maxLength={80}
          />
          <button type="submit"><ListPlus size={16} /> Add to list</button>
        </form>
        {message && <p className="status-message" role="status" aria-live="polite">{message}</p>}

        <div className="list-toolbar">
          <div className="filter-tabs" role="group" aria-label="Filter watchlist">
            {[['all', 'All'], ['active', 'To watch'], ['completed', 'Watched']].map(([key, label]) => (
              <button key={key} type="button" className={`filter-tab${filter === key ? ' selected' : ''}`} onClick={() => setFilter(key)} aria-pressed={filter === key}>
                {label}
              </button>
            ))}
          </div>
          {completedCount > 0 && <button type="button" className="text-button" onClick={clearCompleted}>Clear watched</button>}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Clapperboard size={25} /></div>
            <h3>Your watchlist starts here</h3>
            <p>Add your first title above. It will appear here so you can edit, remove, or mark it watched.</p>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="empty-filter-state"><ListChecks size={20} /><span>No {filter === 'active' ? 'unwatched' : 'watched'} titles in this view.</span></div>
        ) : (
          <ul className="watch-list" aria-label="Your watchlist">
            {visibleItems.map((item) => {
              const index = items.findIndex((entry) => entry.id === item.id);
              const isEditing = editingId === item.id;
              return (
                <li className={`watch-item${item.completed ? ' is-complete' : ''}`} key={item.id}>
                  <span className="item-number">{String(index + 1).padStart(2, '0')}</span>
                  <button className="complete-button" type="button" onClick={() => toggleComplete(item)} aria-label={item.completed ? `Mark ${item.title} unwatched` : `Mark ${item.title} watched`} title={item.completed ? 'Mark as to watch' : 'Mark as watched'}>
                    {item.completed ? <CircleCheck size={21} /> : <Circle size={21} />}
                  </button>
                  {isEditing ? (
                    <form className="edit-form" onSubmit={(event) => saveEdit(event, item)}>
                      <label className="sr-only" htmlFor={`edit-${item.id}`}>Edit title</label>
                      <input id={`edit-${item.id}`} value={editDraft} onChange={(event) => setEditDraft(event.target.value)} autoFocus maxLength={80} />
                      <button className="icon-button save-button" type="submit" aria-label="Save title" title="Save"><Save size={17} /></button>
                      <button className="icon-button" type="button" onClick={cancelEdit} aria-label="Cancel edit" title="Cancel"><X size={17} /></button>
                    </form>
                  ) : (
                    <>
                      <span className="item-title">{item.title}</span>
                      <span className="saved-label">{item.completed ? 'WATCHED' : 'TO WATCH'}</span>
                      <div className="item-actions">
                        <button className="icon-button" type="button" onClick={() => startEditing(item)} aria-label={`Edit ${item.title}`} title="Edit"><Pencil size={16} /></button>
                        <button className="icon-button delete-button" type="button" onClick={() => deleteItem(item)} aria-label={`Delete ${item.title}`} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {activity.length > 0 && (
          <section className="activity-panel" aria-label="Recent StreamList activity">
            <div className="activity-heading"><h3>Recent activity</h3><span>{activity.length} {activity.length === 1 ? 'event' : 'events'}</span></div>
            <ul className="activity-list">
              {activity.map((event) => <li key={event.id}><Check size={14} /><span>{event.text}</span><time>{event.time}</time></li>)}
            </ul>
          </section>
        )}
      </section>
      <footer className="page-footer"><span>EZTechMovie</span><span>Make room for what you want to watch.</span></footer>
    </main>
  );
}

function EmptyPage({ title, subtitle, icon: Icon }) {
  return (
    <main className="placeholder-page">
      <div className="placeholder-card">
        <div className="placeholder-icon"><Icon size={26} /></div>
        <span className="section-kicker">COMING IN A FUTURE PROJECT WEEK</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="placeholder-rule" />
        <span className="placeholder-foot">This page is intentionally empty for now.</span>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<StreamListPage />} />
        <Route path="/movies" element={<EmptyPage title="Movies" subtitle="Movie browsing will be added in a future project week." icon={Film} />} />
        <Route path="/cart" element={<EmptyPage title="Cart" subtitle="Cart functionality will be added in a future project week." icon={ShoppingCart} />} />
        <Route path="/about" element={<EmptyPage title="About StreamList" subtitle="The About page will be added in a future project week." icon={CircleHelp} />} />
        <Route path="*" element={<EmptyPage title="Page not found" subtitle="Choose a page from the navigation above." icon={House} />} />
      </Routes>
    </div>
  );
}
