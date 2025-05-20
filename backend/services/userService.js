const fs = require('fs');
const bcrypt = require('bcryptjs');
const dataFile = './data/users.json';

function readUsers() {
  if (!fs.existsSync(dataFile)) return [];
  const raw = fs.readFileSync(dataFile);
  try { return JSON.parse(raw || '[]'); } 
  catch (err) { return []; }
}

function writeUsers(users) {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

exports.registerUser = async (username, email, password) => {
  const users = readUsers();

  const exists = users.find(u => u.username === username);
  if (exists) return { success: false, message: 'Benutzername existiert bereits' };

  const hash = await bcrypt.hash(password, 10);

  const maxId = users.reduce((max,user) => Math.max(max, user.user_id || 0), 0)
  const newUser = { user_id: maxId + 1, username, email, password: hash };
  users.push(newUser);
  writeUsers(users);

  return { success: true, message: 'Registrierung erfolgreich' };
};

exports.loginUser = async (username, password) => {
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return { success: false, message: 'Benutzer nicht gefunden' };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { success: false, message: 'Falsches Passwort' };

  return { success: true, message: 'Login erfolgreich' };
};
