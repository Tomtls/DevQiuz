const userService = require('../services/userService');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const result = await userService.registerUser(username, email, password);
  res.status(result.success ? 201 : 400).json(result);
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const result = await userService.loginUser(username, password);
  res.status(result.success ? 200 : 401).json(result);
};
