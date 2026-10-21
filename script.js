const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

$('#menuBtn').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$$('.side-nav a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  $$('.side-nav a').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
  if (window.innerWidth <= 900) $('#sidebar').classList.remove('open');
}));
$$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
  document.getElementById(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
}));
$('#logoutBtn').addEventListener('click', e => {
  e.preventDefault();
  showToast('Demo paneldan chiqish tugmasi bosildi.');
});
$('#notificationBtn').addEventListener('click', () => showToast('Hozircha yangi bildirishnomalar yo‘q.'));

function addRemoveButton(row) {
  const cell = row.insertCell(-1);
  const button = document.createElement('button');
  button.className = 'row-delete';
  button.textContent = 'O‘chirish';
  button.style.cssText = 'border:0;background:#ffe7ef;color:#c52f64;border-radius:6px;padding:6px 8px;font-size:10px';
  button.addEventListener('click', () => row.remove());
  cell.appendChild(button);
}

$('#showCenterForm').addEventListener('click', () => $('#centerForm').hidden = !$('#centerForm').hidden);
$('#centerForm').addEventListener('submit', e => {
  e.preventDefault();
  const row = $('#centerTable').insertRow();
  [$('#centerName').value.trim(), $('#centerSubject').value.trim(), $('#centerDistrict').value.trim()].forEach(value => row.insertCell().textContent = value);
  const status = row.insertCell(); status.innerHTML = '<span class="status">Yangi</span>';
  addRemoveButton(row);
  e.target.reset(); e.target.hidden = true;
  showToast('O‘quv markazi jadvalga qo‘shildi.');
});

$('#showSpecialistForm').addEventListener('click', () => $('#specialistForm').hidden = !$('#specialistForm').hidden);
$('#specialistForm').addEventListener('submit', e => {
  e.preventDefault();
  const row = $('#specialistTable').insertRow();
  [$('#specialistName').value.trim(), $('#specialistRole').value, $('#specialistArea').value.trim()].forEach(value => row.insertCell().textContent = value);
  const status = row.insertCell(); status.innerHTML = '<span class="status">Yangi</span>';
  addRemoveButton(row);
  e.target.reset(); e.target.hidden = true;
  showToast('Mutaxassis jadvalga qo‘shildi.');
});

$('#showNewsForm').addEventListener('click', () => $('#newsForm').hidden = !$('#newsForm').hidden);
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = $('#newNewsTitle').value.trim();
  const date = $('#newNewsDate').value.trim() || 'Yangi e’lon';
  const description = $('#newNewsText').value.trim();
  const item = document.createElement('div');
  item.className = 'admin-news-item';
  const heading = document.createElement('b'); heading.textContent = title;
  const dateEl = document.createElement('small'); dateEl.textContent = date + ' · ';
  const desc = document.createElement('span'); desc.textContent = description;
  item.append(heading, dateEl, desc);
  $('#newsTable').prepend(item);
  const preview = document.createElement('div'); preview.className = 'news-row';
  const thumb = document.createElement('div'); thumb.className = 'news-thumb thumb-blue'; thumb.textContent = '✦';
  const text = document.createElement('div'); text.className = 'news-text';
  const dateText = document.createElement('small'); dateText.textContent = date;
  const titleText = document.createElement('b'); titleText.textContent = title;
  text.append(dateText, titleText); preview.append(thumb, text);
  $('#newsPreview').prepend(preview);
  e.target.reset(); e.target.hidden = true;
  showToast('Yangilik qo‘shildi.');
});

$('#saveSettings').addEventListener('click', () => {
  $('#settingsMessage').textContent = 'Sozlamalar ushbu sahifada qabul qilindi (demo).';
  showToast('Sozlamalar saqlash uchun demo rejimda tayyor.');
});
$('#globalSearch').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const query = e.target.value.trim().toLocaleLowerCase('uz');
  if (!query) return;
  const targets = $$('.panel, .management, .stat-card').filter(el => el.innerText.toLocaleLowerCase('uz').includes(query));
  if (targets.length) {
    targets[0].scrollIntoView({behavior:'smooth', block:'center'});
    showToast('Mos ma’lumot topildi.');
  } else showToast('Mos ma’lumot topilmadi.');
});

function showToast(message) {
  let toast = $('#toast');
  toast.textContent = message;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.textContent = '', 3200);
}


/* Demo autentifikatsiya: haqiqiy himoya uchun backend kerak */
const AUTH_USERS_KEY = 'oson_talim_users_v1';
const AUTH_SESSION_KEY = 'oson_talim_session_v1';
const ADMIN_CODE = 'ADMIN17';
const ADMIN_PASSWORD = 'Kelajak17!';

