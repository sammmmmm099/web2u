import { 
  users, type User, type InsertUser,
  anime, type Anime, type InsertAnime
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Anime operations
  getAnime(id: number): Promise<Anime | undefined>;
  getAllAnime(): Promise<Anime[]>;
  getRecommendedAnime(): Promise<Anime[]>;
  getTrendingAnime(limit?: number): Promise<Anime[]>;
  getRecentlyAddedAnime(limit?: number): Promise<Anime[]>;
  searchAnime(query: string): Promise<Anime[]>;
  filterAnime(options: {
    genre?: string;
    language?: string;
    status?: string;
  }): Promise<Anime[]>;
  createAnime(animeData: InsertAnime): Promise<Anime>;
  updateAnime(id: number, animeData: Partial<InsertAnime>): Promise<Anime | undefined>;
  deleteAnime(id: number): Promise<boolean>;
  incrementViews(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private anime: Map<number, Anime>;
  private userCurrentId: number;
  private animeCurrentId: number;

  constructor() {
    this.users = new Map();
    this.anime = new Map();
    this.userCurrentId = 1;
    this.animeCurrentId = 1;
    
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true
    });
    
    // Seed some initial anime data
    this.seedAnimeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Anime operations
  async getAnime(id: number): Promise<Anime | undefined> {
    return this.anime.get(id);
  }

  async getAllAnime(): Promise<Anime[]> {
    return Array.from(this.anime.values());
  }

  async getRecommendedAnime(): Promise<Anime[]> {
    return Array.from(this.anime.values()).filter(
      (anime) => anime.isRecommended
    );
  }

  async getTrendingAnime(limit = 4): Promise<Anime[]> {
    return Array.from(this.anime.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  async getRecentlyAddedAnime(limit = 5): Promise<Anime[]> {
    return Array.from(this.anime.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async searchAnime(query: string): Promise<Anime[]> {
    const lowerCaseQuery = query.toLowerCase();
    return Array.from(this.anime.values()).filter(
      (anime) => anime.title.toLowerCase().includes(lowerCaseQuery)
    );
  }

  async filterAnime(options: {
    genre?: string;
    language?: string;
    status?: string;
  }): Promise<Anime[]> {
    let filteredAnime = Array.from(this.anime.values());
    
    if (options.genre) {
      filteredAnime = filteredAnime.filter(
        (anime) => anime.genres.includes(options.genre!)
      );
    }
    
    if (options.language) {
      filteredAnime = filteredAnime.filter(
        (anime) => options.language === "both" ? true : anime.language === options.language
      );
    }
    
    if (options.status) {
      filteredAnime = filteredAnime.filter(
        (anime) => anime.status === options.status
      );
    }
    
    return filteredAnime;
  }

  async createAnime(animeData: InsertAnime): Promise<Anime> {
    const id = this.animeCurrentId++;
    const now = new Date();
    const anime: Anime = { 
      ...animeData, 
      id, 
      views: 0, 
      createdAt: now 
    };
    this.anime.set(id, anime);
    return anime;
  }

  async updateAnime(id: number, animeData: Partial<InsertAnime>): Promise<Anime | undefined> {
    const existingAnime = this.anime.get(id);
    if (!existingAnime) {
      return undefined;
    }
    
    const updatedAnime: Anime = {
      ...existingAnime,
      ...animeData,
    };
    
    this.anime.set(id, updatedAnime);
    return updatedAnime;
  }

  async deleteAnime(id: number): Promise<boolean> {
    return this.anime.delete(id);
  }

  async incrementViews(id: number): Promise<void> {
    const existingAnime = this.anime.get(id);
    if (existingAnime) {
      existingAnime.views += 1;
      this.anime.set(id, existingAnime);
    }
  }

  private seedAnimeData(): void {
    const animeData: InsertAnime[] = [
      {
        title: "Demon Slayer",
        description: "A young boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon.",
        posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Fantasy"],
        episodes: 26,
        language: "sub",
        status: "ongoing",
        telegramUrl: "https://t.me/demonslayer",
        isRecommended: true,
      },
      {
        title: "My Hero Academia",
        description: "In a world where people with superpowers are the norm, a boy without powers dreams to become a superhero.",
        posterUrl: "https://images.unsplash.com/photo-1560972550-aba3456b5564?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Superhero"],
        episodes: 113,
        language: "dub",
        status: "ongoing",
        telegramUrl: "https://t.me/myhero",
        isRecommended: true,
      },
      {
        title: "Attack on Titan",
        description: "Humanity lives behind walls, protected from giant humanoid Titans that devour humans seemingly without reason.",
        posterUrl: "https://images.unsplash.com/photo-1541562232579-512a21360020?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Drama"],
        episodes: 87,
        language: "sub",
        status: "completed",
        telegramUrl: "https://t.me/attackontitan",
        isRecommended: true,
      },
      {
        title: "One Piece",
        description: "Monkey D. Luffy and his pirate crew explore the Grand Line in search of the world's ultimate treasure known as the \"One Piece\".",
        posterUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Adventure", "Fantasy"],
        episodes: 1064,
        language: "both",
        status: "ongoing",
        telegramUrl: "https://t.me/onepiece",
        isRecommended: true,
      },
      {
        title: "Jujutsu Kaisen",
        description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
        posterUrl: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Supernatural"],
        episodes: 24,
        language: "sub",
        status: "ongoing",
        telegramUrl: "https://t.me/jujutsukaisen",
        isRecommended: false,
      },
      {
        title: "Spy x Family",
        description: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep their true identities hidden from each other.",
        posterUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Comedy", "Action"],
        episodes: 25,
        language: "both",
        status: "ongoing",
        telegramUrl: "https://t.me/spyxfamily",
        isRecommended: false,
      },
      {
        title: "Tokyo Revengers",
        description: "A middle-aged loser travels back in time to his school days and must save his ex-girlfriend from being killed by a gang.",
        posterUrl: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Drama"],
        episodes: 24,
        language: "sub",
        status: "ongoing",
        telegramUrl: "https://t.me/tokyorevengers",
        isRecommended: false,
      },
      {
        title: "Chainsaw Man",
        description: "A young man desperate to clear his father's debt makes a contract with the Chainsaw Devil to become a devil hunter.",
        posterUrl: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Horror"],
        episodes: 12,
        language: "sub",
        status: "ongoing",
        telegramUrl: "https://t.me/chainsawman",
        isRecommended: false,
      },
      {
        title: "Bleach: Thousand-Year Blood War",
        description: "The peace is suddenly broken when warning sirens blare through the Soul Society. Residents are disappearing without a trace and nobody knows who's behind it.",
        posterUrl: "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Supernatural"],
        episodes: 13,
        language: "sub",
        status: "ongoing",
        telegramUrl: "https://t.me/bleach",
        isRecommended: false,
      },
      {
        title: "Blue Lock",
        description: "To revitalize Japan's football, a project named Blue Lock was created to recruit and gather 300 talented strikers from high schools all over Japan.",
        posterUrl: "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Sports", "Drama"],
        episodes: 24,
        language: "both",
        status: "ongoing",
        telegramUrl: "https://t.me/bluelock",
        isRecommended: false,
      },
      {
        title: "Oshi no Ko",
        description: "A doctor and a devoted fan of a pop idol ends up reincarnated as the idol's child, resulting in a dark tale of fame and the idol industry.",
        posterUrl: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Drama", "Supernatural"],
        episodes: 11,
        language: "sub",
        status: "ongoing",
        telegramUrl: "https://t.me/oshinoko",
        isRecommended: false,
      },
      {
        title: "Vinland Saga S2",
        description: "Thorfinn pursues a journey with his father's killer in order to take revenge and end his life in a duel.",
        posterUrl: "https://images.unsplash.com/photo-1580130732478-4e339fb6836f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Adventure", "Historical"],
        episodes: 24,
        language: "sub",
        status: "completed",
        telegramUrl: "https://t.me/vinlandsaga",
        isRecommended: false,
      },
      {
        title: "Dr. Stone: New World",
        description: "A scientist awakens thousands of years after humanity was petrified and starts rebuilding civilization from stone age.",
        posterUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Sci-Fi", "Adventure"],
        episodes: 11,
        language: "both",
        status: "ongoing",
        telegramUrl: "https://t.me/drstone",
        isRecommended: false,
      },
      {
        title: "One Punch Man",
        description: "The story of Saitama, a superhero who can defeat any opponent with a single punch but seeks a worthy opponent after growing bored by a lack of challenge.",
        posterUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Comedy"],
        episodes: 24,
        language: "both",
        status: "completed",
        telegramUrl: "https://t.me/onepunchman",
        isRecommended: false,
      },
      {
        title: "Naruto Shippuden",
        description: "Naruto Uzumaki returns after two and a half years of training and continues his quest to become the greatest ninja.",
        posterUrl: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=700",
        genres: ["Action", "Adventure"],
        episodes: 500,
        language: "both",
        status: "completed",
        telegramUrl: "https://t.me/narutoshippuden",
        isRecommended: false,
      },
    ];

    animeData.forEach((data, index) => {
      const now = new Date();
      now.setDate(now.getDate() - (15 - index) % 15); // Spread creation dates
      
      const anime: Anime = {
        ...data,
        id: this.animeCurrentId++,
        views: Math.floor(Math.random() * 1000), // Random view count for initial data
        createdAt: now,
      };
      
      this.anime.set(anime.id, anime);
    });
  }
}

export const storage = new MemStorage();
