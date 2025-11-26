import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Plus, Trash2, Upload, Check, AlertCircle, ArrowRight, 
  Save, Eye, Terminal, Cpu, Code2, Cloud, Zap, Database, 
  Server, Globe, Shield, Layers, Rocket, Settings, BarChart3,
  User, Briefcase, HelpCircle, Share2, Sparkles
} from "lucide-react";
import { savePortfolio, checkSlugExists } from "../../lib/supabase";
import { PortfolioSuccessScreen } from "../PortfolioSuccessScreen";

interface Skill {
  id: string;
  name: string;
  level: number;
  color: 'cyan' | 'purple' | 'green';
}

interface Stat {
  id: string;
  value: string;
  label: string;
}

interface DevFolioData {
  title: string;
  subtitle: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  heroText: string;
  skills: Skill[];
  stats: Stat[];
  services: Array<{ id: string; name: string; description: string; icon: string }>;
  projects: Array<{ id: string; name: string; description: string; image: string; link: string; tags: string[] }>;
  modules: Array<{ id: string; name: string; description: string; link: string; language: string }>;
  repos: Array<{ id: string; name: string; description: string; link: string; stars: string; language: string }>;
  docs: Array<{ id: string; title: string; content: string; category: string }>;
  socialMedia: Array<{ platform: string; url: string }>;
  faqItems: Array<{ id: string; question: string; answer: string }>;
}

interface DevFolioBuilderProps {
  templateId: number;
  templateTitle: string;
  userId?: string;
  onSave?: (data: DevFolioData) => void;
  onBack: () => void;
}

const serviceIconOptions = [
  { value: 'Cpu', label: 'CPU / Processing', icon: <Cpu className="w-4 h-4" /> },
  { value: 'Code2', label: 'Code / Development', icon: <Code2 className="w-4 h-4" /> },
  { value: 'Cloud', label: 'Cloud / Hosting', icon: <Cloud className="w-4 h-4" /> },
  { value: 'Zap', label: 'Performance', icon: <Zap className="w-4 h-4" /> },
  { value: 'Database', label: 'Database', icon: <Database className="w-4 h-4" /> },
  { value: 'Server', label: 'Server / Backend', icon: <Server className="w-4 h-4" /> },
  { value: 'Globe', label: 'Web / Network', icon: <Globe className="w-4 h-4" /> },
  { value: 'Shield', label: 'Security', icon: <Shield className="w-4 h-4" /> },
  { value: 'Layers', label: 'Architecture', icon: <Layers className="w-4 h-4" /> },
  { value: 'Rocket', label: 'Launch / Deploy', icon: <Rocket className="w-4 h-4" /> },
  { value: 'Settings', label: 'Settings / Config', icon: <Settings className="w-4 h-4" /> },
];

const skillColorOptions = [
  { value: 'cyan', label: 'Neon Cyan', class: 'bg-neon-cyan' },
  { value: 'purple', label: 'Neon Purple', class: 'bg-neon-purple' },
  { value: 'green', label: 'Matrix Green', class: 'bg-neon-green' },
];

const socialPlatforms = ['GitHub', 'LinkedIn', 'Twitter', 'Discord', 'YouTube', 'Twitch', 'Website'];

