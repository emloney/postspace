// server.js
require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const mysql         = require('mysql2');
const bcrypt        = require('bcrypt');
const jwt           = require('jsonwebtoken');
const cookieParser  = require('cookie-parser');
const morgan        = require('morgan');
const path          = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

//
// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
//
app.use(morgan('dev'));
// allow your Vite dev server
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//
// ─── MYSQL POOL ────────────────────────────────────────────────────────────────
//
const db = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }).promise();

  (async () => {
    try {
      await db.query('SELECT 1');        // ping
      console.log('✅ MySQL connected');
    } catch (err) {
      console.error('❌ DB connection failed:', err.message);
      process.exit(1);                   // stop the server
    }
  })();
  
//
// ─── AUTH HELPERS ─────────────────────────────────────────────────────────────
//
function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

//
// ─── ROUTES ────────────────────────────────────────────────────────────────────
//

// → Serve your React app or static HTML
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ✏️ REGISTER
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  // check duplicates
  const [exists] = await db.query(
    'SELECT 1 FROM users WHERE username=? OR email=?',
    [username, email]
  );
  if (exists.length) {
    return res
      .status(400)
      .json({ success: false, message: 'Username or email already in use' });
  }

  // hash + insert
  const hash = await bcrypt.hash(password, 10);
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
  await db.query(
    `INSERT INTO users (username, email, password, avatar)
     VALUES (?, ?, ?, ?)`,
    [username, email, hash,avatarUrl]
  );
  console.log('✅ New user row written for', username);


  res.json({ success: true, message: 'Registered!' });

});


// 🔐 LOGIN
app.post('/api/signin', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields required' });
    }
  
    // Look up by username
    const [rows] = await db.query(
      'SELECT id, username, password, avatar FROM users WHERE username = ?',
      [username]           // <-- pass username, not email
    );
    if (!rows.length) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }
  
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }
  
    // issue JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      })
      .json({
        success: true,
        message: 'Logged in',
        user: { id: user.id, username: user.username, avatar: user.avatar}  // removed undefined email
      });
  });
  

// 🚪 LOGOUT
app.post('/api/logout', (_req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out' });
});


// 📰 GET ALL POSTS
// after
app.get('/api/posts', async (_req, res) => {
  const [posts] = await db.query(`
    SELECT
      p.id,
      p.author_id,
      u.username,         -- grab the username
      p.title,
      p.body,
      p.created_at
    FROM posts p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `);
  res.json(posts);
});


// 📝 GET ONE POST + ITS COMMENTS + AUTHORS
app.get('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  const [[post]] = await db.query(
    `SELECT p.id, p.author_id, p.title, p.body, p.created_at,
            u.username, u.avatar
     FROM posts p
     JOIN users u ON p.author_id = u.id
     WHERE p.id = ?`,
    [postId]
  );
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const [comments] = await db.query(
    `SELECT c.id, c.content, c.created_at,
            u.id   AS author_id,
            u.username, u.avatar
     FROM comments c
     JOIN users u ON c.author_id = u.id
     WHERE c.post_id = ?
     ORDER BY c.created_at`,
    [postId]
  );

  post.comments = comments;
  res.json(post);
});


// ➕ ADD A NEW POST (protected)
app.post('/api/posts', requireAuth, async (req, res) => {
  const { title, body } = req.body;
  const authorId = req.userId;
  if (!title || !body) {
    return res.status(400).json({ error: 'Title & body required' });
  }

  // 1) Insert the post
  const [result] = await db.query(
    `INSERT INTO posts (author_id, title, body)
     VALUES (?, ?, ?)`,
    [authorId, title, body]
  );
  const newPostId = result.insertId;

  // 2) Query back including the username
  const [[newPost]] = await db.query(
    `SELECT p.id,
            p.author_id,
            u.username,
            p.title,
            p.body,
            p.created_at
     FROM posts p
     JOIN users u ON p.author_id = u.id
     WHERE p.id = ?`,
    [newPostId]
  );

  // 3) Return that enriched object
  return res.status(201).json(newPost);
});



// 💬 ADD A COMMENT TO A POST (protected)
app.post('/api/posts/:id/comments', requireAuth, async (req, res) => {
  const postId   = req.params.id;
  const authorId = req.userId;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content required' });
  }

  const [result] = await db.query(
    `INSERT INTO comments (post_id, author_id, content)
     VALUES (?, ?, ?)`,
    [postId, authorId, content]
  );

  res.status(201).json({
    id: result.insertId,
    post_id: postId,
    author_id: authorId,
    content,
  });
});

// ─── DB CHECK ROUTE ─────────────────────────────────────────────────────────
app.get('/api/db-check', async (_req, res) => {
    try {
      await db.query('SELECT NOW()');
      return res.json({ ok: true, now: new Date().toISOString() });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  });
  
// server.js
app.get('/api/me', requireAuth, async (req, res) => {
    const [[me]] = await db.query(
      `
        SELECT
          id,
          username,
          avatar,
          display_name    AS displayName,
          joined_at       AS joinedAt
        FROM users
        WHERE id = ?
      `,
      [req.userId]
    );
  
    if (!me) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    return res.json({ success: true, user: me });
  });
  
// ────────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
