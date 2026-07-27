// Skillarium portal (classic script)
(function () {
  const KEY = 'sk_portal_v2';
  const SES = 'sk_portal_ses';
  const def = function () { return { teachers: [], students: [], logs: [], t: 1, s: 1, l: 1 }; };
  const load = function () {
    try { return Object.assign(def(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return def(); }
  };
  const save = function (d) { localStorage.setItem(KEY, JSON.stringify(d)); };
  const today = function () { return new Date().toISOString().slice(0, 10); };
  const now = function () { return new Date().toISOString(); };

  function hash(pw) {
    return new Promise(function (resolve) {
      const data = new TextEncoder().encode('sk:' + pw);
      if (window.crypto && crypto.subtle) {
        crypto.subtle.digest('SHA-256', data).then(function (b) {
          resolve(Array.from(new Uint8Array(b)).map(function (x) {
            return x.toString(16).padStart(2, '0');
          }).join(''));
        }).catch(function () {
          let h = 0;
          for (let i = 0; i < data.length; i++) h = ((h << 5) - h) + data[i] | 0;
          resolve('f' + (h >>> 0).toString(16));
        });
      } else {
        let h = 0;
        for (let i = 0; i < data.length; i++) h = ((h << 5) - h) + data[i] | 0;
        resolve('f' + (h >>> 0).toString(16));
      }
    });
  }

  const P = {};
  P.getSession = function () {
    try { return JSON.parse(sessionStorage.getItem(SES) || 'null'); } catch (e) { return null; }
  };
  P.setSession = function (u) { sessionStorage.setItem(SES, JSON.stringify(u)); };
  P.clearSession = function () { sessionStorage.removeItem(SES); };
  P.requireAuth = function (roles) {
    roles = roles || ['Admin', 'Teacher'];
    const u = P.getSession();
    if (!u || roles.indexOf(u.role) === -1) { location.href = './login.html'; return null; }
    return u;
  };
  P.register = function (opts) {
    let name = String(opts.name || '').trim();
    let email = String(opts.email || '').trim().toLowerCase();
    let role = opts.role === 'Teacher' ? 'Teacher' : opts.role === 'Student' ? 'Student' : '';
    let password = opts.password || '';
    if (!name || !email || !role) return Promise.reject(new Error('Name, email and role are required.'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Promise.reject(new Error('Invalid email.'));
    const db = load();
    if (db.teachers.some(function (t) { return t.email === email; }) ||
        db.students.some(function (s) { return s.email === email; })) {
      return Promise.reject(new Error('Email already registered.'));
    }
    return (role === 'Teacher' ? hash(password) : Promise.resolve(null)).then(function (pwHash) {
      let teacher_id = null, student_id = null;
      if (role === 'Teacher') {
        if (!password || password.length < 8) throw new Error('Teacher password min 8 characters.');
        teacher_id = db.t++;
        db.teachers.unshift({ teacher_id: teacher_id, name: name, email: email, password: pwHash, created_at: now() });
      } else {
        student_id = db.s++;
        db.students.unshift({ student_id: student_id, name: name, email: email, created_at: now() });
      }
      db.logs.unshift({ log_id: db.l++, log_date: today(), teacher_id: teacher_id, student_id: student_id, status: 'Registered' });
      save(db);
      return { ok: true };
    });
  };
  P.login = function (opts) {
    const email = String(opts.email || '').trim().toLowerCase();
    const password = String(opts.password || '');
    const portal = opts.portal;
    if (!email || !password) return Promise.reject(new Error('Email and password required.'));
    if (portal === 'admin') {
      if (email === 'admin@portal.local' && password === 'admin123') {
        const u = { role: 'Admin', name: 'Administrator', email: email };
        P.setSession(u);
        return Promise.resolve(u);
      }
      return Promise.reject(new Error('Invalid admin credentials.'));
    }
    const t = load().teachers.find(function (x) { return x.email === email; });
    if (!t) return Promise.reject(new Error('Invalid teacher credentials.'));
    return hash(password).then(function (h) {
      if (t.password !== h) throw new Error('Invalid teacher credentials.');
      const u = { role: 'Teacher', name: t.name, email: t.email, id: t.teacher_id };
      P.setSession(u);
      return u;
    });
  };
  P.logout = function () { P.clearSession(); location.href = './index.html'; };
  P.getDashboardData = function () {
    const db = load();
    return {
      teachers: db.teachers.map(function (t) {
        return { teacher_id: t.teacher_id, name: t.name, email: t.email, created_at: t.created_at };
      }),
      students: db.students.slice(),
      logs: db.logs.slice()
    };
  };
  P.nameById = function (list, id, col) {
    if (id == null) return '—';
    const row = list.find(function (x) { return x[col] == id; });
    return row ? row.name : 'N/A';
  };

  window.SkillariumPortal = P;
})();
