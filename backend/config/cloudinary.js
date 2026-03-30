const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let upload;

if (isCloudinaryConfigured) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'govihanda/products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
    },
  });
  upload = multer({ storage });
} else {
  // Fallback: store locally in uploads/ during development
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

  upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
      const allowed = /jpg|jpeg|png|webp/i;
      if (allowed.test(path.extname(file.originalname))) return cb(null, true);
      cb(new Error('Only image files are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  });

  if (process.env.NODE_ENV !== 'test') {
    console.warn('[Cloudinary] Not configured — using local disk storage for uploads');
  }
}

module.exports = { cloudinary, upload };
