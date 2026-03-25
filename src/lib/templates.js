// Website templates for generated sites
// Three templates: professional, shop, creative
// All mobile-first, responsive, white/professional style

export function getTemplate(type, data) {
  const templates = { professional, shop, creative };
  const templateFn = templates[type] || templates.professional;
  return templateFn(data);
}

function professional(data) {
  return `<!DOCTYPE html>
<html lang="${data.lang || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - ${data.designation || data.business}</title>
  <meta name="description" content="${data.metaDescription || `${data.name} - ${data.business}. Contact us for professional services.`}">
  <meta name="keywords" content="${data.metaKeywords || `${data.name}, ${data.business}, ${data.services?.join(', ')}`}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; color: #0F172A; background: #fff; line-height: 1.7; }
    .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
    
    /* Header */
    .header { background: #1A1A2E; color: white; padding: 60px 20px; text-align: center; position: relative; overflow: hidden; }
    .header h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; position: relative; z-index: 10; }
    .header p { font-size: 1rem; opacity: 0.8; font-weight: 400; position: relative; z-index: 10; }
    
    /* Section */
    .section { padding: 48px 20px; }
    .section:nth-child(even) { background: #F8F9FA; }
    .section-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 16px; color: #1A1A2E; }
    .section p { color: #64748B; }
    
    /* Services */
    .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .service-card { background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; }
    .service-card h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; }
    .service-card p { font-size: 0.85rem; color: #64748B; }
    
    /* Contact */
    .contact-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #E2E8F0; }
    .contact-item:last-child { border-bottom: none; }
    .contact-item .icon { width: 36px; height: 36px; background: #F8F9FA; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .contact-item .info { font-size: 0.9rem; }
    .contact-item .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 500; }
    
    /* WhatsApp CTA */
    .whatsapp-btn { display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: transform 0.2s; }
    .whatsapp-btn:hover { transform: scale(1.02); }
    
    /* Floating WhatsApp */
    .whatsapp-float { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(37,211,102,0.3); text-decoration: none; z-index: 100; transition: transform 0.2s; }
    .whatsapp-float:hover { transform: scale(1.1); }
    .whatsapp-float svg { width: 28px; height: 28px; fill: white; }
    
    /* Footer */
    .footer { text-align: center; padding: 24px; border-top: 1px solid #E2E8F0; }
    .footer a { color: #6C63FF; text-decoration: none; font-size: 0.8rem; font-weight: 500; }
  <style>
    @keyframes heroColorCycle { 0% { filter: hue-rotate(0deg); } 25% { filter: hue-rotate(45deg); } 50% { filter: hue-rotate(90deg); } 75% { filter: hue-rotate(45deg); } 100% { filter: hue-rotate(0deg); } }
  </style>
  <header class="header" style="position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; min-height: 400px; background: linear-gradient(${(data.name || 'Bus').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}deg, var(--primary-color), #6366f1, #a855f7, #4f46e5); animation: heroColorCycle 6s ease-in-out infinite;">
    <div id="hero-3d-container" style="position: absolute; inset: 0; z-index: 0; opacity: 0.5;"></div>
    <div class="container" style="position: relative; z-index: 10;">
      <h1 style="word-break: break-word; overflow-wrap: break-word;">${data.name || 'Business Name'}</h1>
      <p>${data.designation || data.business || 'Professional Services'}</p>
    </div>
  </header>

  ${data.about ? `
  <section class="section">
    <div class="container" style="display: flex; flex-direction: row; align-items: stretch; gap: 20px;">
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <h2 class="section-title" style="font-size: clamp(1rem, 5vw, 1.5rem); text-align: left;">About</h2>
        <p style="font-size: clamp(0.75rem, 3vw, 1rem);">${data.about}</p>
      </div>
      <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
        <div id="about-3d-container" style="width: 100%; height: clamp(150px, 40vh, 250px); position: relative;"></div>
      </div>
    </div>
  </section>
  ` : ''}

  ${data.services?.length ? `
  <section class="section">
    <div class="container">
      <h2 class="section-title">Services</h2>
      <div class="services-grid">
        ${data.services.map(s => `
        <div class="service-card">
          <h3>${typeof s === 'string' ? s : s.name}</h3>
          ${typeof s !== 'string' && s.description ? `<p>${s.description}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <section class="section">
    <div class="container">
      <h2 class="section-title">Contact</h2>
      ${data.phone ? `
      <div class="contact-item">
        <div class="icon">📞</div>
        <div><div class="label">Phone</div><div class="info">${data.phone}</div></div>
      </div>` : ''}
      ${data.email ? `
      <div class="contact-item">
        <div class="icon">✉️</div>
        <div><div class="label">Email</div><div class="info">${data.email}</div></div>
      </div>` : ''}
      ${data.address ? `
      <div class="contact-item">
        <div class="icon">📍</div>
        <div><div class="label">Address</div><div class="info">${data.address}</div></div>
      </div>` : ''}
      
      ${data.phone ? `
      <div style="margin-top: 24px; text-align: center;">
        <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" class="whatsapp-btn" target="_blank">
          💬 Contact on WhatsApp
        </a>
      </div>` : ''}
    </div>
  </section>

  <footer class="footer">
    <a href="https://yuktha.pages.dev" target="_blank">Made with ✨ Yuktha</a>
  </footer>

  ${data.phone ? `
  <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" class="whatsapp-float" target="_blank" aria-label="Contact on WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>` : ''}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    (function() {
      const name = "${data.name || 'Business'}";
      const aboutLen = "${(data.about || '').length}";
      const seed = (name + aboutLen).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + ${data.name ? data.name.length : 0};

      function create3D(containerId, typeIndex) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%'; canvas.style.height = '100%';
        container.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);

        let geometry;
        const types = [
          new THREE.TorusKnotGeometry(10, 3, 100, 16),
          new THREE.IcosahedronGeometry(12, 1),
          new THREE.OctahedronGeometry(12, 2),
          new THREE.TorusGeometry(12, 4, 16, 100)
        ];
        geometry = types[typeIndex % types.length];
        
        const material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.6 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        camera.position.z = 30;

        function animate() {
          requestAnimationFrame(animate);
          mesh.rotation.x += 0.01; mesh.rotation.y += 0.01;
          renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
          renderer.setSize(container.offsetWidth, container.offsetHeight);
          camera.aspect = container.offsetWidth / container.offsetHeight;
          camera.updateProjectionMatrix();
        });
      }
      create3D('hero-3d-container', 0); // Always TorusKnot for Hero
      create3D('about-3d-container', seed + 1);
    })();
  </script>
