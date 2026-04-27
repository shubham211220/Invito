const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const env = require('./config/env');
const cloudinary = require('./config/cloudinary');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const invitationRoutes = require('./modules/invitation/invitation.routes');
const invitationController = require('./modules/invitation/invitation.controller');
const rsvpRoutes = require('./modules/rsvp/rsvp.routes');
const userRoutes = require('./modules/user/user.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const upload = require('./middleware/upload');
const auth = require('./middleware/auth');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// ─── Security & Parsing ──────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Strip trailing slashes for comparison
    const cleanOrigin = origin.replace(/\/+$/, '');

    // Support comma-separated CLIENT_URL for multiple origins
    const allowedOrigins = env.CLIENT_URL.split(',').map(o => o.trim().replace(/\/+$/, ''));
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Also allow any Vercel preview deployment URLs
    if (cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
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
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Public invite route (no auth)
app.get('/api/invite/:slug', invitationController.getBySlug);

// File upload route
app.post('/api/upload-image', auth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return ApiResponse.error(res, 'No file uploaded.', 400);
  }
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'invito',
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    
    return ApiResponse.success(res, { imageUrl: result.secure_url }, 'Image uploaded successfully!');
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return ApiResponse.error(res, 'Image upload failed. Please try again.', 500);
  }
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
// Triggering nodemon restart to load .env variables
