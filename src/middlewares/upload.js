const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "../upload-pic");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create directory and subdirectories if needed
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const { id } = req.user; // Ensure `req.user` is populated properly
    const fullFilename = `${id}_${Date.now()}_${Math.round(
      Math.random() * 1000
    )}${path.extname(file.originalname)}`;
    cb(null, fullFilename);
  },
});

module.exports = multer({ storage });
