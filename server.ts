import express from "express";
import { createServer as createViteServer } from "vite";
import { createRequire } from "module";
import path from "path";
import { z } from "zod";

const _require = createRequire(import.meta.url);

// --- Storage Abstraction ---
interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  author_id: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface StorageAdapter {
  getPosts(filterStatus?: string): Post[];
  createPost(post: Post): void;
  updatePost(id: string, fields: Record<string, unknown>): void;
  deletePost(id: string): void;
}

// --- Schema Definitions ---
const PostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  slug: z.string().min(1),
  author_id: z.string().uuid().optional().or(z.string()),
  status: z.enum(["draft", "published"]),
  published_at: z.string().datetime().nullable().optional(),
});

const UpdatePostSchema = PostSchema.partial();

// --- SQLite Adapter ---
// DatabaseCtor is typed as `any` because better-sqlite3 is an optional
// dependency that may not be installed; importing its types statically would
// fail TypeScript compilation when the package is absent.
function createSqliteAdapter(DatabaseCtor: any): StorageAdapter {
  const db = new DatabaseCtor("database.sqlite");

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      author_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'published')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      published_at DATETIME
    );
  `);

  return {
    getPosts(filterStatus) {
      let query = "SELECT * FROM posts";
      const params: unknown[] = [];
      if (filterStatus === "published") {
        query += " WHERE status = ?";
        params.push("published");
      }
      query += " ORDER BY created_at DESC";
      return db.prepare(query).all(...params) as Post[];
    },
    createPost(post) {
      db.prepare(`
        INSERT INTO posts (id, title, content, slug, author_id, status, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        post.id, post.title, post.content, post.slug,
        post.author_id, post.status, post.published_at
      );
    },
    updatePost(id, fields) {
      const fieldKeys = Object.keys(fields);
      if (fieldKeys.length === 0) return;
      const setClauses = fieldKeys.map(k => `${k} = ?`).join(", ");
      const values = Object.values(fields);
      db.prepare(`
        UPDATE posts
        SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(...values, id);
    },
    deletePost(id) {
      db.prepare("DELETE FROM posts WHERE id = ?").run(id);
    },
  };
}

// --- In-Memory Adapter (fallback for environments without native SQLite) ---
function createInMemoryAdapter(): StorageAdapter {
  const posts: Post[] = [];
  return {
    getPosts(filterStatus) {
      if (filterStatus === "published") {
        return posts.filter(p => p.status === "published");
      }
      return [...posts];
    },
    createPost(post) {
      posts.push(post);
    },
    updatePost(id, fields) {
      const post = posts.find(p => p.id === id);
      if (post) Object.assign(post, fields, { updated_at: new Date().toISOString() });
    },
    deletePost(id) {
      const idx = posts.findIndex(p => p.id === id);
      if (idx !== -1) posts.splice(idx, 1);
    },
  };
}

// --- Simple in-process rate limiter (avoids external dependency) ---
function createRateLimiter(maxRequests: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > maxRequests) {
      return res.status(429).json({ error: "RATE_LIMIT_EXCEEDED" });
    }
    next();
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize storage adapter — prefer SQLite, fall back to in-memory
  let store: StorageAdapter;
  try {
    const Database = _require("better-sqlite3");
    store = createSqliteAdapter(Database);
  } catch {
    console.warn(
      "\n[SAVANT] ⚠  WARNING: better-sqlite3 is unavailable (native build failed or not installed)." +
      "\n[SAVANT]    Running with in-memory storage — DB-backed features are disabled." +
      "\n[SAVANT]    UI preview is fully functional. See ANDROID_DEV.md for setup details.\n"
    );
    store = createInMemoryAdapter();
  }

  app.use(express.json());

  // Advanced Logging Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  const apiRouter = express.Router();

  // Health check
  apiRouter.get("/ping", (req, res) => {
    res.json({
      status: "pong",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes
  apiRouter.get("/posts", (req, res) => {
    try {
      const posts = store.getPosts(req.query.status as string | undefined);
      res.json(posts);
    } catch (error) {
      console.error("DB_FETCH_ERROR:", error);
      res.status(500).json({ error: "INTERNAL_LATTICE_ERROR" });
    }
  });

  apiRouter.post("/posts", (req, res) => {
    try {
      const validated = PostSchema.parse(req.body);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      store.createPost({
        id,
        title: validated.title,
        content: validated.content,
        slug: validated.slug,
        author_id: validated.author_id || "system",
        status: validated.status,
        created_at: now,
        updated_at: now,
        published_at: validated.published_at ?? null,
      });
      res.status(201).json({ id, ...validated });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "VALIDATION_FAILED", details: error.issues });
      }
      console.error("DB_INSERT_ERROR:", error);
      res.status(500).json({ error: "INTERNAL_LATTICE_ERROR" });
    }
  });

  apiRouter.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    try {
      const validated = UpdatePostSchema.parse(req.body);
      store.updatePost(id, validated as Record<string, unknown>);
      res.json({ success: true, id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "VALIDATION_FAILED", details: error.issues });
      }
      console.error("DB_UPDATE_ERROR:", error);
      res.status(500).json({ error: "INTERNAL_LATTICE_ERROR" });
    }
  });

  apiRouter.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    try {
      store.deletePost(id);
      res.json({ success: true, message: "NODE_TERMINATED" });
    } catch (error) {
      console.error("DB_DELETE_ERROR:", error);
      res.status(500).json({ error: "INTERNAL_LATTICE_ERROR" });
    }
  });

  // Extraction API — rate-limited to prevent abuse of file-system operations
  apiRouter.post("/extract", createRateLimiter(5, 60_000), async (req, res) => {
    try {
      const { SavantExtractor } = await import("./src/utils/ext.js");
      const extractor = new SavantExtractor();
      await extractor.execute({
        scope: ["src/**", "server.ts", "package.json", "tsconfig.json", "vite.config.ts"],
        outputFile: "./archive/savant_source_dump.txt",
        githubRepo: process.env.GITHUB_REPO || "",
        s3Bucket: process.env.AWS_S3_BUCKET || "",
        s3Key: `archives/savant_dump_${Date.now()}.txt`,
      });
      res.json({ success: true, message: "EXTRACTION_COMPLETE" });
    } catch (error) {
      console.error("EXTRACTION_ERROR:", error);
      res.status(500).json({ error: "EXTRACTION_FAILURE", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.use("/api", apiRouter);

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === "production";
  const distPath = path.join(process.cwd(), "dist");

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SAVANT_SERVER_ACTIVE :: PORT_${PORT}`);
  });
}

startServer();