function readUsers() {
  try { return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '[]'); }
  catch { return []; }
}
function setAuthTab(tab) {
  $$('.auth-tab').forEach(button => button.classList.toggle('active', button.dataset.tab === tab));
  $('#loginForm').hidden = tab !== 'login';
  $('#registerForm').hidden = tab !== 'register';
  $('#adminForm').hidden = tab !== 'admin';
  const copy = {
    login: ['Xush kelibsiz!', 'Davom etish uchun hisobingizga kiring yoki ro‘yxatdan o‘ting.'],
    register: ['Hisob yarating', 'Platformadan foydalanish uchun ma’lumotlaringizni kiriting.'],
    admin: ['Administrator kirishi', 'Admin kodi va maxsus parol bilan boshqaruv paneliga kiring.']
  }[tab];
  $('#authTitle').textContent = copy[0];
  $('#authSubtitle').textContent = copy[1];
}
$$('.auth-tab').forEach(button => button.addEventListener('click', () => setAuthTab(button.dataset.tab)));

function showAuthScreen() {
  $('#authScreen').hidden = false;
  document.body.style.overflow = 'hidden';
}
function enterApp(session) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  $('#authScreen').hidden = true;
  document.body.style.overflow = '';
  showToast('Xush kelibsiz, ' + (session.name || 'Admin') + '!');
  const profile = $('.admin-profile');
  if (profile && session.role !== 'admin') {
    profile.querySelector('b').textContent = session.name;
    profile.querySelector('small').textContent = 'Foydalanuvchi';
    $('.admin-avatar').textContent = (session.name || 'F').trim().charAt(0).toUpperCase();
  }
}
$('#registerForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#registerName').value.trim();
  const identity = $('#registerIdentity').value.trim().toLowerCase();
  const password = $('#registerPassword').value;
  const password2 = $('#registerPassword2').value;
  const message = $('#registerMessage');
  message.classList.remove('success');
  if (password !== password2) { message.textContent = 'Parollar bir xil emas.'; return; }
  const users = readUsers();
  if (users.some(user => user.identity === identity)) { message.textContent = 'Bu telefon yoki email allaqachon ro‘yxatdan o‘tgan.'; return; }
  users.push({name, identity, password, createdAt: new Date().toISOString()});
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  message.textContent = 'Ro‘yxatdan o‘tish muvaffaqiyatli!';
  message.classList.add('success');
  setTimeout(() => enterApp({name, identity, role:'user'}), 450);
});
$('#loginForm').addEventListener('submit', event => {
  event.preventDefault();
  const identity = $('#loginIdentity').value.trim().toLowerCase();
  const password = $('#loginPassword').value;
  const user = readUsers().find(item => item.identity === identity && item.password === password);
  const message = $('#loginMessage');
  message.classList.remove('success');
  if (!user) { message.textContent = 'Hisob topilmadi yoki parol noto‘g‘ri. Avval ro‘yxatdan o‘ting.'; return; }
  enterApp({name:user.name, identity:user.identity, role:'user'});
});
$('#adminForm').addEventListener('submit', event => {
  event.preventDefault();
  const code = $('#adminCode').value.trim();
  const password = $('#adminPass').value;
  const message = $('#adminMessage');
  message.classList.remove('success');
  if (code !== ADMIN_CODE || password !== ADMIN_PASSWORD) { message.textContent = 'Admin kodi yoki paroli noto‘g‘ri.'; return; }
  message.textContent = 'Admin panel ochilmoqda...';
  message.classList.add('success');
  setTimeout(() => enterApp({name:'Administrator', identity:code, role:'admin'}), 300);
});
$('#logoutBtn').addEventListener('click', event => {
  event.preventDefault();
  localStorage.removeItem(AUTH_SESSION_KEY);
  showAuthScreen();
  setAuthTab('login');
  showToast('Hisobdan chiqdingiz.');
});
$('#saveKelajakLink').addEventListener('click', () => {
  localStorage.setItem('oson_talim_kelajak_link', 'https://kelajak.uzedu.uz/#/home');
  $('#syncMessage').textContent = 'Rasmiy havola ushbu brauzerda saqlandi. Avtomatik sinxronizatsiya uchun API ruxsati kerak.';
  showToast('Kelajak markazi havolasi saqlandi.');
});
(function initAuth() {
  const session = localStorage.getItem(AUTH_SESSION_KEY);
  if (session) {
    try { enterApp(JSON.parse(session)); } catch { showAuthScreen(); }
  } else {
    showAuthScreen();
    setAuthTab('login');
  }
})();
