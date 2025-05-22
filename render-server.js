import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import MemoryStore from 'memorystore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const SessionStore = MemoryStore(session);
const PORT = process.env.PORT || 5000;

// Session setup
app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new SessionStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'animes2u-secret',
  })
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Animes2u API is running' });
});

// Serve the static HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
