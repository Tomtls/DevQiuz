import { registerUser, loginUser } from '../services/userService.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const result = await registerUser(username, email, password);
  res.status(result.success ? 201 : 400).json(result);
}

export const login = async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  res.status(result.success ? 200 : 401).json(result);
}
