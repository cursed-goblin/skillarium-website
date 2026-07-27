const KEY='sk_portal_v2', SES='sk_portal_ses';
const def=()=>({teachers:[],students:[],logs:[],t:1,s:1,l:1});
const load=()=>{try{return {...def(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return def()}};
const save=d=>localStorage.setItem(KEY,JSON.stringify(d));
const today=()=>new Date().toISOString().slice(0,10);
const now=()=>new Date().toISOString();
async function hash(pw){
  const data=new TextEncoder().encode('sk:'+pw);
  if(crypto?.subtle){const b=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  let h=0; for(const c of data) h=((h<<5)-h)+c|0; return 'f'+(h>>>0).toString(16);
}
export const getSession=()=>{try{return JSON.parse(sessionStorage.getItem(SES)||'null')}catch{return null}};
export const setSession=u=>sessionStorage.setItem(SES,JSON.stringify(u));
export const clearSession=()=>sessionStorage.removeItem(SES);
export function requireAuth(roles=['Admin','Teacher']){
  const u=getSession(); if(!u||!roles.includes(u.role)){location.href='./login.html';return null} return u;
}
export async function register({name,email,role,password}){
  name=String(name||'').trim(); email=String(email||'').trim().toLowerCase();
  role=role==='Teacher'?'Teacher':role==='Student'?'Student':'';
  if(!name||!email||!role) throw new Error('Name, email and role are required.');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email.');
  const db=load();
  if(db.teachers.some(t=>t.email===email)||db.students.some(s=>s.email===email)) throw new Error('Email already registered.');
  let teacher_id=null, student_id=null;
  if(role==='Teacher'){
    if(!password||password.length<8) throw new Error('Teacher password min 8 characters.');
    teacher_id=db.t++; db.teachers.unshift({teacher_id,name,email,password:await hash(password),created_at:now()});
  } else { student_id=db.s++; db.students.unshift({student_id,name,email,created_at:now()}); }
  db.logs.unshift({log_id:db.l++,log_date:today(),teacher_id,student_id,status:'Registered'});
  save(db); return {ok:true};
}
export async function login({email,password,portal}){
  email=String(email||'').trim().toLowerCase(); password=String(password||'');
  if(!email||!password) throw new Error('Email and password required.');
  if(portal==='admin'){
    if(email==='admin@portal.local'&&password==='admin123'){const u={role:'Admin',name:'Administrator',email}; setSession(u); return u;}
    throw new Error('Invalid admin credentials.');
  }
  const t=load().teachers.find(x=>x.email===email); if(!t) throw new Error('Invalid teacher credentials.');
  if(t.password!==await hash(password)) throw new Error('Invalid teacher credentials.');
  const u={role:'Teacher',name:t.name,email:t.email,id:t.teacher_id}; setSession(u); return u;
}
export function logout(){clearSession(); location.href='./index.html'}
export function getDashboardData(){
  const db=load();
  return {teachers:db.teachers.map(({password,...t})=>t), students:db.students.slice(), logs:db.logs.slice()};
}
export function nameById(list,id,col){ if(id==null) return '—'; return list.find(x=>x[col]==id)?.name||'N/A' }
