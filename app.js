import express from 'express';
import fs from 'fs';
import path from 'path';

// Создаем приложение Express
const app = express();
app.set("port", 3000);
// Путь к файлу artists.json
const artistsFilePath = path.join('data', 'artists.json');

// Функция для чтения данных из файла
const readArtistsData = () => {
  try {
    const data = fs.readFileSync(artistsFilePath, 'utf-8');
    return JSON.parse(data);  // Преобразуем JSON в JavaScript-объект
  } catch (err) {
    console.error('Ошибка чтения данных:', err);
    return [];  // Если произошла ошибка, возвращаем пустой массив
  }
};

// Массив данных артистов (читаем из файла)
let artists = readArtistsData();

// Устанавливаем папку с изображениями
app.use(express.static('public'));

// Роут для отображения всех артистов
app.get('/', (req, res) => {
  res.render('index', { artists });
});

// Роут для страницы конкретного артиста
app.get('/artist/:id', (req, res) => {
  const artist = artists.find(a => a.id === req.params.id);
  if (!artist) {
    return res.status(404).send('Artist not found');
  }
  res.render('artist', { artist });
});

// Роут для обновления данных артистов
app.post('/update-artists', express.json(), (req, res) => {
  // Обновляем данные артистов на основе отправленных данных
  artists = req.body;

  // Записываем обновленные данные обратно в файл
  fs.writeFileSync(artistsFilePath, JSON.stringify(artists, null, 2), 'utf-8');
  
  res.send('Artists updated successfully');
});

// Устанавливаем шаблонизатор EJS
app.set('view engine', 'ejs');

// Запуск сервера
app.listen(app.get("port"), () =>
    console.log("[server] http://localhost:" + app.get("port"))
  );

