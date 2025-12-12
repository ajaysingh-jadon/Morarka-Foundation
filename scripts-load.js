// scripts-load-fixed.js
(async function initSite() {
  // helper to fetch and inject an HTML fragment
  async function loadFragment(url, selector) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} load failed: ${res.status}`);
      const html = await res.text();
      const container = document.getElementById(selector);
      if (container) container.innerHTML = html;
      return true;
    } catch (err) {
      console.error('Fragment load error:', err);
      return false;
    }
  }

  // helper to dynamically load a script and wait for it
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;   // keep execution order predictable
      s.onload = () => resolve();
      s.onerror = (e) => reject(new Error('Failed to load script: ' + src));
      document.body.appendChild(s);
    });
  }

  // 1) Load header and footer first (so navbar DOM exists)
  await loadFragment('header.html', 'header');
  await loadFragment('footer.html', 'footer');

  // 2) Now load bootstrap (local or CDN). This guarantees `window.bootstrap` is available after await
  // Use your local file path or use CDN (uncomment one)
  try {
    // Local file (ensure path & case exactly match repo)
    await loadScript('js/bootstrap.bundle.min.js');

    // OR use CDN during debugging (uncomment to try CDN)
    // await loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js');

  } catch (err) {
    console.error(err);
    // If bootstrap failed to load, bail or optionally try CDN fallback
    try {
      console.warn('Trying CDN fallback for bootstrap...');
      await loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js');
    } catch (cdErr) {
      console.error('Bootstrap failed to load (local + CDN). UI components may not work.', cdErr);
    }
  }

  // 3) Init bootstrap components that require the DOM + bootstrap library
  // e.g., Carousel init - ensure element exists and bootstrap available
  const myCarousel = document.querySelector('#myCarousel');
  if (myCarousel && window.bootstrap && typeof window.bootstrap.Carousel === 'function') {
    new bootstrap.Carousel(myCarousel, {
      interval: 3000,
      ride: 'carousel'
    });
  } else {
    if (!myCarousel) console.warn('#myCarousel element not found.');
    if (!window.bootstrap) console.warn('Bootstrap not loaded yet.');
  }

  // 4) Load AOS (optional) and init after it finishes loading
  try {
    await loadScript('js/aos.js'); // local
    // or CDN: await loadScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js');
    if (window.AOS) {
      AOS.init({ once: true, duration: 700 });
      AOS.refresh();
    }
  } catch (err) {
    console.warn('AOS failed to load:', err);
  }

  // 5) Attach IntersectionObserver safely (guard against null / NodeList mistakes)
  // Example selector — change '.animate-on-scroll' to whatever you actually use
  const targets = document.querySelectorAll('.animate-on-scroll');
  if (targets && targets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view'); // your animation trigger
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(el => {
      if (el instanceof Element) {
        observer.observe(el);
      } else {
        console.warn('Skipping non-Element:', el);
      }
    });
  } else {
    // no elements to observe — this prevents observe(null) errors
    console.info('No .animate-on-scroll elements found to observe.');
  }

  // 6) Any other DOM dependent code should run here (after assets and fragments loaded)
})();
