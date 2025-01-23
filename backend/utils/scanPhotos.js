const fs = require("fs-extra");
const path = require("path");

const isImage = (file) => {
  const ext = path.extname(file).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
};

const scanPhotos = async (folderPath, options = {}) => {  
  const { page = 1, limit = 20 } = options;

  try {
    const absoluteFolderPath = path.resolve(folderPath);

    if (!(await fs.pathExists(absoluteFolderPath))) {
      throw new Error(`Folder not found: ${absoluteFolderPath}`);
    }

    const allFiles = await fs.readdir(absoluteFolderPath);
    const photos = [];

    // Photos
    for (const file of allFiles) {
      if (isImage(file)) {
        const filePath = path.join(absoluteFolderPath, file);
        const stats = await fs.stat(filePath);
        
        photos.push({
          name: file,
          url: `/uploads/${file}`,
          date: stats.mtime,
          size: stats.size,
          tag: null,
        });
      }
    }

    // Сортируем фото по дате
    photos.sort((a, b) => b.date - a.date);

    // Проверяем валидность параметров пагинации
    const validPage = Math.max(1, parseInt(page));
    const validLimit = Math.max(1, Math.min(parseInt(limit), 50));

    // Вычисляем индексы для пагинации
    const startIndex = (validPage - 1) * validLimit;
    const endIndex = Math.min(startIndex + validLimit, photos.length);

    // Получаем фотографии для текущей страницы
    const paginatedPhotos = photos.slice(startIndex, endIndex);

    // Проверяем, есть ли еще фотографии
    const hasMore = endIndex < photos.length;

    return {
      photos: paginatedPhotos,
      total: photos.length,
      page: validPage,
      limit: validLimit,
      hasMore,
      startIndex,
      endIndex
    };

  } catch (error) {
    console.error('Error in scanPhotos:', error);
    throw error;
  }
};

module.exports = scanPhotos;