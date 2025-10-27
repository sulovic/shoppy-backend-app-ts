const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs/promises");
const checkUserRole = require("../utils/middleware/checkUserRole");
const multer = require("multer");
const uploadFolder = path.resolve(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const sanitizedUrl = req.url.replace(/\.\.\//g, "");
    const uploadPath = path.join(__dirname, "..", "uploads", sanitizedUrl);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9-.]/g, "");
    cb(null, sanitizedFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },

  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|odt|ods|mp4/; // Allowed file types
    const allowedMIMETypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.oasis.opendocument.spreadsheet",
      "video/mp4",
    ]; // Allowed MIME types

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMIMETypes.includes(file.mimetype.toLowerCase());

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("File type not allowed"));
    }
  },
});

router.get("/:filename*", checkUserRole((minRole = 1000)), express.static(uploadFolder), (err, req, res, next) => {
  if (err && err.code === "ENOENT") {
    res.status(404).json({ error: "File not found" });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/*", checkUserRole((minRole = 1000)), upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const files = req.files;
    const filePaths = {};

    for (const file of files) {
      const finalFilePath = path.join(req.url.replace(/\.\.\//g, ""), file.filename);
      filePaths[file.originalname] = finalFilePath; // Store the file path
    }
    res.status(200).json({ filePaths });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/*", checkUserRole((minRole = 3000)), async (req, res) => {
  try {
    const filenames = req?.body?.files;
    const sanitizedFilenames = filenames.map((filename) => path.basename(filename));
    const directoryPath = path.resolve(__dirname, "..", "uploads", req?.params[0]);

    // Delete files
    for (const filename of sanitizedFilenames) {
      const filePath = path.resolve(directoryPath, filename);

      // Throws an error if the file doesn't exist
      await fs.access(filePath);
      // Delete the file
      await fs.unlink(filePath);
    }

    res.status(200).json({ message: "Files deleted successfully" });
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(404).json({ message: "File not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = router;
