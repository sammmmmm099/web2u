import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertAnimeSchema } from "@shared/schema";
import express, { Request, Response } from "express";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      cookie: { maxAge: 86400000 },
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "animes2u-secret",
    })
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (req.session && req.session.userId) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const requireAdmin = async (req: Request, res: Response, next: Function) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };

  // API Routes
  const api = express.Router();

  // Auth routes
  api.post("/auth/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(credentials.username);

      if (!user || user.password !== credentials.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ 
        id: user.id, 
        username: user.username, 
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  api.post("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  api.get("/auth/me", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ 
      id: user.id, 
      username: user.username, 
      isAdmin: user.isAdmin 
    });
  });

  // Anime routes
  api.get("/anime", async (req, res) => {
    const { search, genre, language, status } = req.query as { 
      search?: string;
      genre?: string;
      language?: string;
      status?: string;
    };

    if (search) {
      const results = await storage.searchAnime(search);
      return res.json(results);
    }

    if (genre || language || status) {
      const results = await storage.filterAnime({
        genre,
        language,
        status,
      });
      return res.json(results);
    }

    const allAnime = await storage.getAllAnime();
    res.json(allAnime);
  });

  api.get("/anime/recommended", async (req, res) => {
    const anime = await storage.getRecommendedAnime();
    res.json(anime);
  });

  api.get("/anime/trending", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const anime = await storage.getTrendingAnime(limit);
    res.json(anime);
  });

  api.get("/anime/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const anime = await storage.getRecentlyAddedAnime(limit);
    res.json(anime);
  });

  api.get("/anime/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const anime = await storage.getAnime(id);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }

    res.json(anime);
  });

  api.post("/anime/:id/view", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const anime = await storage.getAnime(id);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }

    await storage.incrementViews(id);
    res.json({ success: true });
  });

  // Admin routes
  api.post("/admin/anime", requireAdmin, async (req, res) => {
    try {
      const animeData = insertAnimeSchema.parse(req.body);
      const newAnime = await storage.createAnime(animeData);
      res.status(201).json(newAnime);
    } catch (error) {
      res.status(400).json({ message: "Invalid anime data" });
    }
  });

  api.put("/admin/anime/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Partial validation
      const updateData = req.body;
      
      const updatedAnime = await storage.updateAnime(id, updateData);
      if (!updatedAnime) {
        return res.status(404).json({ message: "Anime not found" });
      }

      res.json(updatedAnime);
    } catch (error) {
      res.status(400).json({ message: "Invalid anime data" });
    }
  });

  api.delete("/admin/anime/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const success = await storage.deleteAnime(id);
    if (!success) {
      return res.status(404).json({ message: "Anime not found" });
    }

    res.json({ success: true });
  });

  // Mount API routes
  app.use("/api", api);

  const httpServer = createServer(app);
  return httpServer;
}
