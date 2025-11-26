import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown, ChevronUp, Mail } from "lucide-react";

interface PortfolioData {
  title: string;
  subtitle: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  heroText?: string;
  services: Array<{ id: string; name: string; description: string; icon: string }>;
  projects: Array<{ id: string; name: string; description: string; image: string; link: string; tags: string[] }>;
  socialMedia: Array<{ platform: string; url: string }>;
  faqItems?: Array<{ id: string; question: string; answer: string }>;
}

interface MinimalistPortfolioProps {
  data?: PortfolioData;
  onBack: () => void;
}

export const MinimalistPortfolio: React.FC<MinimalistPortfolioProps> = ({ data, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const demoData = data || {
    title: "Alex Chen",
    subtitle: "Visual Designer & Creative Director",
    about: "Passionate about creating beautiful digital experiences that blend functional design with emotional resonance. I specialize in designing intuitive interfaces and engaging brand identities.",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    services: [
      { id: "1", name: "UI/UX Design", description: "Crafting intuitive and beautiful user interfaces", icon: "🎨" },
      { id: "2", name: "Branding", description: "Building strong visual identities for brands", icon: "✨" },
      { id: "3", name: "Web Design", description: "Modern, responsive web experiences", icon: "💻" },
    ],
    projects: [
      { id: "1", name: "E-Commerce Platform", description: "Redesigned checkout flow", image: "https://images.unsplash.com/photo-1460925895917-adf4e7c2e1c3?w=600&h=400&fit=crop", link: "#", tags: ["Design", "Research"] },
      { id: "2", name: "SaaS Dashboard", description: "Analytics interface redesign", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop", link: "#", tags: ["UI Design", "Dashboard"] },
      { id: "3", name: "Mobile App", description: "iOS app for fitness tracking", image: "https://images.unsplash.com/photo-1512941691920-25bda97220b5?w=600&h=400&fit=crop", link: "#", tags: ["App", "Mobile"] },
    ],
    socialMedia: [
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" },
      { platform: "GitHub", url: "#" },
    ],
  };

  const portfolioData = data || demoData;
  const heroItems = portfolioData.heroText ? portfolioData.heroText.split(",").map(s => s.trim()).filter(s => s) : ["Web Design", "Mobile App Design", "Brand Identity", "UX Research", "Design Systems"];
  const skills = heroItems;

  const faqItems = (portfolioData.faqItems && portfolioData.faqItems.length > 0) 
    ? portfolioData.faqItems.map(f => ({ q: f.question, a: f.answer }))
    : [
        { q: "What is your design process?", a: "I start with research and discovery, followed by ideation, prototyping, and user testing to ensure optimal results." },
        { q: "How long does a project typically take?", a: "Projects vary, but most take 4-12 weeks depending on scope and complexity." },
        { q: "Do you work with remote clients?", a: "Yes! I work with clients globally and adapt my communication to fit different time zones." },
      ];

  const scrollToSection = (id: string) => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ 
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
    setMobileMenuOpen(false);
  };


  return (
    <div ref={containerRef} className="w-full min-h-screen bg-white text-black font-sans overflow-y-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="fixed top-6 right-6 z-50 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 font-medium"
      >
        ← Exit
      </button>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg" />
            <span className="text-lg font-bold">{portfolioData.title.split(" ")[0]}</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {["Home", "About", "Services", "Projects", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-medium hover:text-[#00DC82] transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t border-black/10 bg-gray-50">
            <div className="px-6 py-4 space-y-3">
              {["Home", "About", "Services", "Projects", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left py-2 font-medium hover:text-[#00DC82]"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#00DC82]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-gray-100 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {/* Text Selection Motif */}
            <div className="mb-8 p-4 bg-gray-100 border-2 border-black relative inline-block">
              <p className="text-sm font-bold">Hi everyone, I am</p>
              <div className="absolute top-1 right-1 w-3 h-3 border-2 border-black" />
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-4 leading-tight">
              {portfolioData.title}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-600 mb-6">
              {portfolioData.subtitle}
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              {portfolioData.about}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ y: -4 }}
                href={`mailto:${portfolioData.email}`}
                className="px-8 py-4 bg-black text-white font-bold rounded-lg shadow-[6px_6px_0px_#00DC82] hover:shadow-[10px_10px_0px_#00DC82] transition-all"
              >
                Get In Touch
              </motion.a>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="relative inline-block w-full">
              {/* Decorative background square */}
              <div className="absolute inset-0 w-full h-full bg-[#00DC82] rounded-lg transform translate-x-4 translate-y-4" />
              
              {/* Main image with border */}
              <div className="relative bg-white border-4 border-black rounded-lg overflow-hidden">
                <img
                  src={portfolioData.profileImage}
                  alt={portfolioData.title}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-6 -right-6 w-20 h-20 border-3 border-black rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee/Skills Strip */}
      <section className="py-12 bg-black text-white overflow-hidden">
        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 text-xl font-bold whitespace-nowrap"
          >
            {[...skills, ...skills].map((skill, idx) => (
              <div key={idx} className="flex items-center gap-8">
                <span>{skill}</span>
                <span className="text-[#00DC82]">●</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-5xl md:text-6xl font-bold mb-12">About Me</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {portfolioData.about}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                I believe in the power of thoughtful design to create meaningful connections between users and products.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 border-2 border-black rounded-lg hover:shadow-[6px_6px_0px_#00DC82] transition-all">
                <p className="text-sm font-bold text-[#00DC82] mb-2">Location</p>
                <p className="text-xl font-bold">{portfolioData.location}</p>
              </div>
              <div className="p-6 border-2 border-black rounded-lg hover:shadow-[6px_6px_0px_#00DC82] transition-all">
                <p className="text-sm font-bold text-[#00DC82] mb-2">Email</p>
                <a href={`mailto:${portfolioData.email}`} className="text-xl font-bold hover:text-[#00DC82]">
                  {portfolioData.email}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-5xl md:text-6xl font-bold mb-12">
            Services
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioData.services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-8 bg-white border-2 border-black rounded-lg hover:shadow-[8px_8px_0px_#00DC82] transition-all cursor-pointer"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-5xl md:text-6xl font-bold mb-12">
          Featured Projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolioData.projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-lg border-2 border-black"
            >
              <div className="relative h-80 overflow-hidden bg-gray-200">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="px-6 py-3 bg-[#00DC82] text-black font-bold rounded-lg"
                  >
                    View Case Study
                  </motion.button>
                </div>
              </div>

              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-200 text-sm font-medium rounded-full border border-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-5xl md:text-6xl font-bold mb-12">
            FAQ
          </motion.h2>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="border-2 border-black rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full p-6 flex items-center justify-between bg-white hover:bg-gray-50 font-bold text-lg transition-colors"
                >
                  <span>{item.q}</span>
                  {expandedFAQ === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: expandedFAQ === idx ? "auto" : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-gray-50 border-t-2 border-black"
                >
                  <p className="p-6 text-gray-600 leading-relaxed">{item.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-5xl md:text-6xl font-bold mb-4">
            Let's Work Together
          </motion.h2>
          <p className="text-xl text-gray-600 mb-12">Have an exciting project? I'd love to hear about it.</p>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-bold text-[#00DC82] mb-2">Email</p>
              <a href={`mailto:${portfolioData.email}`} className="text-2xl font-bold hover:text-[#00DC82] transition-colors">
                {portfolioData.email}
              </a>
            </div>

            <div>
              <p className="text-sm font-bold text-[#00DC82] mb-2">Phone</p>
              <a href={`tel:${portfolioData.phone}`} className="text-2xl font-bold hover:text-[#00DC82] transition-colors">
                {portfolioData.phone}
              </a>
            </div>

            <div>
              <p className="text-sm font-bold text-[#00DC82] mb-4">Social Media</p>
              <div className="flex gap-4">
                {portfolioData.socialMedia.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="px-4 py-2 border-2 border-black rounded-lg font-bold hover:bg-black hover:text-white transition-colors"
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-bold mb-2">© 2024 {portfolioData.title}. All rights reserved.</p>
          <p className="text-gray-400">Designed & built with care</p>
        </div>
      </footer>
    </div>
  );
};
