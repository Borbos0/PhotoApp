const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const scanPhotos = require("./utils/scanPhotos");
const archiver = require("archiver");

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const usersFilePath = path.join(__dirname, "data", "users.json");

fs.ensureFileSync(usersFilePath);
if (!fs.existsSync(usersFilePath)) {
  fs.writeJsonSync(usersFilePath, []);
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    const users = await fs.readJson(usersFilePath);

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      return res.json({ message: "Login successful", token: "mock-token" });
    } else {
      return res.status(401).send("Invalid username or password.");
    }
  } catch (err) {
    console.error("Error reading users:", err.message);
    res.status(500).send("Server error.");
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required.");
  }

  try {
    const users = await fs.readJson(usersFilePath);

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    const newUser = { username, password };
    users.push(newUser);

    await fs.writeJson(usersFilePath, users);

    res.status(201).send("User registered successfully.");
  } catch (err) {
    console.error("Error saving user:", err.message);
    res.status(500).send("Server error.");
  }
});

app.post("/api/upload", upload.array("photos", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const fileUrls = req.files.map((file) => ({
    message: "File uploaded successfully!",
    url: `/uploads/${file.filename}`,
  }));

  res.send(fileUrls);
});

app.get("/api/photos", async (req, res) => {
  const folderPath = path.join(__dirname, "uploads");
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20
  };

  try {
    const result = await scanPhotos(folderPath, options);
    res.json(result);
  } catch (err) {
    console.error("Error reading photos:", err.message);
    res.status(500).json({ 
      error: "Error reading photos",
      message: err.message 
    });
  }
});

app.post("/api/delete", async (req, res) => {
  const { files } = req.body;

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).send("No files specified for deletion.");
  }

  try {
    for (const file of files) {
      const filePath = path.join(__dirname, "uploads", file);
      console.log('Attempting to delete:', filePath);

      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        console.log('Successfully deleted:', filePath);
      } else {
        console.log('File not found:', filePath);
      }
    }
    
    res.json({ 
      message: "Files deleted successfully!",
      deletedFiles: files
    });
  } catch (err) {
    console.error("Error deleting files:", err.message);
    res.status(500).json({ 
      error: "Error deleting files",
      message: err.message 
    });
  }
});

app.get("/api/archive", async (req, res) => {
  const uploadsDir = path.join(__dirname, "uploads");
  const archivePath = path.join(uploadsDir, "archive.zip");

  try {
    const files = await fs.readdir(uploadsDir);
    if (files.length === 0) {
      return res.status(400).json({ error: "No files to archive" });
    }

    const output = fs.createWriteStream(archivePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      res.json({ url: `/uploads/archive.zip` });
    });

    archive.on("error", (err) => res.status(500).json({ error: err.message }));

    archive.pipe(output);
    
    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      if (file !== "archive.zip") {
        archive.file(filePath, { name: file });
      }
    });

    await archive.finalize();
  } catch (err) {
    console.error("Error creating archive:", err.message);
    res.status(500).json({ error: "Error creating archive", message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
