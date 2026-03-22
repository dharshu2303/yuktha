import { buildModernTemplate } from './src/lib/templateEngine.js';

const html = buildModernTemplate({
  name: "John Doe",
  business: "Acme Corp",
  designation: "CEO",
  phone: "+123456789",
  email: "john@acme.com",
  address: "123 Main St",
  services: ["Web Design", "SEO"],
  tagline: "We build the web"
}, true, "English");

console.log("Template generated successfully, length:", html.length);
