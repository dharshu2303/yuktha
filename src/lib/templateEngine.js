export function buildModernTemplate(data, isPreview, langName) {
  const { name, business, designation, phone, email, address, services } = data;

  // Add fallbacks
  const displayName = name || business || "My Business";
  const displayBusiness = business || "Professional Services";
  const heroTitle = isPreview && langName !== "English" ? `Welcome to ${displayName}` : `Welcome to ${displayName}`;
  
  const phoneLink = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : "#";
  const emailLink = email ? `mailto:${email}` : "#";
  const waLink = phone ? `https://wa.me/${phone.replace(/[^0-9+]/g, '')}` : "#";

  return `<!DOCTYPE html>
<html lang="${isPreview ? 'en' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayName} - ${displayBusiness}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; }
        .hero-pattern {
            background-color: #1a1a2e;
            background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 1px);
            background-size: 32px 32px;
        }
    </style>
</head>
<body class="text-slate-800 antialiased selection:bg-indigo-500 selection:text-white pb-20">

    <!-- Hero Section -->
    <header class="hero-pattern text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent"></div>
        <div class="container mx-auto px-6 py-24 relative z-10 text-center">
            <h1 class="text-5xl md:text-6xl font-bold mb-4 tracking-tight animate-fade-in-up">
                ${displayName}
            </h1>
            <p class="text-xl md:text-2xl text-indigo-200 mb-8 font-light">
                ${designation ? designation + ' • ' : ''}${displayBusiness}
            </p>
            ${phone ? `<a href="${phoneLink}" class="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"><i class="fas fa-phone"></i> Call Now</a>` : ''}
        </div>
    </header>

    <!-- Contact Info Cards -->
    <section class="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${phone ? `
            <a href="${phoneLink}" class="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-1 text-center border top-indigo-500">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl"><i class="fas fa-mobile-alt"></i></div>
                <h3 class="font-semibold text-slate-900 mb-1">Call Us</h3>
                <p class="text-slate-500">${phone}</p>
            </a>` : ''}
            
            ${email ? `
            <a href="${emailLink}" class="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-1 text-center border">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl"><i class="fas fa-envelope"></i></div>
                <h3 class="font-semibold text-slate-900 mb-1">Email Us</h3>
                <p class="text-slate-500">${email}</p>
            </a>` : ''}
            
            ${address ? `
            <div class="bg-white p-6 rounded-2xl shadow-xl text-center border">
                <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl"><i class="fas fa-map-marker-alt"></i></div>
                <h3 class="font-semibold text-slate-900 mb-1">Visit Us</h3>
                <p class="text-slate-500">${address}</p>
            </div>` : ''}
        </div>
    </section>

    <!-- Services Section -->
    ${services && services.length > 0 ? `
    <section class="py-20 bg-f8fafc">
        <div class="container mx-auto px-6 max-w-5xl">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
                <div class="w-24 h-1 bg-indigo-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${services.map(s => `
                <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-md transition">
                    <div class="flex items-start gap-4">
                        <div class="mt-1 bg-indigo-50 text-indigo-500 p-2 rounded-lg">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div>
                            <h4 class="text-xl font-semibold text-slate-800">${s}</h4>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
        <div class="container mx-auto px-6">
            <h2 class="text-2xl font-bold text-white mb-6">${displayName}</h2>
            <p class="mb-6">&copy; ${new Date().getFullYear()} All Rights Reserved.</p>
            <a href="https://yuktha-52jo1yac2-dharshinipriyaa426-3149s-projects.vercel.app" class="inline-flex items-center gap-2 text-sm hover:text-white transition">
                <span class="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">Y</span>
                Made with Yuktha
            </a>
        </div>
    </footer>

    <!-- Floating WhatsApp Button -->
    ${phone ? `
    <a href="${waLink}" target="_blank" class="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:bg-green-600 transition hover:scale-110 z-50">
        <i class="fab fa-whatsapp"></i>
    </a>` : ''}

</body>
</html>`;
}