export const DevFolioBuilder: React.FC<DevFolioBuilderProps> = ({ 
  templateId, 
  templateTitle,
  userId,
  onSave, 
  onBack 
}) => {
  const [data, setData] = useState<DevFolioData>({
    title: "",
    subtitle: "",
    about: "",
    email: "",
    phone: "",
    location: "",
    profileImage: "",
    heroText: "",
    skills: [],
    stats: [
      { id: "1", value: "", label: "Years Experience" },
      { id: "2", value: "", label: "Projects Completed" },
      { id: "3", value: "", label: "Uptime Average" },
      { id: "4", value: "", label: "Users Served" },
    ],
    services: [],
    projects: [],
    modules: [],
    repos: [],
    docs: [],
    socialMedia: [],
    faqItems: [],
  });

  const [activeTab, setActiveTab] = useState<"basic" | "skills" | "stats" | "services" | "projects" | "modules" | "repos" | "docs" | "faq" | "social">("basic");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBasicChange = (field: keyof DevFolioData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now().toString(), name: "", level: 75, color: 'cyan' as const }]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeSkill = (id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const updateStat = (id: string, field: 'value' | 'label', value: string) => {
    setData(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const addService = () => {
    setData(prev => ({
      ...prev,
      services: [...prev.services, { id: Date.now().toString(), name: "", description: "", icon: "Code2" }]
    }));
  };

  const updateService = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeService = (id: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now().toString(), name: "", description: "", image: "", link: "", tags: [] }]
    }));
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const addFAQ = () => {
    setData(prev => ({
      ...prev,
      faqItems: [...prev.faqItems, { id: Date.now().toString(), question: "", answer: "" }]
    }));
  };

  const updateFAQ = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      faqItems: prev.faqItems.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const removeFAQ = (id: string) => {
    setData(prev => ({
      ...prev,
      faqItems: prev.faqItems.filter(f => f.id !== id)
    }));
  };

  const addSocialMedia = () => {
    setData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "GitHub", url: "" }]
    }));
  };

  const updateSocialMedia = (index: number, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((s, i) => i === index ? { ...s, [field]: value } : s)
    }));
  };

  const removeSocialMedia = (index: number) => {
    setData(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleBasicChange("profileImage", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const handleTitleChange = (title: string) => {
    handleBasicChange("title", title);
    const generatedSlug = generateSlug(title);
    setSlug(generatedSlug);
    setSlugAvailable(null);
    setSlugError(null);
  };

  const handleSlugChange = (newSlug: string) => {
    const validSlug = newSlug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    setSlug(validSlug);
    setSlugAvailable(null);
    setSlugError(null);
  };

  const checkSlug = async () => {
    if (!slug) {
      setSlugError("Slug cannot be empty");
      return;
    }
    if (slug.length < 3) {
      setSlugError("Slug must be at least 3 characters");
      return;
    }
    
    try {
      const exists = await checkSlugExists(slug);
      if (exists) {
        setSlugAvailable(false);
        setSlugError("This URL is already taken. Choose another.");
      } else {
        setSlugAvailable(true);
        setSlugError(null);
      }
    } catch (err) {
      setSlugError("Error checking slug availability");
    }
  };

  const handleSave = async () => {
    if (data.title.trim() === "") {
      alert("Please enter your name / title");
      return;
    }
    if (!slug) {
      alert("Please create a URL for your portfolio");
      return;
    }
    if (slugAvailable !== true) {
      alert("Please check your URL availability first (it must show green checkmark)");
      return;
    }

    setSaving(true);
    try {
      const portfolioData = {
        user_id: userId,
        slug: slug.toLowerCase().trim(),
        title: data.title.trim(),
        subtitle: data.subtitle.trim(),
        about: data.about.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        location: data.location.trim(),
        profileImage: data.profileImage,
        heroText: data.heroText || '',
        skills: data.skills || [],
        stats: data.stats.filter(s => s.value.trim() !== '') || [],
        services: data.services || [],
        projects: data.projects || [],
        socialMedia: data.socialMedia || [],
        faqItems: data.faqItems || [],
        templateId: templateId,
      };

      await savePortfolio(portfolioData);
      setSaveSuccess(true);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving portfolio:", error);
      setSaving(false);
      alert(`Failed to save portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", shortLabel: "Basic", icon: <User className="w-4 h-4" />, completed: data.title && data.email },
    { id: "skills", label: "Skills", shortLabel: "Skills", icon: <BarChart3 className="w-4 h-4" />, completed: data.skills.length > 0 },
    { id: "stats", label: "Stats", shortLabel: "Stats", icon: <Sparkles className="w-4 h-4" />, completed: data.stats.some(s => s.value.trim() !== '') },
    { id: "services", label: "Services", shortLabel: "Modules", icon: <Cpu className="w-4 h-4" />, completed: data.services.length > 0 },
    { id: "projects", label: "Projects", shortLabel: "Repos", icon: <Code2 className="w-4 h-4" />, completed: data.projects.length > 0 },
    { id: "faq", label: "FAQ", shortLabel: "Docs", icon: <HelpCircle className="w-4 h-4" />, completed: data.faqItems.length > 0 },
    { id: "social", label: "Social", shortLabel: "Links", icon: <Share2 className="w-4 h-4" />, completed: data.socialMedia.length > 0 },
  ];

  const completionPercentage = Math.round(
    (tabs.filter(t => t.completed).length / tabs.length) * 100
  );

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      Cpu: <Cpu className="w-5 h-5" />,
      Code2: <Code2 className="w-5 h-5" />,
      Cloud: <Cloud className="w-5 h-5" />,
      Zap: <Zap className="w-5 h-5" />,
      Database: <Database className="w-5 h-5" />,
      Server: <Server className="w-5 h-5" />,
      Globe: <Globe className="w-5 h-5" />,
      Shield: <Shield className="w-5 h-5" />,
      Layers: <Layers className="w-5 h-5" />,
      Rocket: <Rocket className="w-5 h-5" />,
      Settings: <Settings className="w-5 h-5" />,
    };
    return icons[iconName] || <Code2 className="w-5 h-5" />;
  };

  if (showSuccess) {
    return (
      <PortfolioSuccessScreen
        slug={slug}
        title={data.title}
        onViewPortfolio={() => {
          window.location.href = `/portfolio/${slug}`;
        }}
        onBack={() => {
          setShowSuccess(false);
          setSaveSuccess(false);
          setSlug("");
          setData({
            title: "",
            subtitle: "",
            about: "",
            email: "",
            phone: "",
            location: "",
            profileImage: "",
            heroText: "",
            skills: [],
            stats: [
              { id: "1", value: "", label: "Years Experience" },
              { id: "2", value: "", label: "Projects Completed" },
              { id: "3", value: "", label: "Uptime Average" },
              { id: "4", value: "", label: "Users Served" },
            ],
            services: [],
            projects: [],
            modules: [],
            repos: [],
            docs: [],
            socialMedia: [],
            faqItems: [],
          });
        }}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col bg-gradient-to-br from-void via-midnight to-void"
    >
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-30" />
      
      <div className="sticky top-0 z-30 glass-panel border-b border-neon-cyan/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onBack}
                className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-mono text-slate-300 hover:text-neon-cyan hover:bg-neon-cyan/5 rounded-lg transition-all border border-neon-cyan/30 hover:border-neon-cyan/60"
              >
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">&lt;/BACK&gt;</span>
              </button>
              <div className="h-6 sm:h-8 w-px bg-neon-cyan/30 hidden sm:block" />
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan animate-glow-pulse" />
                  <h1 className="text-sm sm:text-xl font-display font-bold text-white tracking-wide">
                    <span className="text-neon-cyan">&lt;</span>DEV_BUILDER<span className="text-neon-cyan">/&gt;</span>
                  </h1>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-0.5 hidden sm:block">// {templateTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right">
                <div className="text-xs sm:text-sm font-mono font-semibold text-neon-cyan">{completionPercentage}%</div>
                <div className="w-16 sm:w-32 h-1.5 sm:h-2 bg-void rounded-full overflow-hidden mt-0.5 sm:mt-1 border border-neon-cyan/30">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 h-full overflow-y-auto">
          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <div className="inline-flex gap-1 sm:gap-2 p-1 sm:p-1.5 glass-panel rounded-xl border border-neon-cyan/30 min-w-full sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-mono text-xs sm:text-sm transition-all flex-1 sm:flex-none ${
                    activeTab === tab.id
                      ? "text-void bg-gradient-to-br from-neon-cyan to-neon-purple shadow-lg shadow-neon-cyan/25"
                      : "text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/5"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap">
                    {tab.icon}
                    <span className="hidden lg:inline">{tab.label}</span>
                    <span className="lg:hidden">{tab.shortLabel}</span>
                    {tab.completed && (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-neon-green" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "basic" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl glass-panel border border-neon-cyan/30">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/30">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-display font-semibold text-white mb-1 sm:mb-2">
                          <span className="text-neon-cyan">//</span> Your Portfolio URL
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 font-mono mb-3 sm:mb-4">This will be your unique portfolio address</p>
                        
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={slug}
                              onChange={(e) => handleSlugChange(e.target.value)}
                              placeholder="cyber-dev"
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-void border border-neon-cyan/30 rounded-lg sm:rounded-xl text-sm sm:text-base text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 focus:outline-none transition-all"
                            />
                            {slugAvailable === true && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green" />
                              </div>
                            )}
                            {slugAvailable === false && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                              </div>
                            )}
                          </div>
                          <button
                            onClick={checkSlug}
                            disabled={!slug}
                            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-neon-cyan to-neon-purple text-void text-sm sm:text-base font-mono font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg shadow-neon-cyan/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap hover:shadow-neon-cyan/40"
                          >
                            CHECK
                          </button>
                        </div>
                        
                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-mono">
                          <span className="text-slate-400">your-site.com/portfolio/</span>
                          <span className="text-neon-cyan font-medium break-all">{slug || "your-url"}</span>
                        </div>
                        
                        <AnimatePresence>
                          {slugAvailable === true && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 sm:mt-3 flex items-center gap-2 text-neon-green text-xs sm:text-sm font-mono"
                            >
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>AVAILABLE // Ready to deploy</span>
                            </motion.div>
                          )}
                          {slugAvailable === false && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 sm:mt-3 flex items-center gap-2 text-red-400 text-xs sm:text-sm font-mono"
                            >
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="break-words">{slugError}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl glass-panel border border-neon-cyan/30">
                    <h3 className="text-lg font-display font-semibold text-white mb-4">
                      <span className="text-neon-cyan">//</span> Profile Picture
                    </h3>
                    <div className="flex items-center gap-6">
                      {data.profileImage && (
                        <div className="relative group">
                          <img 
                            src={data.profileImage} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-2xl object-cover ring-2 ring-neon-cyan/30"
                          />
                          <div className="absolute inset-0 bg-void/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <span className="text-neon-cyan text-sm font-mono">CHANGE</span>
                          </div>
                        </div>
                      )}
                      <label className="relative cursor-pointer group">
                        <div className="w-32 h-32 border-2 border-dashed border-neon-cyan/30 rounded-2xl flex flex-col items-center justify-center hover:border-neon-cyan transition-all bg-void/50 group-hover:bg-neon-cyan/5">
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-neon-cyan transition-colors" />
                          <span className="text-xs text-slate-400 group-hover:text-neon-cyan font-mono mt-2">UPLOAD</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl glass-panel border border-neon-cyan/30 space-y-5">
                    <h3 className="text-lg font-display font-semibold text-white mb-4">
                      <span className="text-neon-cyan">//</span> System Identity
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-mono text-neon-cyan mb-2">DEV_NAME *</label>
                        <input
                          type="text"
                          placeholder="CYBER_DEV"
                          value={data.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="w-full px-4 py-3 bg-void border border-neon-cyan/30 rounded-xl text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-neon-cyan mb-2">ROLE_TITLE *</label>
                        <input
                          type="text"
                          placeholder="Full-Stack Developer"
                          value={data.subtitle}
                          onChange={(e) => handleBasicChange("subtitle", e.target.value)}
                          className="w-full px-4 py-3 bg-void border border-neon-cyan/30 rounded-xl text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-neon-cyan mb-2">HERO_TEXT</label>
                      <input
                        type="text"
                        placeholder="Hello World. I build the future."
                        value={data.heroText}
                        onChange={(e) => handleBasicChange("heroText", e.target.value)}
                        className="w-full px-4 py-3 bg-void border border-neon-purple/30 rounded-xl text-white font-mono placeholder-slate-500 focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20 focus:outline-none transition-all"
                      />
                      <p className="text-xs text-slate-500 font-mono mt-2">// This text appears with typing animation in hero section</p>
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-neon-cyan mb-2">ABOUT_BIO</label>
                      <textarea
                        placeholder="Engineering resilient, performant web platforms..."
                        value={data.about}
                        onChange={(e) => handleBasicChange("about", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-void border border-neon-cyan/30 rounded-xl text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 focus:outline-none resize-none transition-all"
                      />
                      <p className="text-xs text-slate-500 font-mono mt-2">// {data.about.length} / 500 characters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-mono text-neon-cyan mb-2">EMAIL *</label>
                        <input
                          type="email"
                          placeholder="dev@system.io"
                          value={data.email}
                          onChange={(e) => handleBasicChange("email", e.target.value)}
                          className="w-full px-4 py-3 bg-void border border-neon-cyan/30 rounded-xl text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-neon-cyan mb-2">PHONE</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 0x7F"
                          value={data.phone}
                          onChange={(e) => handleBasicChange("phone", e.target.value)}
                          className="w-full px-4 py-3 bg-void border border-neon-cyan/30 rounded-xl text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-mono text-neon-cyan mb-2">LOCATION</label>
                        <input
                          type="text"
                          placeholder="Remote // Global"
                          value={data.location}
                          onChange={(e) => handleBasicChange("location", e.target.value)}
                          className="w-full px-4 py-3 bg-void border border-neon-cyan/30 rounded-xl text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl glass-panel border border-neon-purple/30 mb-6">
                    <p className="text-sm text-slate-300 font-mono">
                      <span className="text-neon-purple">/**</span> Add your technical skills with proficiency levels. These will display as animated skill bars in the About section. <span className="text-neon-purple">*/</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {data.skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 sm:p-5 rounded-xl glass-panel border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono text-neon-cyan">SKILL[{index}]</span>
                          <button
                            onClick={() => removeSkill(skill.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <label className="block text-xs font-mono text-slate-400 mb-2">NAME</label>
                            <input
                              type="text"
                              placeholder="TypeScript"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">LEVEL: {skill.level}%</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={skill.level}
                              onChange={(e) => updateSkill(skill.id, "level", parseInt(e.target.value))}
                              className="w-full h-2 bg-void rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                            />
                            <div className="mt-2 h-2 bg-void rounded-full overflow-hidden border border-neon-cyan/20">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  skill.color === 'cyan' ? 'bg-neon-cyan' : 
                                  skill.color === 'purple' ? 'bg-neon-purple' : 'bg-neon-green'
                                }`}
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">COLOR</label>
                            <select
                              value={skill.color}
                              onChange={(e) => updateSkill(skill.id, "color", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            >
                              {skillColorOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={addSkill}
                    className="w-full py-4 border-2 border-dashed border-neon-cyan/30 rounded-xl text-neon-cyan font-mono hover:bg-neon-cyan/5 hover:border-neon-cyan/60 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    ADD_SKILL
                  </button>
                </div>
              )}

              {activeTab === "stats" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl glass-panel border border-neon-green/30 mb-6">
                    <p className="text-sm text-slate-300 font-mono">
                      <span className="text-neon-green">/**</span> Add impressive stats that highlight your experience. These display in the About section. <span className="text-neon-green">*/</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.stats.map((stat, index) => (
                      <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 sm:p-5 rounded-xl glass-panel border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all"
                      >
                        <span className="text-xs font-mono text-neon-cyan mb-3 block">STAT[{index}]</span>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">VALUE</label>
                            <input
                              type="text"
                              placeholder="8+"
                              value={stat.value}
                              onChange={(e) => updateStat(stat.id, "value", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-lg text-neon-cyan font-display font-bold placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">LABEL</label>
                            <input
                              type="text"
                              placeholder="Years Experience"
                              value={stat.label}
                              onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl glass-panel border border-neon-cyan/30 mb-6">
                    <p className="text-sm text-slate-300 font-mono">
                      <span className="text-neon-cyan">/**</span> Add your service modules. Choose cyberpunk-styled icons for each. <span className="text-neon-cyan">*/</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {data.services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 sm:p-5 rounded-xl glass-panel border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono text-neon-cyan">MODULE[{index}]</span>
                          <button
                            onClick={() => removeService(service.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">ICON</label>
                            <select
                              value={service.icon}
                              onChange={(e) => updateService(service.id, "icon", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            >
                              {serviceIconOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <div className="mt-2 flex items-center justify-center p-3 bg-void/50 rounded-lg border border-neon-cyan/20">
                              <span className="text-neon-cyan">{getIconComponent(service.icon)}</span>
                            </div>
                          </div>
                          <div className="md:col-span-1">
                            <label className="block text-xs font-mono text-slate-400 mb-2">NAME</label>
                            <input
                              type="text"
                              placeholder="System Architecture"
                              value={service.name}
                              onChange={(e) => updateService(service.id, "name", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-mono text-slate-400 mb-2">DESCRIPTION</label>
                            <textarea
                              placeholder="Designing scalable, fault-tolerant distributed systems..."
                              value={service.description}
                              onChange={(e) => updateService(service.id, "description", e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={addService}
                    className="w-full py-4 border-2 border-dashed border-neon-cyan/30 rounded-xl text-neon-cyan font-mono hover:bg-neon-cyan/5 hover:border-neon-cyan/60 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    ADD_MODULE
                  </button>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl glass-panel border border-neon-purple/30 mb-6">
                    <p className="text-sm text-slate-300 font-mono">
                      <span className="text-neon-purple">/**</span> Add your projects with tech tags. Displayed as repository cards. <span className="text-neon-purple">*/</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {data.projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 sm:p-5 rounded-xl glass-panel border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono text-neon-purple">REPO[{index}]</span>
                          <button
                            onClick={() => removeProject(project.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">PROJECT_NAME</label>
                            <input
                              type="text"
                              placeholder="Neural Trading Platform"
                              value={project.name}
                              onChange={(e) => updateProject(project.id, "name", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">LINK_URL</label>
                            <input
                              type="url"
                              placeholder="https://github.com/..."
                              value={project.link}
                              onChange={(e) => updateProject(project.id, "link", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-xs font-mono text-slate-400 mb-2">DESCRIPTION</label>
                          <textarea
                            placeholder="AI-powered algorithmic trading system..."
                            value={project.description}
                            onChange={(e) => updateProject(project.id, "description", e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">IMAGE_URL</label>
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/..."
                              value={project.image}
                              onChange={(e) => updateProject(project.id, "image", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">TECH_TAGS (comma separated)</label>
                            <input
                              type="text"
                              placeholder="Python, TensorFlow, Redis"
                              value={project.tags.join(", ")}
                              onChange={(e) => updateProject(project.id, "tags", e.target.value.split(",").map(t => t.trim()).filter(t => t))}
                              className="w-full px-3 py-2 bg-void border border-neon-purple/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20 focus:outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={addProject}
                    className="w-full py-4 border-2 border-dashed border-neon-purple/30 rounded-xl text-neon-purple font-mono hover:bg-neon-purple/5 hover:border-neon-purple/60 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    ADD_REPO
                  </button>
                </div>
              )}

              {activeTab === "faq" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl glass-panel border border-neon-green/30 mb-6">
                    <p className="text-sm text-slate-300 font-mono">
                      <span className="text-neon-green">/**</span> Add FAQ entries. These display as documentation-style accordion items. <span className="text-neon-green">*/</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {data.faqItems.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 sm:p-5 rounded-xl glass-panel border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono text-neon-green">DOC[{index}]</span>
                          <button
                            onClick={() => removeFAQ(faq.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">QUESTION</label>
                            <input
                              type="text"
                              placeholder="What is your development process?"
                              value={faq.question}
                              onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">ANSWER</label>
                            <textarea
                              placeholder="I follow an agile methodology..."
                              value={faq.answer}
                              onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={addFAQ}
                    className="w-full py-4 border-2 border-dashed border-neon-green/30 rounded-xl text-neon-green font-mono hover:bg-neon-green/5 hover:border-neon-green/60 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    ADD_DOC
                  </button>
                </div>
              )}

              {activeTab === "social" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl glass-panel border border-neon-cyan/30 mb-6">
                    <p className="text-sm text-slate-300 font-mono">
                      <span className="text-neon-cyan">/**</span> Add your social links. These will appear in the navigation and contact section. <span className="text-neon-cyan">*/</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {data.socialMedia.map((social, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 sm:p-5 rounded-xl glass-panel border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono text-neon-cyan">LINK[{index}]</span>
                          <button
                            onClick={() => removeSocialMedia(index)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">PLATFORM</label>
                            <select
                              value={social.platform}
                              onChange={(e) => updateSocialMedia(index, "platform", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            >
                              {socialPlatforms.map(platform => (
                                <option key={platform} value={platform}>{platform}</option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-mono text-slate-400 mb-2">URL</label>
                            <input
                              type="url"
                              placeholder="https://github.com/username"
                              value={social.url}
                              onChange={(e) => updateSocialMedia(index, "url", e.target.value)}
                              className="w-full px-3 py-2 bg-void border border-neon-cyan/30 rounded-lg text-sm text-white font-mono placeholder-slate-500 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:outline-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={addSocialMedia}
                    className="w-full py-4 border-2 border-dashed border-neon-cyan/30 rounded-xl text-neon-cyan font-mono hover:bg-neon-cyan/5 hover:border-neon-cyan/60 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    ADD_LINK
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="sticky bottom-0 mt-8 pb-4">
            <div className="glass-panel border border-neon-cyan/30 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !slug || slugAvailable !== true}
                  className={`flex-1 py-3 px-6 rounded-xl font-mono font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                    saveSuccess 
                      ? 'bg-neon-green text-void' 
                      : 'bg-gradient-to-r from-neon-cyan to-neon-purple text-void hover:shadow-lg hover:shadow-neon-cyan/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-void/30 border-t-void rounded-full animate-spin" />
                      DEPLOYING...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-5 h-5" />
                      DEPLOYED! REDIRECTING...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      DEPLOY_PORTFOLIO
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevFolioBuilder;
