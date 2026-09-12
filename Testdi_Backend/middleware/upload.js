const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
const characterDir = path.join(uploadDir, 'characters');

[uploadDir, characterDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Multer storage config for character images
 * Files saved to: uploads/characters/<characterId>-<type>-<timestamp>.<ext>
 */
const characterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, characterDir);
  },
  filename: (req, file, cb) => {
    const characterId = req.params.id || 'unknown';
    const type = req.params.imageType || 'base'; // 'base' or 'unlocked'
    const ext = path.extname(file.originalname) || '.png';
    const filename = `${characterId}-${type}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

/**
 * File filter: only accept images
 */
function imageFilter(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed'), false);
  }
}

/**
 * Upload middleware for single character image
 * Usage: uploadCharacterImage (then access req.file)
 */
const uploadCharacterImage = multer({
  storage: characterStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: imageFilter,
}).single('image');

/**
 * Helper: Delete old image file when replacing
 */
function deleteOldImage(imageUrl) {
  if (!imageUrl) return;

  // Extract filename from URL path (e.g., /uploads/characters/abc-base-123.png)
  const filename = path.basename(imageUrl);
  const filePath = path.join(characterDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Helper: Build the public URL for an uploaded file
 */
function getImageUrl(filename) {
  return `/uploads/characters/${filename}`;
}

module.exports = {
  uploadCharacterImage,
  deleteOldImage,
  getImageUrl,
  characterDir,
};
