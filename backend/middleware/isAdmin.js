function isAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ message: 'Nur Admins dürfen diese Aktion ausführen.' });
  }
  next();
}

module.exports = isAdmin;
