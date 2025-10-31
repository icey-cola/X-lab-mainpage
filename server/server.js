import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const MEMBERS_PATH = path.join(DATA_DIR, 'members.json');
const PUBLICATIONS_PATH = path.join(DATA_DIR, 'publications.json');
const SLIDES_PATH = path.join(DATA_DIR, 'hero_slides.json');
const TECH_PATH = path.join(DATA_DIR, 'key_tech.json');

const app = express();

app.use(cors());
app.use(express.json());

const writeJson = async (filepath, data) => {
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
};

const readJson = async (filepath) => {
  try {
    const file = await fs.readFile(filepath, 'utf-8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJson(filepath, []);
      return [];
    }
    throw error;
  }
};

const ensureDataSetup = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const map = [
    { path: MEMBERS_PATH, initial: [] },
    { path: PUBLICATIONS_PATH, initial: [] },
    { path: SLIDES_PATH, initial: [] },
    { path: TECH_PATH, initial: [] }
  ];
  for (const entry of map) {
    try {
      await fs.access(entry.path);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await writeJson(entry.path, entry.initial);
      } else {
        throw error;
      }
    }
  }
};

// Members API
app.get('/api/members', async (_, res) => {
  const members = await readJson(MEMBERS_PATH);
  res.json(members);
});

app.post('/api/members', async (req, res) => {
  const members = await readJson(MEMBERS_PATH);
  const newMember = {
    id: `m-${Date.now()}`,
    ...req.body,
  };
  members.push(newMember);
  await writeJson(MEMBERS_PATH, members);
  res.status(201).json(newMember);
});

app.put('/api/members/:id', async (req, res) => {
  const members = await readJson(MEMBERS_PATH);
  const idx = members.findIndex((member) => member.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Member not found' });
  }
  members[idx] = { ...members[idx], ...req.body };
  await writeJson(MEMBERS_PATH, members);
  res.json(members[idx]);
});

app.delete('/api/members/:id', async (req, res) => {
  const members = await readJson(MEMBERS_PATH);
  const filtered = members.filter((member) => member.id !== req.params.id);
  if (filtered.length === members.length) {
    return res.status(404).json({ message: 'Member not found' });
  }
  await writeJson(MEMBERS_PATH, filtered);
  res.status(204).end();
});

// Publications API
app.get('/api/publications', async (_, res) => {
  const publications = await readJson(PUBLICATIONS_PATH);
  res.json(publications);
});

app.post('/api/publications', async (req, res) => {
  const publications = await readJson(PUBLICATIONS_PATH);
  const newPub = {
    id: `p-${Date.now()}`,
    ...req.body,
  };
  publications.push(newPub);
  await writeJson(PUBLICATIONS_PATH, publications);
  res.status(201).json(newPub);
});

app.put('/api/publications/:id', async (req, res) => {
  const publications = await readJson(PUBLICATIONS_PATH);
  const idx = publications.findIndex((pub) => pub.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Publication not found' });
  }
  publications[idx] = { ...publications[idx], ...req.body };
  await writeJson(PUBLICATIONS_PATH, publications);
  res.json(publications[idx]);
});

app.delete('/api/publications/:id', async (req, res) => {
  const publications = await readJson(PUBLICATIONS_PATH);
  const filtered = publications.filter((pub) => pub.id !== req.params.id);
  if (filtered.length === publications.length) {
    return res.status(404).json({ message: 'Publication not found' });
  }
  await writeJson(PUBLICATIONS_PATH, filtered);
  res.status(204).end();
});

// Hero slides API
app.get('/api/slides', async (_, res) => {
  const slides = await readJson(SLIDES_PATH);
  res.json(slides);
});

app.get('/api/slides/:id', async (req, res) => {
  const slides = await readJson(SLIDES_PATH);
  const slide = slides.find((item) => item.id === req.params.id);
  if (!slide) {
    return res.status(404).json({ message: 'Slide not found' });
  }
  res.json(slide);
});

app.post('/api/slides', async (req, res) => {
  const slides = await readJson(SLIDES_PATH);
  const newSlide = {
    id: `s-${Date.now()}`,
    ...req.body,
  };
  slides.push(newSlide);
  await writeJson(SLIDES_PATH, slides);
  res.status(201).json(newSlide);
});

app.put('/api/slides/:id', async (req, res) => {
  const slides = await readJson(SLIDES_PATH);
  const idx = slides.findIndex((slide) => slide.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Slide not found' });
  }
  slides[idx] = { ...slides[idx], ...req.body };
  await writeJson(SLIDES_PATH, slides);
  res.json(slides[idx]);
});

app.delete('/api/slides/:id', async (req, res) => {
  const slides = await readJson(SLIDES_PATH);
  const filtered = slides.filter((slide) => slide.id !== req.params.id);
  if (filtered.length === slides.length) {
    return res.status(404).json({ message: 'Slide not found' });
  }
  await writeJson(SLIDES_PATH, filtered);
  res.status(204).end();
});

// Key technologies API
app.get('/api/key-tech', async (_, res) => {
  const tech = await readJson(TECH_PATH);
  res.json(tech);
});

app.get('/api/key-tech/:id', async (req, res) => {
  const tech = await readJson(TECH_PATH);
  const item = tech.find((entry) => entry.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Tech item not found' });
  }
  res.json(item);
});

app.post('/api/key-tech', async (req, res) => {
  const tech = await readJson(TECH_PATH);
  const newItem = {
    id: `t-${Date.now()}`,
    ...req.body,
  };
  tech.push(newItem);
  await writeJson(TECH_PATH, tech);
  res.status(201).json(newItem);
});

app.put('/api/key-tech/:id', async (req, res) => {
  const tech = await readJson(TECH_PATH);
  const idx = tech.findIndex((item) => item.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Tech item not found' });
  }
  tech[idx] = { ...tech[idx], ...req.body };
  await writeJson(TECH_PATH, tech);
  res.json(tech[idx]);
});

app.delete('/api/key-tech/:id', async (req, res) => {
  const tech = await readJson(TECH_PATH);
  const filtered = tech.filter((item) => item.id !== req.params.id);
  if (filtered.length === tech.length) {
    return res.status(404).json({ message: 'Tech item not found' });
  }
  await writeJson(TECH_PATH, filtered);
  res.status(204).end();
});

app.use(express.static(path.join(ROOT_DIR, 'public')));

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await ensureDataSetup();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
})();
