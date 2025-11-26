import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Mail, ExternalLink, Github, Code2, Zap, Shield } from "lucide-react";
import Navbar from "./DevFolio/Navbar";
import Footer from "./DevFolio/Footer";
import ParticleNetwork from "./DevFolio/ParticleNetwork";

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

interface DevFolioPortfolioProps {
  data?: PortfolioData;
  onBack: () => void;
}

export const DevFolioPortfolio: React.FC<DevFolioPortfolioProps> = ({ data, onBack }) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("");
  const typingRef = useRef<NodeJS.Timeout>();

  const demoData: PortfolioData = data || {
    title: "ALEX DEV",
    subtitle: "Full-Stack Engineer • Performance Architect",
    about: "Building resilient, high-performance web systems and immersive digital experiences. Specializing in scalable architectures, real-time systems, and modern web technologies.",
    email: "hello@alexdev.com",
    phone: "+1 (555) 123-4567",
    location: "Cyberspace",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    services: [
      { id: "1", name: "Full-Stack Development", description: "End-to-end scalable web applications with modern frameworks and cloud architectures.", icon: "⚙️" },
      { id: "2", name: "System Architecture", description: "High-performance, resilient systems designed for scale, reliability, and maintainability.", icon: "🏗️" },
      { id: "3", name: "Performance Optimization", description: "Advanced optimization techniques for web, database, and infrastructure layers.", icon: "⚡" },
      { id: "4", name: "Real-time Systems", description: "WebSocket-based real-time applications with efficient data synchronization.", icon: "🔄" },
      { id: "5", name: "API Design", description: "RESTful and GraphQL APIs with proper authentication, authorization, and rate limiting.", icon: "🔗" },
      { id: "6", name: "DevOps & Deployment", description: "CI/CD pipelines, containerization, and cloud deployment strategies.", icon: "🚀" },
    ],
    projects: [
      { 
        id: "1", 
        name: "Quantum Analytics Engine", 
        description: "Real-time analytics dashboard processing 1M+ events/sec with WebGL visualization and streaming aggregation.", 
        image: "https://images.unsplash.com/photo-1460925895917-adf4e7c2e1c3?w=600&h=400&fit=crop", 
        link: "#", 
        tags: ["React", "Node.js", "WebGL", "Redis", "WebSocket"] 
      },
      { 
        id: "2", 
        name: "Decentralized Commerce", 
        description: "Web3-enabled e-commerce with advanced 3D product visualization, smart contracts, and real-time inventory sync.", 
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop", 
        link: "#", 
        tags: ["Next.js", "Three.js", "Solidity", "Web3.js", "TypeScript"] 
      },
      { 
        id: "3", 
        name: "Neural Inference Platform", 
        description: "Serverless ML inference API with auto-scaling, model versioning, and A/B testing capabilities.", 
        image: "https://images.unsplash.com/photo-1512941691920-25bda97220b5?w=600&h=400&fit=crop", 
        link: "#", 
        tags: ["Python", "FastAPI", "PyTorch", "AWS", "PostgreSQL"] 
      },
    ],
    socialMedia: [
      { platform: "GitHub", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" },
    ],
  };

  const portfolioData = data || demoData;
  const faqItems = (portfolioData.faqItems && portfolioData.faqItems.length > 0) 
    ? portfolioData.faqItems 
    : [
        { id: "1", question: "What's your primary tech stack?", answer: "Modern JavaScript/TypeScript (React, Next.js, Node.js), cloud platforms (AWS, Vercel), databases (PostgreSQL, MongoDB, Redis), and containerization (Docker, Kubernetes)." },
        { id: "2", question: "Do you take on freelance projects?", answer: "Yes, I'm selective about projects. I focus on high-impact systems requiring deep technical expertise and long-term partnerships." },
        { id: "3", question: "What's your deployment approach?", answer: "Infrastructure-as-code using Terraform, containerized deployments with Docker, orchestration via Kubernetes, and CI/CD pipelines with GitHub Actions or GitLab CI." },
        { id: "4", question: "How do you handle system scaling?", answer: "Through horizontal scaling, caching strategies (Redis), database optimization, CDN utilization, and monitoring with observability tools." },
      ];

  useEffect(() => {
    const fullText = portfolioData.title;
    let index = 0;
    
    if (typingRef.current) clearTimeout(typingRef.current);
    
    typingRef.current = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        if (typingRef.current) clearInterval(typingRef.current);
      }
    }, 80);

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [portfolioData.title]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="relative min-h-screen bg-void text-slate-100 font-mono overflow-x-hidden">
      <style>{`
        .scanlines { background: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent); background-size: 100% 4px; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 999; }
        .cyber-glow { text-shadow: 0 0 10px rgba(0, 243, 255, 0.8), 0 0 20px rgba(0, 243, 255, 0.4); }
        .cyber-glow-purple { text-shadow: 0 0 10px rgba(188, 19, 254, 0.8), 0 0 20px rgba(188, 19, 254, 0.4); }
        .neon-border { border: 1px solid rgba(0, 243, 255, 0.3); box-shadow: inset 0 0 10px rgba(0, 243, 255, 0.1), 0 0 10px rgba(0, 243, 255, 0.2); }
        .glass-panel { background: linear-gradient(135deg, rgba(14, 14, 30, 0.8), rgba(20, 20, 40, 0.6)); backdrop-filter: blur(10px); border: 1px solid rgba(0, 243, 255, 0.2); }
        .tech-badge { background: linear-gradient(135deg, rgba(0, 243, 255, 0.1), rgba(188, 19, 254, 0.05)); border: 1px solid rgba(0, 243, 255, 0.3); }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 10px rgba(0, 243, 255, 0.5), inset 0 0 10px rgba(0, 243, 255, 0.1); } 50% { box-shadow: 0 0 20px rgba(0, 243, 255, 0.8), inset 0 0 10px rgba(0, 243, 255, 0.2); } }
        .float-animation { animation: float 3s ease-in-out infinite; }
        .glow-animation { animation: glow-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className="scanlines"></div>
      <ParticleNetwork />

      <div className="relative z-10">
        <Navbar onBack={onBack} />
        <main>
          {/* HERO */}
          <section id="hero" className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-neon-purple/5 pointer-events-none"></div>
            
            <motion.div 
              className="max-w-5xl w-full relative z-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Status Badge */}
              <motion.div variants={itemVariants} className="flex justify-center mb-8">
                <div className="tech-badge px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                  <span className="text-xs text-neon-cyan">SYSTEMS ONLINE • AVAILABLE FOR ENGAGEMENT</span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tighter"
              >
                <span className="cyber-glow">{displayText}</span>
                <span className="text-neon-cyan animate-pulse">_</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-neon-purple font-mono mb-6">
                {'// '} {portfolioData.subtitle}
              </motion.p>

              {/* Description */}
              <motion.div variants={itemVariants} className="mb-12 max-w-2xl">
                <p className="text-slate-400 leading-relaxed border-l-2 border-neon-cyan/50 pl-4 py-2 bg-gradient-to-r from-neon-cyan/10 to-transparent">
                  {portfolioData.about}
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-12">
                <button 
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-4 font-mono font-bold text-sm uppercase tracking-wider text-neon-cyan border border-neon-cyan/50 hover:border-neon-cyan transition-all duration-300 overflow-hidden neon-border"
                >
                  <div className="absolute inset-0 bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors"></div>
                  <div className="relative flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    View Projects
                  </div>
                </button>
                
                <button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative px-8 py-4 font-mono font-bold text-sm uppercase tracking-wider text-slate-300 border border-slate-700/50 hover:border-neon-purple/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-neon-purple/5 group-hover:bg-neon-purple/10 transition-colors"></div>
                  <div className="relative flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Get In Touch
                  </div>
                </button>
              </motion.div>

              {/* Meta Info */}
              <motion.ul variants={itemVariants} className="flex flex-wrap gap-6 text-sm text-slate-400 font-mono">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-neon-green" /> High Performance</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-neon-cyan" /> Production-Ready</li>
                <li className="flex items-center gap-2"><Code2 className="w-4 h-4 text-neon-purple" /> Full-Stack Capable</li>
              </motion.ul>
            </motion.div>
          </section>

          {/* ABOUT */}
          <section id="about" className="py-24 px-4 border-t border-slate-800/50">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                  <span className="cyber-glow">SYSTEM</span> <span className="cyber-glow-purple">DIAGNOSTICS</span>
                </h2>
                <div className="h-1 w-32 bg-gradient-to-r from-neon-cyan to-neon-purple mt-4"></div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <p className="text-slate-300 leading-relaxed">{portfolioData.about}</p>
                  {portfolioData.phone && (
                    <div className="glass-panel p-4 neon-border">
                      <div className="text-xs text-neon-cyan mb-1 font-bold">FREQUENCY</div>
                      <div className="text-slate-200">{portfolioData.phone}</div>
                    </div>
                  )}
                  {portfolioData.location && (
                    <div className="glass-panel p-4 neon-border">
                      <div className="text-xs text-neon-cyan mb-1 font-bold">LOCATION</div>
                      <div className="text-slate-200">{portfolioData.location}</div>
                    </div>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative glass-panel p-4 neon-border rounded-lg overflow-hidden">
                    {portfolioData.profileImage && (
                      <img 
                        src={portfolioData.profileImage}
                        alt={portfolioData.title}
                        className="w-full h-64 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" className="py-24 px-4 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent border-t border-slate-800/50">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                  <span className="cyber-glow">CORE</span> <span className="cyber-glow-purple">MODULES</span>
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioData.services.map((service, idx) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group glass-panel p-6 neon-border rounded-lg hover:border-neon-cyan/80 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="text-4xl mb-4">{service.icon}</div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{service.name}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* PROJECTS */}
          <section id="projects" className="py-24 px-4 border-t border-slate-800/50">
            <div className="max-w-5xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                  <span className="cyber-glow">PROJECT</span> <span className="cyber-glow-purple">REPOSITORY</span>
                </h2>
              </motion.div>

              <div className="grid gap-8">
                {portfolioData.projects.map((project, idx) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="group glass-panel border border-slate-800/50 overflow-hidden hover:border-neon-cyan/50 transition-all duration-300 grid grid-cols-1 md:grid-cols-3"
                  >
                    {/* Image */}
                    <div className="md:col-span-1 relative overflow-hidden h-64 md:h-auto">
                      {project.image && (
                        <>
                          <img 
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        </>
                      )}
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-slate-400 mb-4 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                          <span key={tag} className="tech-badge px-3 py-1 text-xs text-neon-cyan rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          {faqItems.length > 0 && (
            <section className="py-24 px-4 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent border-t border-slate-800/50">
              <div className="max-w-3xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                    <span className="cyber-glow">KNOWLEDGE</span> <span className="cyber-glow-purple">BASE</span>
                  </h2>
                </motion.div>

                <div className="space-y-4">
                  {faqItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="glass-panel border border-slate-800/50 overflow-hidden hover:border-neon-cyan/50 transition-all duration-300"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-neon-cyan/5 transition-colors"
                      >
                        <span className="text-left font-mono text-slate-200">
                          {`// ${item.question}`}
                        </span>
                        {expandedFAQ === item.id ? (
                          <ChevronUp className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedFAQ === item.id && (
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t border-slate-800/50"
                        >
                          <div className="p-6 bg-neon-cyan/5 text-slate-300 border-l-2 border-neon-cyan/50">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CONTACT */}
          <section id="contact" className="py-24 px-4 border-t border-slate-800/50">
            <div className="max-w-3xl mx-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
                  <span className="cyber-glow">ENCRYPTED</span> <span className="cyber-glow-purple">CHANNEL</span>
                </h2>
                <p className="font-mono text-neon-purple text-sm mt-4">{'$ > secure connection established'}</p>
              </motion.div>

              <div className="space-y-4">
                {portfolioData.email && (
                  <motion.a 
                    href={`mailto:${portfolioData.email}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group glass-panel p-4 neon-border flex items-center gap-4 hover:border-neon-cyan/80 transition-all duration-300 rounded-lg"
                  >
                    <Mail className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                    <span className="text-slate-300 group-hover:text-neon-cyan transition-colors">{portfolioData.email}</span>
                  </motion.a>
                )}

                {portfolioData.socialMedia.map((social, idx) => (
                  <motion.a 
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group glass-panel p-4 neon-border flex items-center gap-4 hover:border-neon-purple/80 transition-all duration-300 rounded-lg"
                  >
                    <Github className="w-5 h-5 text-neon-purple flex-shrink-0" />
                    <span className="text-slate-300 group-hover:text-neon-purple transition-colors">{social.platform}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};
