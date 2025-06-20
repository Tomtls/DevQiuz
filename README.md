
# 🎮 DevQuiz

DevQuiz ist eine interaktive Quiz-App für IT-Themen. Sie bietet sowohl einen öffentlichen Demo-Modus als auch einen geschützten Bereich mit Nutzerkonto, eigenen Quizfragen und Highscore-Tracking. Außerdem existiert ein spezieller Bereich mit JavaScript-spezifischen Quizzes sowie ein Hello-World-API-Testbereich.

---

## 📁 Projektstruktur

DevQuiz/  
├── frontend/  # Ionic + Angular App  
└── backend/   # Express.js REST-API (Node.js)

---

## 🚀 Features

- ✅ **Demo-Quiz** ohne Registrierung starten
- ✅ **Benutzerregistrierung und Login**
- ✅ **Eigene Quizfragen erstellen**
- ✅ **Highscore-Tracking und globale Ranglisten**
- ✅ **Spezielle Quizzes**

---

## 🛠️ Technologien

### Frontend

- Ionic 8.x
- Angular 17+
- TypeScript
- Standalone Components
- Angular Router + Guards
- HTTP Interceptors (Auth + Error Handling)
- localStorage für Token-Handling

### Backend

- Node.js (v20 LTS)
- Express.js
- REST API (HTTP, JSON)
- JWT-Token-basierte Authentifizierung
- Middleware für Authentifizierung und Admin-Prüfung
- express-rate-limit (Ratenbegrenzung)
- Dateibasierte Persistenz (JSON)

---

## ▶️ Lokale Installation

### 🔧 Voraussetzungen

- Node.js (empfohlen: v20 LTS oder höher)
- npm (v9+)
- Ionic CLI

Installation der Ionic CLI:

```bash
npm install -g @ionic/cli
```

---

### Setup: Frontend

```bash
cd frontend
npm install
ionic serve
```

Frontend läuft unter `http://localhost:8100/`.

---

### Setup: Backend

```bash
cd backend
npm install
node index.js
```

Backend läuft unter `http://localhost:3000/`.

Beim ersten Start werden automatisch die JSON-Daten angelegt, falls nicht vorhanden.

---

## 🔐 Authentifizierung

- Registrierung und Login erfolgen über `/auth/register` und `/auth/login`
- Authentifizierung per JWT-Token, Speicherung im `localStorage`
- Frontend-Guards schützen alle privaten Routen

Admin-Test-Account:

- Benutzername: **admin1**
- Passwort: **Adm!n123**

---

## 👤 Autoren

- Tom Schneider (tom-luca.schneider@std.dhsh.de)
- Henri Herdel (henri.herdel@std.dhsh.de)
- René Mohr (rene.mohr@std.dhsh.de)

---

## 📄 Lizenz

MIT License – frei verwendbar für Lern- und Demonstrationszwecke.
