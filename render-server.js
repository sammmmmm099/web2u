import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Log the current directory and contents for debugging
console.log('Current directory:', __dirname);
try {
  console.log('Directory contents:', fs.readdirSync(__dirname));
} catch (err) {
  console.log('Error reading directory:', err.message);
}

// Check various possible static file locations
const possiblePaths = [
  path.join(__dirname, 'dist', 'public'),
  path.join(__dirname, 'public'),
  path.join('/opt/render/project/src/dist/public'),
  path.join('/opt/render/project/src/public'),
  path.join(__dirname, '..', 'public'),
  path.join(__dirname, '..', 'dist', 'public')
];

let staticPath;
for (const pathToCheck of possiblePaths) {
  try {
    if (fs.existsSync(pathToCheck)) {
      staticPath = pathToCheck;
      console.log(`Found static directory at: ${staticPath}`);
      try {
        console.log(`Contents of ${staticPath}:`, fs.readdirSync(staticPath));
      } catch (err) {
        console.log(`Error reading ${staticPath}:`, err.message);
      }
      break;
    }
  } catch (err) {
    console.log(`Path check error for ${pathToCheck}:`, err.message);
  }
}

// Beautiful inline HTML content for Animes2u
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Animes2u Community</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #9333ea;
      --primary-dark: #7e22ce;
      --background: #121212;
      --foreground: #e1e1e1;
      --card-bg: #1e1e1e;
      --border: #333;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body { 
      background-color: var(--background); 
      color: var(--foreground);
      font-family: 'Nunito', sans-serif;
      line-height: 1.6;
    }
    header { 
      background-color: var(--primary-dark);
      padding: 1rem 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .hero {
      text-align: center;
      margin: 3rem 0;
    }
    h1 {
      font-size: 2rem;
      font-weight: 800;
    }
    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(to right, #9333ea, #c026d3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      margin-bottom: 1rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    .feature-card {
      background-color: var(--card-bg);
      border-radius: 0.5rem;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border);
      transition: transform 0.3s ease;
    }
    .feature-card:hover {
      transform: translateY(-5px);
    }
    .feature-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--primary);
    }
    .anime-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    .anime-card {
      background-color: var(--card-bg);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .anime-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px -5px rgba(147, 51, 234, 0.3);
    }
    .anime-img {
      height: 200px;
      width: 100%;
      object-fit: cover;
    }
    .anime-info {
      padding: 1.5rem;
    }
    .anime-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    .badge {
      display: inline-block;
      background-color: rgba(147, 51, 234, 0.2);
      color: #d8b4fe;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.75rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      border: 1px solid #9333ea;
    }
    .btn {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 600;
      margin-top: 2rem;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: var(--primary-dark);
    }
    footer {
      background-color: #1a1a1a;
      padding: 2rem;
      text-align: center;
      margin-top: 4rem;
      border-top: 1px solid var(--border);
    }
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      .features, .anime-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Animes2u Community</h1>
  </header>
  
  <div class="container">
    <div class="hero">
      <h2>Your Ultimate Anime Community Hub</h2>
      <p>Discover new anime, connect with fellow fans, and explore your favorite shows - all in one place.</p>
      <a href="https://github.com/sammmmmm099/web2u" class="btn">View on GitHub</a>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <div class="feature-icon">🔍</div>
        <h3>Discover Anime</h3>
        <p>Browse through our curated collection of anime shows and find hidden gems.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h3>Connect via Telegram</h3>
        <p>Join our Telegram channels to download and discuss your favorite anime.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⭐</div>
        <h3>Trending Shows</h3>
        <p>Stay up-to-date with what's popular in the anime community right now.</p>
      </div>
    </div>
    
    <h2>Featured Anime</h2>
    <div class="anime-grid">
      <div class="anime-card">
        <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=500" alt="Demon Slayer" class="anime-img">
        <div class="anime-info">
          <h3 class="anime-title">Demon Slayer</h3>
          <div>
            <span class="badge">Action</span>
            <span class="badge">Fantasy</span>
          </div>
          <p>A young boy becomes a demon slayer after his family is slaughtered...</p>
        </div>
      </div>
      
      <div class="anime-card">
        <img src="https://images.unsplash.com/photo-1560972550-aba3456b5564?ixlib=rb-4.0.3&auto=format&fit=crop&w=500" alt="My Hero Academia" class="anime-img">
        <div class="anime-info">
          <h3 class="anime-title">My Hero Academia</h3>
          <div>
            <span class="badge">Action</span>
            <span class="badge">Superhero</span>
          </div>
          <p>In a world where people with superpowers are the norm...</p>
        </div>
      </div>
      
      <div class="anime-card">
        <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?ixlib=rb-4.0.3&auto=format&fit=crop&w=500" alt="Attack on Titan" class="anime-img">
        <div class="anime-info">
          <h3 class="anime-title">Attack on Titan</h3>
          <div>
            <span class="badge">Action</span>
            <span class="badge">Drama</span>
          </div>
          <p>Humanity lives behind walls, protected from giant humanoid Titans...</p>
        </div>
      </div>
      
      <div class="anime-card">
        <img src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500" alt="One Piece" class="anime-img">
        <div class="anime-info">
          <h3 class="anime-title">One Piece</h3>
          <div>
            <span class="badge">Adventure</span>
            <span class="badge">Fantasy</span>
          </div>
          <p>Monkey D. Luffy and his pirate crew explore the Grand Line...</p>
        </div>
      </div>
    </div>
    
    <div style="text-align: center; margin: 4rem 0;">
      <h2>Ready to explore?</h2>
      <p>This is a static preview of the Animes2u Community Website.</p>
      <p>For the full interactive experience, check out our GitHub repository.</p>
      <a href="https://github.com/sammmmmm099/web2u" class="btn">Get Started</a>
    </div>
  </div>
  
  <footer>
    <p>© 2025 Animes2u Community. All rights reserved.</p>
  </footer>
</body>
</html>
`;

// Serve API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', message: 'Animes2u API is running' });
});

// Always have a guaranteed fallback
if (!staticPath) {
  console.log('No static directory found. Using inline HTML fallback.');
  
  // Serve the inline HTML content for all routes except API
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    }
  });
} else {
  // Serve static files if path exists
  app.use(express.static(staticPath));
  
  // Serve the static HTML file for all other routes (except API)
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
    } else {
      try {
        const indexPath = path.join(staticPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.log('Index file not found at', indexPath);
          res.setHeader('Content-Type', 'text/html');
          res.send(htmlContent);
        }
      } catch (err) {
        console.log('Error serving index file:', err.message);
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
      }
    }
  });
}

app.listen(PORT, () => {
  console.log(`✨ Animes2u server running on port ${PORT}`);
});
