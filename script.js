document.addEventListener('DOMContentLoaded', () => {

const slides = [...document.querySelectorAll('.slide')];
const progressFill = document.getElementById('progressFill');

slides.forEach((slide) => {
  if (!slide.querySelector('.stars')) {
    const layer = document.createElement('div');
    layer.className = 'stars';
    layer.setAttribute('aria-hidden', 'true');
    slide.appendChild(layer);
  }
});

const seasonBtn = document.getElementById('seasonBtn');
const finale = document.getElementById('finale');
const cursor = document.querySelector('.cursor');

let index = 0;

/* =========================
   COUNTERS
========================= */

function animateCounter(el) {
  const target = Number(el.dataset.target || 0);
  let current = 0;
  const duration = 1400;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    current = Math.round(progress * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function animateSlideCounters(slide) {
  slide.querySelectorAll('.counter').forEach((counter) => {
    counter.textContent = '0';
    animateCounter(counter);
  });
}

/* =========================
   TAGARELAR CHART
========================= */

function animateTagarelarChart(slide) {
  const bar = slide.querySelector('#tagarelar-bar');
  const overflowText = slide.querySelector('#overflow-text');
  if (!bar || !overflowText) return;

  bar.style.display = '';
  bar.style.width = '0%';
  bar.classList.remove('overflow', 'error', 'explode');
  overflowText.style.display = 'none';

  setTimeout(() => {
    bar.style.width = '100%';
  }, 1000);

  setTimeout(() => {
    bar.classList.add('overflow');
    bar.style.width = '120%';
  }, 4000);

  setTimeout(() => {
    bar.classList.add('error');
  }, 4500);

  setTimeout(() => {
    bar.style.display = 'none';
    overflowText.style.display = 'block';
  }, 5500);
}

/* =========================
   RANKING
========================= */

function animateRanking(slide) {
  const items = slide.querySelectorAll('.rank-item');

  items.forEach((item, idx) => {
    const barInner = item.querySelector('.bar-inner');

    item.classList.remove('visible');
    if (barInner) barInner.style.width = '0';

    setTimeout(() => {
      item.classList.add('visible');
      if (barInner?.dataset.target) {
        barInner.style.width = barInner.dataset.target;
      }
    }, idx * 800 + 1000);

  });
}

/* =========================
   THEME
========================= */

function applyTheme(slide) {
  const theme = slide.dataset.theme;

  document.body.classList.toggle('night', theme === 'night');
  document.body.classList.toggle('special', theme === 'special');
}

/* =========================
   PROGRESS
========================= */

function updateProgress() {
  if (!progressFill) return;

  const ratio = (index + 1) / slides.length;
  progressFill.style.transform = `scaleY(${ratio})`;
}

/* =========================
   SLIDES
========================= */

function showSlide(nextIndex) {

  slides[index].classList.remove('active');
  slides[index].style.position = 'absolute';

  index = (nextIndex + slides.length) % slides.length;

  const activeSlide = slides[index];
  activeSlide.classList.add('active');

  applyTheme(activeSlide);
  updateProgress();
  animateSlideCounters(activeSlide);
  animateTagarelarChart(activeSlide);
  animateRanking(activeSlide);
}

function nextSlide() {
  showSlide(index + 1);
}

function resetAutoplay() {
  // autoplay disabled
}

/* =========================
   ENDING
========================= */

function revealEnding() {
  if (finale) finale.classList.add('show-ending');
}

/* =========================
   TAROT IMAGES
========================= */

function validateTarotImages() {

  document.querySelectorAll('.tarot-card img').forEach((img) => {

    img.addEventListener('error', () => {

      const front = img.closest('.card-front');
      if (front) front.classList.add('image-missing');

      console.warn(`Imagem não encontrada: ${img.getAttribute('src')}`);

    });

  });

}

/* =========================
   CURSOR
========================= */

function initCursor() {

  const allowCustomCursor =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!cursor || !allowCustomCursor) {
    if (cursor) cursor.style.display = 'none';
    return;
  }

  document.body.classList.add('has-custom-cursor');

  window.addEventListener('mousemove', (event) => {

    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;

  });

  document.querySelectorAll('button').forEach((item) => {

    item.addEventListener('mouseenter', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
    });

    item.addEventListener('mouseleave', () => {
      cursor.style.width = '';
      cursor.style.height = '';
    });

  });

}

/* =========================
   REVEAL TAROT
========================= */

// card click just marks it revealed; name is already shown below the photo
document.querySelectorAll('.tarot-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (card.classList.contains('revealed')) return;
    card.classList.add('revealed');
  });
});

/* =========================
   KEYBOARD
========================= */

window.addEventListener('keydown', (event) => {

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {

    event.preventDefault();
    nextSlide();
    resetAutoplay();

  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {

    event.preventDefault();
    showSlide(index - 1);
    resetAutoplay();

  }

});

/* =========================
   BUTTON NAV
========================= */

const nextBtn = document.getElementById('nextSlideBtn');

if (nextBtn) {

  nextBtn.addEventListener('click', (e) => {

    e.preventDefault();
    nextSlide();
    resetAutoplay();

  });

}

if (seasonBtn) {
  seasonBtn.addEventListener('click', revealEnding);
}

/* =========================
   INIT
========================= */

if (slides.length) {

  applyTheme(slides[index]);
  updateProgress();
  animateSlideCounters(slides[index]);
  animateTagarelarChart(slides[index]);
  animateRanking(slides[index]);
  resetAutoplay();
  initCursor();
  validateTarotImages();

}

});