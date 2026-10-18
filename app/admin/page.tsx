'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Appointment, AppointmentStatus, supabase } from '../../lib/supabase';
import styles from './page.module.css';

type Filter = 'all' | AppointmentStatus;
const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
const todayIndia = () => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}`;
};
const displayDate = (s: string) => new Date(`${s}T12:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const displayTimestamp = (s: string) => new Date(s).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [items, setItems] = useState<Appointment[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [draftStatus, setDraftStatus] = useState<AppointmentStatus>('pending');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [adminNote, setAdminNote] = useState('');

  const fetchAppointments = useCallback(async () => {
    const { data, error: fetchError } = await supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(1000);
    if (fetchError) setError('Unable to load appointments. ' + fetchError.message);
    else { setItems(data as Appointment[]); setError(''); }
  }, []);

  useEffect(() => {
    let active = true;
    async function check(s: Session | null) {
      if (!active) return;
      setSession(s); setAuthorized(false); setLoading(true);
      if (!s) { setItems([]); setLoading(false); return; }
      const { data, error: checkError } = await supabase.from('admin_users').select('user_id').eq('user_id', s.user.id).maybeSingle();
      if (!active) return;
      if (checkError || !data) { setAuthError('This account is not authorized to access the clinic dashboard.'); setLoading(false); return; }
      setAuthError(''); setAuthorized(true); setLoading(false);
    }
    supabase.auth.getSession().then(({ data }) => check(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, current) => { void check(current); });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!authorized) return;
    void fetchAppointments();
    const channel = supabase.channel('appointments-admin-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => { void fetchAppointments(); })
      .subscribe();
    const refresh = window.setInterval(() => { void fetchAppointments(); }, 60000);
    return () => { clearInterval(refresh); void supabase.removeChannel(channel); };
  }, [authorized, fetchAppointments]);

  const today = todayIndia();
  const metrics = useMemo(() => ({
    total: items.length,
    pending: items.filter(a => a.status === 'pending').length,
    today: items.filter(a => (a.scheduled_date || a.preferred_date) === today && a.status !== 'cancelled').length,
    confirmed: items.filter(a => a.status === 'confirmed').length
  }), [items, today]);
  const visible = useMemo(() => items.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (dateFilter && (a.scheduled_date || a.preferred_date) !== dateFilter) return false;
    const q = search.trim().toLowerCase();
    return !q || [a.patient_name, a.phone, a.service, a.id].some(x => x.toLowerCase().includes(q));
  }), [items, filter, dateFilter, search]);

  function openAppointment(a: Appointment) {
    setSelected(a); setDraftStatus(a.status); setScheduledDate(a.scheduled_date || a.preferred_date);
    setScheduledTime(a.scheduled_time || a.preferred_time); setAdminNote(a.admin_note || ''); setError('');
  }
  async function save() {
    if (!selected) return;
    if (draftStatus === 'confirmed' && (!scheduledDate || !scheduledTime.trim())) { setError('A confirmed appointment requires a date and time.'); return; }
    setBusy(true); setError('');
    const patch = {
      status: draftStatus,
      scheduled_date: scheduledDate || null,
      scheduled_time: scheduledTime.trim() || null,
      admin_note: adminNote.trim()
    };
    const { error: saveError } = await supabase.from('appointments').update(patch).eq('id', selected.id);
    setBusy(false);
    if (saveError) { setError('Could not save appointment. ' + saveError.message); return; }
    setSelected(null); await fetchAppointments();
  }
  function exportCsv() {
    const cols: (keyof Appointment)[] = ['created_at','patient_name','phone','preferred_date','preferred_time','service','status','scheduled_date','scheduled_time','message','admin_note'];
    const csvCell = (v: unknown) => {
      const raw = String(v ?? '');
      // Neutralize spreadsheet formula injection while retaining patient-entered text.
      const safe = /^[\s]*[=+\-@\t\r]/.test(raw) ? "'" + raw : raw;
      return '"' + safe.replace(/"/g, '""') + '"';
    };
    const csv = [cols.join(','), ...visible.map(a => cols.map(c => csvCell(a[c])).join(','))].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }));
    const el = document.createElement('a'); el.href = url; el.download = `happi-appointments-${today}.csv`; el.click(); URL.revokeObjectURL(url);
  }
  async function login(e: FormEvent) {
    e.preventDefault(); setAuthError(''); setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false); if (err) setAuthError('Invalid credentials or login unavailable.');
  }

  if (loading) return <main className={styles.center}>Checking admin access…</main>;
  if (!session) return <main className={styles.loginScreen}><form className={styles.loginCard} onSubmit={login}>
    <div className={styles.brand}>✚ HAPPI CLINIC</div><h1>Admin sign in</h1><p>Secure access to appointment requests</p>
    <label>Email<input required type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} /></label>
    <label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
    {authError && <p className={styles.error} role="alert">{authError}</p>}
    <button disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
  </form></main>;
  if (!authorized) return <main className={styles.center}><h1>Access denied</h1><p>{authError}</p><button onClick={() => supabase.auth.signOut()}>Sign out</button></main>;

  return <main className={styles.page}>
    <aside className={styles.sidebar}><div className={styles.brand}>✚ HAPPI CLINIC</div><div className={styles.sideLink}>▦ &nbsp; Appointment dashboard</div><div className={styles.sideFoot}><span>Staff portal</span><small>{session.user.email}</small><button onClick={() => supabase.auth.signOut()}>Sign out →</button></div></aside>
    <section className={styles.content}>
      <div className={styles.heading}><div><div className={styles.eyebrow}>CLINIC ADMINISTRATION</div><h1>Appointments</h1><p>Manage patient appointment requests in real time.</p></div><div className={styles.live}><span className={styles.dot}/> Live updates</div></div>
      <div className={styles.metrics}><div><span>Total requests</span><strong>{metrics.total}</strong><small>Latest 1,000 records</small></div><div><span>Pending confirmation</span><strong>{metrics.pending}</strong><small>Need your attention</small></div><div><span>Appointments today</span><strong>{metrics.today}</strong><small>Scheduled or preferred</small></div><div><span>Confirmed</span><strong>{metrics.confirmed}</strong><small>Ready for visit</small></div></div>
      <div className={styles.panel}><div className={styles.panelTitle}><h2>Appointment requests</h2><button className={styles.secondary} onClick={exportCsv}>↓ Export CSV</button></div>
        <div className={styles.filters}><input aria-label="Search appointments" placeholder="Search name, mobile or service…" value={search} onChange={e => setSearch(e.target.value)} /><select aria-label="Status filter" value={filter} onChange={e => setFilter(e.target.value as Filter)}><option value="all">All statuses</option>{statuses.map(x => <option value={x} key={x}>{x}</option>)}</select><input aria-label="Date filter" type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} /><button className={styles.secondary} onClick={() => {setFilter('all');setDateFilter('');setSearch('');}}>Clear</button></div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.tableScroll}><table><thead><tr><th>Patient</th><th>Requested for</th><th>Service</th><th>Status</th><th>Received</th><th></th></tr></thead><tbody>{visible.map(a => <tr key={a.id}><td><b>{a.patient_name}</b><small>{a.phone}</small></td><td><b>{displayDate(a.scheduled_date || a.preferred_date)}</b><small>{a.scheduled_time || a.preferred_time}</small></td><td>{a.service}</td><td><span className={`${styles.status} ${styles[a.status]}`}>{a.status}</span></td><td>{displayTimestamp(a.created_at)}</td><td><button className={styles.action} onClick={() => openAppointment(a)}>Manage →</button></td></tr>)}</tbody></table>{visible.length === 0 && <div className={styles.empty}>No appointment requests match these filters.</div>}</div>
      </div>
    </section>
    {selected && <div className={styles.overlay} role="presentation" onMouseDown={e => { if(e.target === e.currentTarget) setSelected(null); }}><section className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="appointment-title"><div className={styles.drawerTop}><div><div className={styles.eyebrow}>APPOINTMENT DETAILS</div><h2 id="appointment-title">{selected.patient_name}</h2></div><button aria-label="Close appointment details" className={styles.secondary} onClick={() => setSelected(null)}>✕</button></div>
      <p><b>Phone:</b> <a href={`tel:+91${selected.phone}`}>+91 {selected.phone}</a></p><p><b>Service:</b> {selected.service}</p><p><b>Patient preferred:</b> {displayDate(selected.preferred_date)}, {selected.preferred_time}</p><p><b>Requested:</b> {displayTimestamp(selected.created_at)}</p><p><b>Message:</b> {selected.message || 'None'}</p>
      <div className={styles.edit}><label>Status<select value={draftStatus} onChange={e => setDraftStatus(e.target.value as AppointmentStatus)}>{statuses.map(x => <option key={x} value={x}>{x}</option>)}</select></label><label>Scheduled date<input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} /></label><label>Scheduled time<input value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} placeholder="e.g. 11:30 AM" /></label><label>Internal staff note<textarea rows={4} maxLength={1000} value={adminNote} onChange={e => setAdminNote(e.target.value)} /></label></div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <div className={styles.drawerActions}><a className={styles.call} href={`tel:+91${selected.phone}`}>Call patient</a><button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div><p className={styles.disclaimer}>Changing status does not send an SMS or WhatsApp message. Contact the patient to confirm.</p>
    </section></div>}
  </main>;
}
