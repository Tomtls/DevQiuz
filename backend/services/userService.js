import { readJson, writeJson } from "./fileService.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Path to the user data file
const USERS_PATH = './data/users.json';

/**
 * Registers a new user by checking for existing usernames,
 * hashing the password, storing the new user in the JSON file,
 * and returning a signed JWT token.
 *
 * @param {string} username - The user's chosen username
 * @param {string} email - The user's email address
 * @param {string} password - The user's raw password
 * @returns {Promise<object>} Result object with success status, message and JWT
 */
export async function registerUser (username, email, password){
  const users = await readJson(USERS_PATH);

  // Normalize username to check for duplicates
  const cleanedUsername = username.trim().toLowerCase();
  const exists = users.find(u => u.username.trim().toLowerCase() === cleanedUsername);

  if (exists) return { success: false, message: 'Benutzername existiert bereits' };

  // Hash the user's password securely
  const hash = await bcrypt.hash(password, 10);

  // Find the next available user ID
  const maxId = users.reduce((max, user) => Math.max(max, user.user_id || 0), 0);

  const newUser = { 
    user_id: maxId + 1,
    username: username.trim(), 
    email: email.trim(),
    password: hash,
    is_admin: false 
  };

  users.push(newUser);
  await writeJson(USERS_PATH, users);

  // Create and return a signed JWT token
  const token = jwt.sign(
    { 
      user_id: newUser.user_id, 
      username: newUser.username, 
      is_admin: false 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { success: true, message: 'Registrierung erfolgreich', token };
};

/**
 * Authenticates a user by validating credentials and issuing a JWT.
 *
 * @param {string} username - The entered username
 * @param {string} password - The entered password
 * @returns {Promise<object>} Result object with success status, message and JWT
 */
export async function loginUser (username, password) {
  const users = await readJson(USERS_PATH);
  const cleanedUsername = username.trim().toLowerCase();

  const user = users.find(u => u.username.trim().toLowerCase() === cleanedUsername);

  if (!user) return { success: false, message: 'Benutzer nicht gefunden' };

  // Validate password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { success: false, message: 'Falsches Passwort' };

  // Generate JWT token
  const token = jwt.sign(
    { 
      user_id: user.user_id, 
      username: user.username, 
      is_admin: user.is_admin 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { success: true, message: 'Login erfolgreich', token };
};
