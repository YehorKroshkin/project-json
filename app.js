import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.set("port", 3000);

const artistsFilePath = path.join('data', 'artists.json');
const labelsFilePath = path.join('data', 'labels.json');

const readArtistsData = () => {
  try {
    const data = fs.readFileSync(artistsFilePath, 'utf-8');
    return JSON.parse(data);  
  } catch (err) {
    console.error('Ошибка чтения данных:', err);
    return [];  
  }
};
const readLabelsData = () => {
  try {
    const dataLab = fs.readFileSync(labelsFilePath, 'utf-8');
    return JSON.parse(dataLab);  
  } catch (err) {
    console.error('Ошибка чтения данных:', err);
    return [];  
  }
};


let artists = readArtistsData();
let labels = readLabelsData();

app.use(express.static('public'));


app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  const search = req.query.search?.toLowerCase() || '';
  const sortBy = req.query.sortBy || '';
  const order = req.query.order === 'desc' ? 'desc' : 'asc';

  let filteredArtists = artists;


  if (search) {
    filteredArtists = filteredArtists.filter(artist =>
      artist.name.toLowerCase().includes(search)
    );
  }


  if (sortBy) {
    filteredArtists.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];


      if (typeof valA === 'string' && typeof valB === 'string') {
        return order === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }


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


app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);

