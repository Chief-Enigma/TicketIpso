

# Ticketing System

Ein webbasiertes Ticketing-System auf Basis von Next.js, Prisma und MySQL.

---

## Voraussetzungen

- Node.js 18+ oder 20+
- MySQL 8+
- npm

Optional für Deployment:
- Docker

---

## Installation (lokal starten)

1. Repository klonen

```bash
git clone <REPOSITORY_URL>
cd ticketing-system
```

2. Abhängigkeiten installieren

```bash
npm install
```

3. `.env` Datei erstellen

Im Root-Verzeichnis eine Datei namens `.env` anlegen mit folgendem Inhalt:

```env
DATABASE_URL="mysql://appuser:PASSWORT@localhost:3306/ticketing"
SESSION_SECRET="ein_sehr_langes_zufaelliges_secret"
```

Erklärung:
- `DATABASE_URL` → Verbindung zur MySQL-Datenbank
- `SESSION_SECRET` → Secret für die Session-Verschlüsselung (iron-session)

4. Datenbank vorbereiten

```bash
npx prisma migrate deploy
```

Alternativ für Entwicklung:

```bash
npx prisma migrate dev
```

5. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist danach erreichbar unter:

```
http://localhost:3000
```

---

## Initiale Testdaten (optional)

Um Testbenutzer und Tickets zu generieren:

```
http://localhost:3000/api/init
```

Hinweis:
Das Seeding wird nur einmal ausgeführt. Falls bereits ein Administrator existiert, wird kein erneutes Seeding durchgeführt.

---

## Produktionsstart

Build erstellen:

```bash
npm run build
```

Produktionsserver starten:

```bash
npm run start
```

---

## Deployment mit Docker

Docker Image bauen:

```bash
docker build -t ticketing-system .
```

Container starten:

```bash
docker run -d \
  --env-file .env \
  -p 1010:80 \
  --name ticketing-system \
  ticketing-system
```

---

## Wichtige Umgebungsvariablen

- `DATABASE_URL`
- `SESSION_SECRET`
- `NODE_ENV` (production / development)

---

## Technologien

- Next.js
- React
- Prisma ORM
- MySQL
- Vitest (Testing)
- Docker
- GitHub Actions (CI/CD)

---

## Lizenz

Dieses Projekt wurde im Rahmen einer Praxisarbeit entwickelt.