</body>
</html>`;
}

function shop(data) {
  return `<!DOCTYPE html>
<html lang="${data.lang || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - ${data.business || 'Shop'}</title>
  <meta name="description" content="${data.metaDescription || `${data.name} - ${data.business}. Shop with us today!`}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; color: #0F172A; background: #fff; line-height: 1.7; }
    .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
    
    /* Hero */
    .hero { background: linear-gradient(135deg, #1A1A2E 0%, #2D2B55 100%); color: white; padding: 80px 20px; text-align: center; position: relative; overflow: hidden; }
    .hero h1 { font-size: 2.2rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px; position: relative; z-index: 10; }
    .hero p { font-size: 1.1rem; opacity: 0.85; position: relative; z-index: 10; }
    
    .section { padding: 48px 20px; }
    .section:nth-child(even) { background: #F8F9FA; }
    .section-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 20px; color: #1A1A2E; text-align: center; }
    
    /* Products Grid */
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .product-card { background: white; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; text-align: center; transition: transform 0.2s, box-shadow 0.2s; }
    .product-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    .product-icon { font-size: 2rem; margin-bottom: 12px; }
    .product-card h3 { font-size: 0.95rem; font-weight: 600; }
    .product-card p { font-size: 0.8rem; color: #64748B; margin-top: 4px; }
    
    /* Offers */
    .offer-banner { background: linear-gradient(135deg, #6C63FF 0%, #A78BFA 100%); color: white; border-radius: 16px; padding: 24px; text-align: center; margin: 0 auto; max-width: 600px; }
    .offer-banner h3 { font-size: 1.1rem; font-weight: 700; }
    .offer-banner p { opacity: 0.9; font-size: 0.9rem; margin-top: 4px; }
    
    /* Order Button */
    .order-btn { display: inline-flex; align-items: center; gap: 8px; background: #25D366; color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 1rem; transition: transform 0.2s; margin-top: 20px; }
    .order-btn:hover { transform: scale(1.03); }
    
    /* Info */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 500px; margin: 0 auto; }
    .info-item { text-align: center; }
    .info-item .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 500; }
    .info-item .value { font-size: 0.95rem; font-weight: 600; margin-top: 4px; }
    
    .whatsapp-float { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(37,211,102,0.3); text-decoration: none; z-index: 100; transition: transform 0.2s; }
    .whatsapp-float:hover { transform: scale(1.1); }
    .whatsapp-float svg { width: 28px; height: 28px; fill: white; }
    
    .footer { text-align: center; padding: 24px; border-top: 1px solid #E2E8F0; }
    .footer a { color: #6C63FF; text-decoration: none; font-size: 0.8rem; font-weight: 500; }
  </style>
</head>
<body>
  <style>
    @keyframes heroColorCycle { 0% { filter: hue-rotate(0deg); } 25% { filter: hue-rotate(45deg); } 50% { filter: hue-rotate(90deg); } 75% { filter: hue-rotate(45deg); } 100% { filter: hue-rotate(0deg); } }
  </style>
  <div class="hero" style="position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; min-height: 400px; background: linear-gradient(${(data.name || 'Shop').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}deg, var(--primary-color), #6366f1, #a855f7, #4f46e5); animation: heroColorCycle 6s ease-in-out infinite;">
    <div id="shop-hero-3d" style="position: absolute; inset: 0; z-index: 0; opacity: 0.4;"></div>
    <div class="container" style="position: relative; z-index: 10;">
      <h1 style="word-break: break-word; overflow-wrap: break-word;">${data.name || 'Shop Name'}</h1>
      <p>${data.tagline || data.business || 'Your one-stop shop'}</p>
    </div>
  </div>

  ${data.about ? `
  <section class="section">
    <div class="container" style="display: flex; flex-direction: row; align-items: stretch; gap: 20px;">
      <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
        <div id="shop-about-3d" style="width: 100%; height: clamp(150px, 40vh, 250px); position: relative;"></div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <h2 class="section-title" style="font-size: clamp(1rem, 5vw, 1.5rem); text-align: left;">About Us</h2>
        <p style="font-size: clamp(0.75rem, 3vw, 1rem);">${data.about}</p>
      </div>
    </div>
  </section>
  ` : ''}

  ${data.services?.length ? `
  <section class="section">
    <div class="container">
      <h2 class="section-title">Our Products & Services</h2>
      <div class="products-grid">
        ${data.services.map(s => `
        <div class="product-card">
          <div class="product-icon">🏷️</div>
          <h3>${typeof s === 'string' ? s : s.name}</h3>
          ${typeof s !== 'string' && s.price ? `<p>${s.price}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  ${data.offers ? `
  <section class="section">
    <div class="container">
      <div class="offer-banner">
        <h3>🎉 ${data.offers}</h3>
      </div>
    </div>
  </section>
  ` : ''}

  <section class="section">
    <div class="container">
      <h2 class="section-title">Visit Us</h2>
      <div class="info-grid">
        ${data.phone ? `<div class="info-item"><div class="label">Phone</div><div class="value">📞 ${data.phone}</div></div>` : ''}
        ${data.address ? `<div class="info-item"><div class="label">Location</div><div class="value">📍 ${data.address}</div></div>` : ''}
        ${data.hours ? `<div class="info-item"><div class="label">Hours</div><div class="value">🕐 ${data.hours}</div></div>` : ''}
        ${data.email ? `<div class="info-item"><div class="label">Email</div><div class="value">✉️ ${data.email}</div></div>` : ''}
      </div>
      
      ${data.phone ? `
      <div style="text-align: center;">
        <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" class="order-btn" target="_blank">
          💬 Order on WhatsApp
        </a>
      </div>` : ''}
    </div>
  </section>

  <footer class="footer">
    <a href="https://yuktha.pages.dev" target="_blank">Made with ✨ Yuktha</a>
  </footer>

  ${data.phone ? `
  <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" class="whatsapp-float" target="_blank" aria-label="Order on WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>` : ''}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    (function() {
      const name = "${data.name || 'Shop'}";
      const aboutLen = "${(data.about || '').length}";
      const seed = (name + aboutLen).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + ${data.name ? data.name.length : 0};

      function create3D(containerId, isHero, forceKnot) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%'; canvas.style.height = '100%';
        container.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);

        const group = new THREE.Group();
        if (forceKnot) {
          const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
          const material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.6 });
          group.add(new THREE.Mesh(geometry, material));
        } else if ((seed + (isHero?0:1)) % 2 === 0) {
          for(let i=0; i<8; i++) {
            const geometry = new THREE.SphereGeometry(Math.random() * 2, 32, 32);
            const material = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.6 });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(Math.random()*20-10, Math.random()*20-10, Math.random()*20-10);
            group.add(sphere);
          }
        } else {
          const geometry = new THREE.OctahedronGeometry(12, 1);
          const material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.6 });
          group.add(new THREE.Mesh(geometry, material));
        }
        scene.add(group);
        camera.position.z = 25;

        function animate() {
          requestAnimationFrame(animate);
          group.rotation.x += 0.005; group.rotation.y += 0.005;
          renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
          renderer.setSize(container.offsetWidth, container.offsetHeight);
          camera.aspect = container.offsetWidth / container.offsetHeight;
          camera.updateProjectionMatrix();
        });
      }
      create3D('shop-hero-3d', true, true); // true, true means hero and force knot
      create3D('shop-about-3d', false, false);
    })();
  </script>
</body>
</html>`;
}

function creative(data) {
  return `<!DOCTYPE html>
<html lang="${data.lang || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - ${data.business || 'Creative Professional'}</title>
  <meta name="description" content="${data.metaDescription || `${data.name} - Creative professional. View portfolio and get in touch.`}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; color: #0F172A; background: #fff; line-height: 1.7; }
    .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
    
    /* Hero */
    .hero { min-height: 60vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 80px 20px; background: #F8F9FA; position: relative; overflow: hidden; }
    .hero h1 { font-size: 3rem; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 12px; background: linear-gradient(135deg, #1A1A2E, #6C63FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; position: relative; z-index: 10; }
    .hero p { font-size: 1.1rem; color: #64748B; max-width: 500px; margin: 0 auto; position: relative; z-index: 10; }
    
    .section { padding: 48px 20px; }
    .section:nth-child(even) { background: #F8F9FA; }
    .section-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 24px; color: #1A1A2E; }
    
    /* Portfolio */
    .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
    .portfolio-item { background: white; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; transition: transform 0.2s, box-shadow 0.2s; }
    .portfolio-item:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
    .portfolio-item h3 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
    .portfolio-item p { font-size: 0.85rem; color: #64748B; }
    
    /* Skills */
    .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { background: #F8F9FA; border: 1px solid #E2E8F0; border-radius: 50px; padding: 6px 16px; font-size: 0.8rem; font-weight: 500; color: #1A1A2E; }
    
    /* Contact */
    .contact-section { text-align: center; }
    .contact-link { display: inline-flex; align-items: center; gap: 8px; color: #1A1A2E; text-decoration: none; font-weight: 500; padding: 8px 0; font-size: 0.95rem; }
    .contact-link:hover { color: #6C63FF; }
    
    .cta-btn { display: inline-flex; align-items: center; gap: 8px; background: #1A1A2E; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; transition: transform 0.2s; margin-top: 16px; }
    .cta-btn:hover { transform: scale(1.02); }
    
    .whatsapp-float { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(37,211,102,0.3); text-decoration: none; z-index: 100; transition: transform 0.2s; }
    .whatsapp-float:hover { transform: scale(1.1); }
    .whatsapp-float svg { width: 28px; height: 28px; fill: white; }
    
    .footer { text-align: center; padding: 24px; border-top: 1px solid #E2E8F0; }
    .footer a { color: #6C63FF; text-decoration: none; font-size: 0.8rem; font-weight: 500; }
  </style>
</head>
<body>
  <style>
    @keyframes heroColorCycle { 0% { filter: hue-rotate(0deg); } 25% { filter: hue-rotate(45deg); } 50% { filter: hue-rotate(90deg); } 75% { filter: hue-rotate(45deg); } 100% { filter: hue-rotate(0deg); } }
  </style>
  <div class="hero" style="position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; min-height: 450px; background: linear-gradient(${(data.name || 'Cre').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}deg, var(--primary-color), #6366f1, #a855f7, #4f46e5); animation: heroColorCycle 6s ease-in-out infinite;">
    <div id="creative-hero-3d" style="position: absolute; inset: 0; z-index: 0; opacity: 0.5;"></div>
    <div class="container" style="position: relative; z-index: 10;">
      <h1 style="word-break: break-word; overflow-wrap: break-word;">${data.name || 'Creative Professional'}</h1>
      <p>${data.tagline || data.business || 'Creating beautiful things'}</p>
    </div>
  </div>

  ${data.about ? `
  <section class="section" style="background: white;">
    <div class="container" style="display: flex; flex-direction: row; align-items: stretch; gap: 20px;">
      <div style="flex: 1; display: flex; align-items: center; justify-content: center;">
        <div id="creative-about-3d" style="width: 100%; height: clamp(200px, 45vh, 300px); position: relative;"></div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <h2 class="section-title" style="font-size: clamp(1rem, 5vw, 1.5rem); text-align: left;">Vision</h2>
        <p style="font-size: clamp(0.75rem, 3vw, 1rem);">${data.about}</p>
      </div>
    </div>
  </section>
  ` : ''}

  ${data.portfolio?.length ? `
  <section class="section">
    <div class="container">
      <h2 class="section-title">Portfolio</h2>
      <div class="portfolio-grid">
        ${data.portfolio.map(p => `
        <div class="portfolio-item">
          <h3>${typeof p === 'string' ? p : p.title}</h3>
          ${typeof p !== 'string' && p.description ? `<p>${p.description}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  ${data.skills?.length ? `
  <section class="section">
    <div class="container">
      <h2 class="section-title">Skills</h2>
      <div class="skills-list">
        ${data.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <section class="section">
    <div class="container contact-section">
      <h2 class="section-title" style="text-align:center;">Get in Touch</h2>
      ${data.email ? `<a href="mailto:${data.email}" class="contact-link">✉️ ${data.email}</a><br>` : ''}
      ${data.phone ? `<a href="tel:${data.phone}" class="contact-link">📞 ${data.phone}</a><br>` : ''}
      ${data.address ? `<p style="color: #64748B; font-size: 0.9rem; margin-top: 8px;">📍 ${data.address}</p>` : ''}
      
      ${data.email ? `<a href="mailto:${data.email}" class="cta-btn">✉️ Send a Message</a>` : ''}
    </div>
  </section>

  <footer class="footer">
    <a href="https://yuktha.pages.dev" target="_blank">Made with ✨ Yuktha</a>
  </footer>

  ${data.phone ? `
  <a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" class="whatsapp-float" target="_blank" aria-label="Contact on WhatsApp">
    <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  </a>` : ''}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script>
    (function() {
      const name = "${data.name || 'Creative'}";
      const aboutLen = "${(data.about || '').length}";
      const seed = (name + aboutLen).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + ${data.name ? data.name.length : 0};

      function create3D(containerId, typeIndex) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%'; canvas.style.height = '100%';
        container.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);

        let geometry;
        const types = [
          new THREE.IcosahedronGeometry(12, 1),
          new THREE.TorusKnotGeometry(10, 3, 100, 16),
          new THREE.ConeGeometry(10, 20, 32),
          new THREE.DodecahedronGeometry(12, 0)
        ];
        geometry = types[typeIndex % types.length];
        
        const material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.6 });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        camera.position.z = 30;

        function animate() {
          requestAnimationFrame(animate);
          mesh.rotation.x += 0.01; mesh.rotation.y += 0.01;
          renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
          renderer.setSize(container.offsetWidth, container.offsetHeight);
          camera.aspect = container.offsetWidth / container.offsetHeight;
          camera.updateProjectionMatrix();
        });
      }
      create3D('creative-hero-3d', 1); // Knot index (1 in Creative types is Knot)
      create3D('creative-about-3d', seed + 1);
    })();
  </script>
</body>
</html>`;
}
