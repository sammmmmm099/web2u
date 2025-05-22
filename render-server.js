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
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav ul {
      display: flex;
      list-style: none;
      gap: 1.5rem;
    }
    nav a {
      color: white;
      text-decoration: none;
      font-weight: 600;
      transition: opacity 0.2s;
    }
    nav a:hover {
      opacity: 0.8;
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
      cursor: pointer;
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
      cursor: pointer;
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
      cursor: pointer;
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
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .modal.active {
      opacity: 1;
      pointer-events: all;
    }
    .modal-content {
      background-color: var(--card-bg);
      border-radius: 8px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    .modal-close {
      float: right;
      font-size: 1.5rem;
      background: none;
      border: none;
      color: var(--foreground);
      cursor: pointer;
    }
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--primary);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      transform: translateY(100px);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .toast.active {
      transform: translateY(0);
      opacity: 1;
    }
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      .features, .anime-grid {
        grid-template-columns: 1fr;
      }
      nav {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Animes2u Community</h1>
    <nav>
      <ul>
        <li><a href="#" class="nav-link" data-action="home">Home</a></li>
        <li><a href="#" class="nav-link" data-action="browse">Browse</a></li>
        <li><a href="#" class="nav-link" data-action="telegram">Telegram</a></li>
        <li><a href="#adminLoginSection" class="nav-link">Admin</a></li>
      </ul>
    </nav>
  </header>
  
  <div class="container">
    <div class="hero">
      <h2>Your Ultimate Anime Community Hub</h2>
      <p>Discover new anime, connect with fellow fans, and explore your favorite shows - all in one place.</p>
      <div>
        <a href="https://github.com/sammmmmm099/web2u" target="_blank" class="btn" style="margin-right: 15px;">View on GitHub</a>
        <a href="#adminLoginSection" class="btn admin-link" style="background-color: #1e1e1e; border: 1px solid var(--primary);">Admin Login</a>
      </div>
    </div>
    
    <div class="features">
      <div class="feature-card" data-action="discover">
        <div class="feature-icon">🔍</div>
        <h3>Discover Anime</h3>
        <p>Browse through our curated collection of anime shows and find hidden gems.</p>
      </div>
      <div class="feature-card" data-action="telegram">
        <div class="feature-icon">📱</div>
        <h3>Connect via Telegram</h3>
        <p>Join our Telegram channels to download and discuss your favorite anime.</p>
      </div>
      <div class="feature-card" data-action="trending">
        <div class="feature-icon">⭐</div>
        <h3>Trending Shows</h3>
        <p>Stay up-to-date with what's popular in the anime community right now.</p>
      </div>
    </div>
    
    <h2>Featured Anime</h2>
    <div class="anime-grid">
      <div class="anime-card" data-anime="demon-slayer">
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
      
      <div class="anime-card" data-anime="my-hero-academia">
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
      
      <div class="anime-card" data-anime="attack-on-titan">
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
      
      <div class="anime-card" data-anime="one-piece">
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
      <button class="btn" id="exploreBtn">Get Started</button>
    </div>
    
    <!-- Admin Login Section -->
    <div id="adminLoginSection" style="max-width: 400px; margin: 4rem auto; padding: 2rem; background-color: var(--card-bg); border-radius: 8px; border: 1px solid var(--border);">
      <h3 style="margin-bottom: 1.5rem; text-align: center;">Admin Login</h3>
      <form id="adminLoginForm" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label for="username" style="display: block; margin-bottom: 0.5rem;">Username</label>
          <input type="text" id="username" name="username" style="width: 100%; padding: 0.75rem; background-color: #2d2d2d; border: 1px solid var(--border); border-radius: 4px; color: var(--foreground);">
        </div>
        <div>
          <label for="password" style="display: block; margin-bottom: 0.5rem;">Password</label>
          <input type="password" id="password" name="password" style="width: 100%; padding: 0.75rem; background-color: #2d2d2d; border: 1px solid var(--border); border-radius: 4px; color: var(--foreground);">
        </div>
        <button type="submit" style="background-color: var(--primary); color: white; padding: 0.75rem; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; margin-top: 1rem;">Login</button>
      </form>
      <p id="loginMessage" style="margin-top: 1rem; text-align: center; color: #f87171; display: none;">Invalid credentials. Please try again.</p>
    </div>
  </div>
  
  <div class="modal" id="notAvailableModal">
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <h3 style="margin-bottom: 1rem;">Feature Preview</h3>
      <p>This feature is only available in the full version of Animes2u Community.</p>
      <p style="margin-top: 1rem;">The complete website includes:</p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
        <li>Full anime database</li>
        <li>Search and filtering</li>
        <li>Admin dashboard</li>
        <li>Telegram channel integration</li>
      </ul>
      <p style="margin-top: 1rem;">Check out our GitHub repository to access the full app!</p>
      <a href="https://github.com/sammmmmm099/web2u" target="_blank" class="btn" style="display: block; text-align: center;">View Source Code</a>
    </div>
  </div>

  <div class="toast" id="demoToast">This is a demo version with limited functionality.</div>
  
  <footer>
    <p>© 2025 Animes2u Community. All rights reserved.</p>
  </footer>

  <script>
    // Show toast on load
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        document.getElementById('demoToast').classList.add('active');
        setTimeout(() => {
          document.getElementById('demoToast').classList.remove('active');
        }, 5000);
      }, 2000);
    });

    // Modal functionality
    const modal = document.getElementById('notAvailableModal');
    const closeModal = document.querySelector('.modal-close');
    
    function showModal() {
      modal.classList.add('active');
    }
    
    closeModal.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      // For the demo, show message about limited functionality
      document.getElementById('loginMessage').style.display = 'block';
      document.getElementById('loginMessage').innerText = 'Admin login functionality is only available in the full version.';
      document.getElementById('loginMessage').style.color = '#fde68a';
    });
    
    // Make all anime cards and feature cards show the modal
    document.querySelectorAll('.anime-card, .feature-card, .nav-link, #exploreBtn').forEach(element => {
      element.addEventListener('click', (e) => {
        // Don't show modal for admin links that should scroll to login
        if (e.currentTarget.classList.contains('nav-link') && 
            e.currentTarget.getAttribute('href') === '#adminLoginSection') {
          return;
        }
        
        // Prevent default only for links
        if (e.currentTarget.tagName === 'A') {
          e.preventDefault();
        }
        
        showModal();
      });
    });
  </script>
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
