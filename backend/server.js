const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const scanPhotos = require("./utils/scanPhotos");

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

  try {
    const photos = await scanPhotos(folderPath);
    res.json(photos);
  } catch (err) {
    console.error("Error reading photos:", err.message);
    res.status(500).send("Error reading photos");
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
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
    }
    res.send({ message: "Files deleted successfully!" });
  } catch (err) {
    console.error("Error deleting files:", err.message);
    res.status(500).send("Error deleting files");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
