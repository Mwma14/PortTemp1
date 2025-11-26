import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Code2, Cpu, Database, Cloud, Zap, ExternalLink, 
  Github, Linkedin, Twitter, Mail, MapPin, Phone, ChevronDown,
  Layers, Server, Globe, Shield, Rocket, ArrowRight,
  Briefcase, User, FolderGit2, HelpCircle
} from 'lucide-react';
import ParticleNetwork from './ParticleNetwork';
import TypingEffect from './TypingEffect';
import GlitchText from './GlitchText';
import CyberButton from './CyberButton';

interface Skill {
  id?: string;
  name: string;
  level: number;
  color: 'cyan' | 'purple' | 'green';
}

interface Stat {
  id?: string;
  value: string;
  label: string;
}

interface PortfolioData {
  title: string;
  subtitle: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  heroText?: string;
  skills?: Skill[];
  stats?: Stat[];
  services: Array<{ id: string; name: string; description: string; icon: string }>;
  projects: Array<{ id: string; name: string; description: string; image: string; link: string; tags: string[] }>;
  socialMedia: Array<{ platform: string; url: string }>;
  faqItems?: Array<{ id: string; question: string; answer: string }>;
}

interface CyberDevFolioProps {
  data?: PortfolioData;
  onBack?: () => void;
}

const defaultData: PortfolioData = {
  title: "CYBER_DEV",
  subtitle: "Full-Stack Developer & System Architect",
  heroText: "Hello World. I build the future.",
  about: "Engineering resilient, performant web platforms with cutting-edge technologies. Specialized in distributed systems, cloud architecture, and high-performance applications. Building the digital infrastructure of tomorrow.",
  email: "dev@cybersystems.io",
  phone: "+1 (555) 0x7F",
  location: "Remote // Global",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
  services: [
    { id: "1", name: "System Architecture", description: "Designing scalable, fault-tolerant distributed systems with microservices and event-driven patterns.", icon: "Cpu" },
    { id: "2", name: "Full-Stack Development", description: "End-to-end application development with React, Node.js, TypeScript, and modern frameworks.", icon: "Code2" },
    { id: "3", name: "Cloud Infrastructure", description: "AWS, GCP, and Azure deployments with Kubernetes, Docker, and infrastructure as code.", icon: "Cloud" },
    { id: "4", name: "Performance Optimization", description: "Application profiling, caching strategies, and database optimization for maximum throughput.", icon: "Zap" },
  ],
  projects: [
    { 
      id: "1", 
      name: "Neural Trading Platform", 
      description: "AI-powered algorithmic trading system processing 10M+ transactions daily with sub-millisecond latency.", 
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", 
      link: "#", 
      tags: ["Python", "TensorFlow", "Redis", "Kubernetes"] 
    },
    { 
      id: "2", 
      name: "Distributed Messaging System", 
      description: "Real-time communication platform handling 1M+ concurrent connections with 99.99% uptime.", 
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop", 
      link: "#", 
      tags: ["Go", "gRPC", "PostgreSQL", "WebSocket"] 
    },
    { 
      id: "3", 
      name: "Cloud Security Suite", 
      description: "Enterprise-grade security monitoring and threat detection with automated incident response.", 
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop", 
      link: "#", 
      tags: ["Rust", "AWS", "ML", "Zero Trust"] 
    },
  ],
  socialMedia: [
    { platform: "GitHub", url: "#" },
    { platform: "LinkedIn", url: "#" },
    { platform: "Twitter", url: "#" },
  ],
  faqItems: [
    { id: "1", question: "What is your development process?", answer: "I follow an agile methodology with continuous integration/deployment. Each project starts with architecture design, followed by iterative development sprints with regular client sync-ups." },
    { id: "2", question: "What technologies do you specialize in?", answer: "My core stack includes TypeScript, React, Node.js, Go, and Python. For infrastructure, I work extensively with AWS, Kubernetes, and Terraform." },
    { id: "3", question: "How do you handle project timelines?", answer: "I provide detailed project roadmaps with milestone-based deliverables. Communication is key - you'll have full visibility into progress through regular updates and demos." },
  ],
};

