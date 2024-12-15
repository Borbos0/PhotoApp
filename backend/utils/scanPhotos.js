const fs = require("fs-extra");
const path = require("path");

const isImage = (file) => {
  const ext = path.extname(file).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif"].includes(ext);
};

const scanPhotos = async (folderPath) => {  
  const absoluteFolderPath = path.resolve(folderPath);

  if (!(await fs.pathExists(absoluteFolderPath))) {
    console.error(`Folder does not exist: ${absoluteFolderPath}`);
    throw new Error(`Folder not found: ${absoluteFolderPath}`);
  }

  const photos = [];
  const files = await fs.readdir(absoluteFolderPath); // Получаем файлы из папки
  console.log(`Found files: ${files.join(", ")}`); // logging files

  for (const file of files) {
    const filePath = path.join(absoluteFolderPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      const nestedPhotos = await scanPhotos(path.join(folderPath, file));
      photos.push(...nestedPhotos);
    } else if (isImage(file)) {
      console.log(`Adding image: ${file}`); // logging img
      photos.push({
        name: file,
        url: `/uploads/${file}`,
        tag: null,
        date: null,
      });
    }
  }

  return photos;
};

module.exports = scanPhotos;
