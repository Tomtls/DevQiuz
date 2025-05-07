# 🎮 DevQuiz
DevQuiz ist eine interaktive Quiz-App für IT-Themen. Sie bietet sowohl einen öffentlichen Demo-Modus als auch einen geschützten Bereich mit Nutzerkonto, eigenen Quizfragen und Highscore-Tracking. 

---

## 📁 Projektstruktur
DevQuiz/ 
├── frontend/ # Ionic + Angular App 
└── backend/ # (Optional) Express.js REST-API

---

## 🚀 Features

- ✅ **Demo-Quiz** ohne Login starten
- ✅ **Benutzerbereich** mit Login & Registrierung
- ✅ Eigene **Quizfragen erstellen**
- ✅ **Punkte sammeln** und **Highscores vergleichen**

---

## 🛠️ Technologien

### Frontend
- [Ionic](https://ionicframework.com/) 8.x
- [Angular](https://angular.io/) 17+
- TypeScript
- Standalone Components
- Angular Router + Guards
- localStorage / Cookie-Handling

### Backend
- 
- 

---

## ▶️ Lokale Installation

### 🔧 Voraussetzungen

- Node.js (empfohlen: v20 LTS oder höher)
- npm (v9+)
- Ionic CLI

bash
npm install -g @ionic/cli

### Setup: Frontend
cd frontend
npm install
ionic serve

### Setup: Backend
--

## 🔐 Authentifizierung
Demo-Login mit Tokens (z. B. im localStorage)
Routen über auth.guard.ts abgesichert
Kein echtes Backend erforderlich – aber vorbereitet


## 👤 Autoren
Tom Schneider   tom-luca.schneider@std.dhsh.de
Henri Herdel    henri.herdel@std.dhsh.de
René Mohr       rene.mohr@std.dhsh.de


## 📄 Lizenz
MIT License – frei verwendbar für Lern- und Demo-Zwecke.