const CyberDevFolio: React.FC<CyberDevFolioProps> = ({ data, onBack }) => {
  const portfolioData = { ...defaultData, ...data };
  const [activeSection, setActiveSection] = useState('hero');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [typingComplete, setTypingComplete] = useState(false);

  const getServiceIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Cpu: <Cpu className="w-8 h-8" />,
      Code2: <Code2 className="w-8 h-8" />,
      Cloud: <Cloud className="w-8 h-8" />,
      Zap: <Zap className="w-8 h-8" />,
      Database: <Database className="w-8 h-8" />,
      Server: <Server className="w-8 h-8" />,
      Globe: <Globe className="w-8 h-8" />,
      Shield: <Shield className="w-8 h-8" />,
      Layers: <Layers className="w-8 h-8" />,
    };
    return icons[iconName] || <Code2 className="w-8 h-8" />;
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      GitHub: <Github className="w-5 h-5" />,
      LinkedIn: <Linkedin className="w-5 h-5" />,
      Twitter: <Twitter className="w-5 h-5" />,
    };
    return icons[platform] || <Globe className="w-5 h-5" />;
  };

  const navLinks = [
    { id: 'about', label: 'ABOUT', icon: <User className="w-4 h-4" /> },
    { id: 'services', label: 'MODULES', icon: <Cpu className="w-4 h-4" /> },
    { id: 'projects', label: 'REPOS', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'faq', label: 'DOCS', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const defaultSkills: Skill[] = [
    { name: 'TypeScript', level: 95, color: 'cyan' },
    { name: 'React/Next.js', level: 92, color: 'cyan' },
    { name: 'Node.js', level: 90, color: 'purple' },
    { name: 'Go', level: 85, color: 'cyan' },
    { name: 'Python', level: 88, color: 'purple' },
    { name: 'AWS/Cloud', level: 87, color: 'green' },
    { name: 'Kubernetes', level: 82, color: 'cyan' },
    { name: 'PostgreSQL', level: 90, color: 'purple' },
  ];

  const defaultStats: Stat[] = [
    { value: '8+', label: 'Years Experience' },
    { value: '150+', label: 'Projects Deployed' },
    { value: '99.9%', label: 'Uptime Average' },
    { value: '50M+', label: 'Users Served' },
  ];

  const skills = (portfolioData.skills && portfolioData.skills.length > 0) ? portfolioData.skills : defaultSkills;
  const stats = (portfolioData.stats && portfolioData.stats.length > 0) ? portfolioData.stats : defaultStats;

  return (
    <div className="min-h-screen bg-void text-off-white overflow-x-hidden">
      <ParticleNetwork />
      
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />

      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-neon-cyan/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={onBack}
            >
              <div className="relative">
                <Terminal className="w-8 h-8 text-neon-cyan animate-glow-pulse" />
              </div>
              <span className="font-display font-bold text-xl tracking-widest">
                <span className="text-neon-cyan">&lt;</span>
                DEV
                <span className="text-neon-cyan">/&gt;</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="font-mono text-sm text-slate-400 hover:text-neon-cyan transition-all duration-300 bracket-hover relative"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {portfolioData.socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  className="text-slate-400 hover:text-neon-cyan transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <p className="font-mono text-neon-green text-sm">
                  <span className="text-slate-500">$</span> ./initialize_system.sh
                </p>
                <p className="font-mono text-slate-400 text-sm">
                  <span className="text-neon-cyan">{">"}</span> Booting developer profile...
                </p>
              </div>

              <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
                <TypingEffect 
                  text={portfolioData.heroText || "Hello World. I build the future."}
                  speed={60}
                  delay={500}
                  onComplete={() => setTypingComplete(true)}
                  className="text-white"
                />
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: typingComplete ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xl text-slate-400 font-mono">
                  <span className="text-neon-purple">{"//"}</span> {portfolioData.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <CyberButton 
                  variant="primary" 
                  icon={<Rocket className="w-5 h-5" />}
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  EXECUTE PROJECTS
                </CyberButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: typingComplete ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-6 text-sm font-mono text-slate-500"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-neon-cyan" /> Performance-led
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neon-green" /> Security-first
                </span>
                <span className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-neon-purple" /> Cloud Native
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot red"></div>
                  <div className="terminal-dot yellow"></div>
                  <div className="terminal-dot green"></div>
                  <span className="ml-4 text-slate-400 text-sm font-mono">system_profile.json</span>
                </div>
                <div className="p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-slate-300">
{`{
  "developer": {
    "name": "${portfolioData.title}",
    "role": "${portfolioData.subtitle}",
    "status": "AVAILABLE",
    "version": "2.0.0"
  },
  "stack": {
    "frontend": ["React", "Next.js", "TypeScript"],
    "backend": ["Node.js", "Go", "Python"],
    "cloud": ["AWS", "GCP", "Kubernetes"],
    "databases": ["PostgreSQL", "Redis", "MongoDB"]
  },
  "metrics": {
    "projects": ${stats[1].value.replace('+', '')},
    "uptime": "${stats[2].value}",
    "users_served": "${stats[3].value}"
  }
}`}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <a href="#about" className="flex flex-col items-center gap-2 text-slate-500 hover:text-neon-cyan transition-colors">
            <span className="text-xs font-mono">SCROLL_DOWN</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </motion.div>
      </section>

      <section id="about" className="py-32 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-neon-cyan text-sm">01.</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <GlitchText text="SYSTEM_SPECS" as="span" color="cyan" />
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/50 to-transparent" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="hud-panel p-8 rounded-lg">
                <div className="flex items-start gap-6">
                  {portfolioData.profileImage && (
                    <div className="relative">
                      <img 
                        src={portfolioData.profileImage} 
                        alt={portfolioData.title}
                        className="w-32 h-32 rounded-lg object-cover border-2 border-neon-cyan/30"
                      />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-neon-green rounded-full border-2 border-void flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">{portfolioData.title}</h3>
                    <p className="font-mono text-neon-cyan text-sm mb-4">{portfolioData.subtitle}</p>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-neon-purple" /> {portfolioData.location}
                      </p>
                      <p className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-4 h-4 text-neon-cyan" /> {portfolioData.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="code-block p-6">
                <p className="text-slate-500 font-mono text-xs mb-4">{"// ABOUT.md"}</p>
                <p className="text-slate-300 leading-relaxed">{portfolioData.about}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-4 rounded-lg text-center group hover:border-neon-cyan/50 transition-colors"
                  >
                    <p className="font-display text-2xl md:text-3xl font-bold text-neon-cyan group-hover:neon-text transition-all">
                      {stat.value}
                    </p>
                    <p className="text-xs font-mono text-slate-500 mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="hud-panel p-6 rounded-lg">
                <h4 className="font-mono text-sm text-neon-cyan mb-6 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> SKILL_MATRIX
                </h4>
                <div className="space-y-5">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-sm text-slate-300">{skill.name}</span>
                        <span className={`font-mono text-xs ${
                          skill.color === 'cyan' ? 'text-neon-cyan' : 
                          skill.color === 'purple' ? 'text-neon-purple' : 'text-neon-green'
                        }`}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="skill-bar">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="skill-bar-fill"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="services" className="py-32 px-6 relative bg-midnight/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-neon-cyan text-sm">02.</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <GlitchText text="ACTIVE_MODULES" as="span" color="purple" />
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-neon-purple/50 to-transparent" />
            </div>
            <p className="text-slate-400 font-mono text-sm max-w-2xl">
              {"// Specialized services designed to accelerate your digital transformation"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {portfolioData.services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="holographic-card p-8 rounded-lg group"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan group-hover:bg-neon-cyan/10 group-hover:shadow-neon-cyan transition-all">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-mono">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <span className="font-mono text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                    MODULE_STATUS: ACTIVE
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-32 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-neon-cyan text-sm">03.</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                <GlitchText text="PROJECT_REPOSITORY" as="span" color="green" />
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-neon-green/50 to-transparent" />
            </div>
            <p className="text-slate-400 font-mono text-sm">
              {"// Featured deployments from the production environment"}
            </p>
          </motion.div>

          <div className="space-y-8">
            {portfolioData.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group"
              >
                <div className="terminal-window overflow-hidden">
                  <div className="terminal-header">
                    <div className="terminal-dot red"></div>
                    <div className="terminal-dot yellow"></div>
                    <div className="terminal-dot green"></div>
                    <span className="ml-4 text-slate-400 text-sm font-mono">
                      ~/projects/{project.name.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2">
                    <div className="relative overflow-hidden scanlines">
                      {project.image && (
                        <img 
                          src={project.image} 
                          alt={project.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-void/80 to-transparent" />
                    </div>
                    
                    <div className="p-8 flex flex-col justify-center">
                      <div className="font-mono text-xs text-slate-500 mb-3">
                        <span className="text-neon-green">$</span> cat README.md
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 text-xs font-mono bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-4">
                        <a 
                          href={project.link}
                          className="inline-flex items-center gap-2 font-mono text-sm text-neon-cyan hover:text-white transition-colors"
                        >
                          <span className="text-slate-500">$</span> git checkout live-site
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {portfolioData.faqItems && portfolioData.faqItems.length > 0 && (
        <section id="faq" className="py-32 px-6 relative bg-midnight/30">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-neon-cyan text-sm">04.</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  <GlitchText text="KNOWLEDGE_BASE" as="span" color="cyan" />
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/50 to-transparent" />
              </div>
              <p className="text-slate-400 font-mono text-sm">
                {"// Frequently accessed documentation entries"}
              </p>
            </motion.div>

            <div className="space-y-4">
              {portfolioData.faqItems.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="code-block overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 group"
                  >
                    <div className="flex-1">
                      <span className="font-mono text-slate-500 text-sm block mb-2">
                        {"// Q{" + (index + 1) + "}"}
                      </span>
                      <span className="font-mono text-white group-hover:text-neon-cyan transition-colors">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-neon-cyan transition-transform ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-neon-cyan/10 pt-4">
                          <p className="text-slate-400 text-sm leading-relaxed font-mono">
                            <span className="text-neon-green">{">"}</span> {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="py-12 px-6 border-t border-white/5 bg-void">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6 text-neon-cyan" />
              <span className="font-mono text-sm text-slate-500">
                &copy; {new Date().getFullYear()} {portfolioData.title}. All rights reserved.
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              {portfolioData.socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  className="text-slate-500 hover:text-neon-cyan transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
            
            <div className="font-mono text-xs text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              SYSTEM_STATUS: ONLINE
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CyberDevFolio;
