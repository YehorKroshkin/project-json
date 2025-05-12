import express from 'express';
import fs from 'fs';
import path from 'path';

// Создаем приложение Express
const app = express();
app.set("port", 3000);

// Путь к файлу artists.json
const artistsFilePath = path.join('data', 'artists.json');
const labelsFilePath = path.join('data', 'labels.json');

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
const readLabelsData = () => {
  try {
    const dataLab = fs.readFileSync(labelsFilePath, 'utf-8');
    return JSON.parse(dataLab);  // Преобразуем JSON в JavaScript-объект
  } catch (err) {
    console.error('Ошибка чтения данных:', err);
    return [];  // Если произошла ошибка, возвращаем пустой массив
  }
};

// Массив данных артистов (читаем из файла)
let artists = readArtistsData();
let labels = readLabelsData();
// Устанавливаем папку с изображениями
app.use(express.static('public'));

// Устанавливаем шаблонизатор EJS
app.set('view engine', 'ejs');

// Роут для отображения всех артистов
app.get('/', (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  const sortBy = req.query.sortBy || '';
  const order = req.query.order === 'desc' ? 'desc' : 'asc';

  let filteredArtists = artists;

  // Поиск
  if (search) {
    filteredArtists = filteredArtists.filter(artist =>
      artist.name.toLowerCase().includes(search)
    );
  }

  // Сортировка
  if (sortBy) {
    filteredArtists.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Для строк сортировка по localeCompare
      if (typeof valA === 'string' && typeof valB === 'string') {
        return order === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Для чисел (например, age)
      if (typeof valA === 'number' && typeof valB === 'number') {
        return order === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }

  res.render('index', { artists: filteredArtists, search, sortBy, order });
});


app.get('/labels', (req, res) => {
  res.render('labels', { labels });
  console.log(labels);
});

// Роут для страницы конкретного артиста
app.get('/artist/:id', (req, res) => {
  console.log(`Requesting artist with ID: ${req.params.id}`);
  const artist = artists.find(a => a.id === req.params.id);
  if (!artist) {
    return res.status(404).send('Artist not found');
  }
  res.render('artist-detail', { artist });
});

app.get('/labels/:id', (req, res) => {
  const labels = JSON.parse(fs.readFileSync('data/labels.json', 'utf-8'));
  const label = labels.find(l => l.id === req.params.id);
  
  if (label) {
    res.render('labels-detail', { label });
  } else {
    res.status(404).send('Label not found');
  }
});

// Запуск сервера
app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);

