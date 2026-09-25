const defaultLibrary = [
  {
    id: 1,
    title: 'Naruto Shippuden',
    type: 'Anime',
    year: 2007,
    quality: 'FHD',
    rating: 4.9,
    description: 'L’aventure épique d’un ninja déterminé à protéger ses amis et son village.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    videoPlatform: 'direct',
    episodes: [{ title: 'Épisode 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }]
  },
  {
    id: 2,
    title: 'One Piece',
    type: 'Anime',
    year: 2023,
    quality: '4K',
    rating: 4.8,
    description: 'Dans un monde de pirates, un rêve immense se déploie sur les mers.',
    poster: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    videoPlatform: 'direct',
    episodes: [{ title: 'Épisode 1', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' }]
  },
  {
    id: 3,
    title: 'The Matrix',
    type: 'Film',
    year: 1999,
    quality: '4K',
    rating: 4.9,
    description: 'Un hacker découvre la vérité sur une réalité simulée et la guerre qui la menace.',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    videoPlatform: 'direct',
    episodes: []
  },
  {
    id: 4,
    title: 'Dark',
    type: 'Série',
    year: 2017,
    quality: 'FHD',
    rating: 4.7,
    description: 'Une série intrigante entre passé, avenir et mystères qui se croisent.',
    poster: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    videoPlatform: 'direct',
    episodes: [{ title: 'Épisode 1', url: 'https://www.w3schools.com/html/movie.mp4' }]
  }
];

const STORAGE_KEY = 'streamFreeStudioLibrary';
let library = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultLibrary;
let activeCategory = 'Tous';
let episodeDraft = [];
let selectedContent = library[0] || defaultLibrary[0];

const catalog = document.getElementById('catalog');
const filters = document.getElementById('filters');
const searchInput = document.getElementById('searchInput');
const studioForm = document.getElementById('studioForm');
const studioEntries = document.getElementById('studioEntries');
const playerContainer = document.getElementById('playerContainer');
const episodeSelector = document.getElementById('episodeSelector');
const playFeaturedBtn = document.getElementById('playFeaturedBtn');
const moreInfoBtn = document.getElementById('moreInfoBtn');
const episodeList = document.getElementById('episodeList');
const addEpisodeBtn = document.getElementById('addEpisodeBtn');
const episodeTitleInput = document.getElementById('episodeTitle');
const episodeFileInput = document.getElementById('episodeFile');

const categories = ['Tous', ...new Set(library.map((item) => item.type))];

function saveLibrary() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
}

function ensureVideoSource(item) {
  if (item.videoPlatform === 'direct' || item.videoPlatform === 'local') {
    return { type: 'video', src: item.videoUrl };
  }

  return { type: 'iframe', src: item.videoUrl };
}

function renderEpisodeSelector(item) {
  const list = item.episodes && item.episodes.length ? item.episodes : [];
  episodeSelector.innerHTML = '';

  if (!list.length) {
    return;
  }

  list.forEach((episode, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = episode.title || `Épisode ${index + 1}`;
    button.addEventListener('click', () => {
      selectedContent = item;
      const nextItem = { ...item, videoUrl: episode.url || item.videoUrl };
      renderPlayer(nextItem);
    });
    episodeSelector.appendChild(button);
  });
}

function renderPlayer(item) {
  selectedContent = item;
  const source = ensureVideoSource(item);

  if (source.type === 'video') {
    playerContainer.innerHTML = `
      <video controls autoplay playsinline poster="${item.poster}" preload="metadata">
        <source src="${source.src}" type="video/mp4" />
      </video>
    `;
    renderEpisodeSelector(item);
    return;
  }

  playerContainer.innerHTML = `
    <iframe
      src="${source.src}"
      title="${item.title}"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  `;
  renderEpisodeSelector(item);
}

function renderFilters() {
  filters.innerHTML = '';
  const categoryOptions = ['Tous', ...new Set(library.map((item) => item.type))];

  categoryOptions.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter-btn ${category === activeCategory ? 'active' : ''}`;
    button.textContent = category;
    button.addEventListener('click', () => {
      activeCategory = category;
      renderFilters();
      renderCatalog();
    });
    filters.appendChild(button);
  });
}

function renderCatalog() {
  const searchValue = searchInput.value.toLowerCase().trim();

  const filtered = library.filter((item) => {
    const matchesCategory = activeCategory === 'Tous' || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchValue);
    return matchesCategory && matchesSearch;
  });

  catalog.innerHTML = '';

  if (!filtered.length) {
    catalog.innerHTML = '<div class="empty-state"><p>Aucun résultat dans ce catalogue.</p></div>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-poster" style="background-image: url('${item.poster}')">
        <span class="card-badge">${item.quality}</span>
      </div>
      <div class="card-body">
        <div class="meta">
          <span>${item.year}</span>
          <span>${item.type}</span>
        </div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="card-footer">
          <span class="tag">${item.type}</span>
          <span class="rating">★ ${item.rating || '4.8'}</span>
          <button class="play-btn" type="button" aria-label="Lecture de ${item.title}">▶</button>
        </div>
      </div>
    `;

    const playButton = card.querySelector('.play-btn');
    playButton.addEventListener('click', () => {
      renderPlayer(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    card.addEventListener('dblclick', () => {
      renderPlayer(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    catalog.appendChild(card);
  });
}

function renderEpisodeList() {
  episodeList.innerHTML = '';

  if (!episodeDraft.length) {
    episodeList.innerHTML = '<li class="episode-empty">Aucun épisode ajouté pour le moment.</li>';
    return;
  }

  episodeDraft.forEach((episode, index) => {
    const item = document.createElement('li');
    item.className = 'episode-item';
    item.innerHTML = `
      <span>${episode.title}</span>
      <button type="button" data-index="${index}">Supprimer</button>
    `;

    const button = item.querySelector('button');
    button.addEventListener('click', () => {
      episodeDraft.splice(index, 1);
      renderEpisodeList();
    });

    episodeList.appendChild(item);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleEpisodeAdd() {
  const title = episodeTitleInput.value.trim();
  const file = episodeFileInput.files[0];

  if (!title && !file) {
    return;
  }

  const episode = {
    title: title || `Épisode ${episodeDraft.length + 1}`,
    url: ''
  };

  if (file) {
    episode.url = await readFileAsDataUrl(file);
  }

  episodeDraft.push(episode);
  episodeTitleInput.value = '';
  episodeFileInput.value = '';
  renderEpisodeList();
}

function resetStudioForm() {
  studioForm.reset();
  episodeDraft = [];
  renderEpisodeList();
}

studioForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(studioForm);
  const title = formData.get('title').toString().trim();
  const type = formData.get('type').toString();

  if (!title) {
    return;
  }

  const coverFile = formData.get('coverFile');
  const coverUrl = formData.get('coverUrl').toString().trim();
  const videoPlatform = formData.get('videoPlatform').toString();
  const videoUrl = formData.get('videoUrl').toString().trim();
  const description = formData.get('description').toString().trim();
  const year = Number(formData.get('year')) || new Date().getFullYear();
  const quality = formData.get('quality').toString();

  let poster = coverUrl || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80';

  if (coverFile && coverFile.size > 0) {
    poster = await readFileAsDataUrl(coverFile);
  }

  const newEntry = {
    id: Date.now(),
    title,
    type,
    year,
    quality,
    rating: Number((4.6 + Math.random() * 0.4).toFixed(1)),
    description: description || 'Contenu ajouté via le Studio personnel.',
    poster,
    videoUrl,
    videoPlatform,
    episodes: episodeDraft.map((episode) => ({
      title: episode.title,
      url: episode.url || videoUrl
    }))
  };

  library = [newEntry, ...library];
  saveLibrary();
  renderFilters();
  renderCatalog();
  renderStudioEntries();
  resetStudioForm();
  renderPlayer(newEntry);
});

function renderStudioEntries() {
  studioEntries.innerHTML = '';

  if (!library.length) {
    studioEntries.innerHTML = '<p class="empty-state small">Aucune vidéo ajoutée pour l’instant.</p>';
    return;
  }

  library.forEach((item) => {
    const article = document.createElement('div');
    article.className = 'studio-entry';
    article.innerHTML = `
      <div class="mini-poster" style="background-image: url('${item.poster}')"></div>
      <div class="mini-copy">
        <strong>${item.title}</strong>
        <span>${item.type} • ${item.year}</span>
      </div>
      <div class="mini-actions">
        <button type="button" data-play="${item.id}">Lire</button>
        <button type="button" class="danger" data-delete="${item.id}">Supprimer</button>
      </div>
    `;

    const playBtn = article.querySelector('[data-play]');
    playBtn.addEventListener('click', () => {
      renderPlayer(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const deleteBtn = article.querySelector('[data-delete]');
    deleteBtn.addEventListener('click', () => {
      library = library.filter((entry) => entry.id !== item.id);
      saveLibrary();
      renderFilters();
      renderCatalog();
      renderStudioEntries();
    });

    studioEntries.appendChild(article);
  });
}

addEpisodeBtn.addEventListener('click', handleEpisodeAdd);
searchInput.addEventListener('input', renderCatalog);

playFeaturedBtn.addEventListener('click', () => {
  const firstItem = library[0];
  if (firstItem) {
    renderPlayer(firstItem);
    document.getElementById('accueil').scrollIntoView({ behavior: 'smooth' });
  }
});

moreInfoBtn.addEventListener('click', () => {
  document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('resetStudioBtn').addEventListener('click', resetStudioForm);

renderFilters();
renderCatalog();
renderEpisodeList();
renderStudioEntries();
renderPlayer(selectedContent);
