const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('node:path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const bidRoutes = require('./routes/bidRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const providerRoutes = require('./routes/providerRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const marketInfoRoutes = require('./routes/marketInfoRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

const allowedOrigins = Array.from(
  new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.CLIENT_URL,
    ...(process.env.CLIENT_URLS || '')
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean),
  ].filter(Boolean))
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow curl / Postman / mobile
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/market-info', marketInfoRoutes);

// Serve local uploads in development (Cloudinary handles this in production)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'GoviHanda API' }));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
