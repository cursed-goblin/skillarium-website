/* Skillarium Portal — client-side management (localStorage demo store)
   Mirrors cursed-goblin/portal-management-system features:
   register teacher/student, teacher ESS + admin login, dashboard, activity logs.
*/

const KEY = "skillarium_portal_v1";
const SESSION = "skillarium_portal_session";

const DEFAULT = () => ({
  teachers: [],
  students: [],
  logs: [],
  nextTeacherId: 1,
  nextStudentId: 1,
  nextLogId: 1,
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT();
    return { ...DEFAULT(), ...JSON.parse(raw) };
  } catch {
    return DEFAULT();
  }
}

function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nowIso() {
  return new Date().toISOString();
}

async function hashPass(pw) {
  const data = new TextEncoder().encode("skl:" + pw);
  if (crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0;
  for (let i = 0; i < data.length; i++) h = (Math.imul(31, h) + data[i]) | 0;
  return "f" + (h >>> 0).toString(16);
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(user) {
  sessionStorage.setItem(SESSION, JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION);
}

export function requireAuth(roles = ["Admin", "Teacher"]) {
  const u = getSession();
  if (!u || !roles.includes(u.role)) {
    location.href = "./login.html";
    return null;
  }
  return u;
}

export async function register({ name, email, role, password }) {
  name = String(name || "").trim();
  email = String(email || "").trim().toLowerCase();
  role = role === "Teacher" ? "Teacher" : role === "Student" ? "Student" : "";

  if (!name || !email || !role) throw new Error("Name, email and role are required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format.");

  const db = load();
  const exists =
    db.teachers.some((t) => t.email === email) ||
    db.students.some((s) => s.email === email);
  if (exists) throw new Error("Email already registered.");

  let teacherId = null;
  let studentId = null;

  if (role === "Teacher") {
    if (!password || String(password).length < 8) {
      throw new Error("Password is required for teachers (min 8 characters).");
    }
    teacherId = db.nextTeacherId++;
    db.teachers.unshift({
      teacher_id: teacherId,
      name,
      email,
      password: await hashPass(password),
      created_at: nowIso(),
    });
  } else {
    studentId = db.nextStudentId++;
    db.students.unshift({
      student_id: studentId,
      name,
      email,
      created_at: nowIso(),
    });
  }

  db.logs.unshift({
    log_id: db.nextLogId++,
    log_date: today(),
    teacher_id: teacherId,
    student_id: studentId,
    status: "Registered",
  });

  save(db);
  return { ok: true, role, email };
}

export async function login({ email, password, portal }) {
  email = String(email || "").trim().toLowerCase();
  password = String(password || "");
  portal = portal === "admin" ? "admin" : "teacher";

  if (!email || !password) throw new Error("Email and password are required.");

  if (portal === "admin") {
    if (email === "admin@portal.local" && password === "admin123") {
      const user = { role: "Admin", email, name: "Administrator" };
      setSession(user);
      return user;
    }
    throw new Error("Invalid admin credentials.");
  }

  const db = load();
  const teacher = db.teachers.find((t) => t.email === email);
  if (!teacher) throw new Error("Invalid teacher credentials.");
  const hash = await hashPass(password);
  if (teacher.password !== hash) throw new Error("Invalid teacher credentials.");

  const user = {
    id: teacher.teacher_id,
    role: "Teacher",
    name: teacher.name,
    email: teacher.email,
  };
  setSession(user);
  return user;
}

export function logout() {
  clearSession();
  location.href = "./index.html";
}

export function getDashboardData() {
  const db = load();
  return {
    teachers: db.teachers.map(({ password, ...t }) => t),
    students: db.students.slice(),
    logs: db.logs.slice(),
  };
}

export function nameById(list, id, col) {
  if (id == null) return "—";
  const row = list.find((x) => x[col] == id);
  return row ? row.name : "N/A";
}
