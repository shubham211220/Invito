const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const invitationRoutes = require('./modules/invitation/invitation.routes');
const invitationController = require('./modules/invitation/invitation.controller');
const rsvpRoutes = require('./modules/rsvp/rsvp.routes');
const upload = require('./middleware/upload');
const auth = require('./middleware/auth');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// ─── Security & Parsing ──────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting ────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

// ─── Static Files (uploads) ──────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '..', env.UPLOAD_DIR)));

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/rsvp', rsvpRoutes);

// Public invite route (no auth)
app.get('/api/invite/:slug', invitationController.getBySlug);

// File upload route
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 'No file uploaded.', 400);
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return ApiResponse.success(res, { imageUrl }, 'File uploaded successfully!');
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  ApiResponse.success(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found.`);
});

// ─── Error Handler ────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
