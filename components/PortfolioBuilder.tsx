import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Upload, Check, AlertCircle, ArrowRight, Sparkles, Save, Eye } from "lucide-react";
import { savePortfolio, checkSlugExists } from "../lib/supabase";
import { PortfolioSuccessScreen } from "./PortfolioSuccessScreen";

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

interface PortfolioBuilderProps {
  templateId: number;
  templateTitle: string;
  userId?: string;
  onSave?: (data: PortfolioData) => void;
  onBack: () => void;
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ 
  templateId, 
  templateTitle,
  userId,
  onSave, 
  onBack 
}) => {
  const [data, setData] = useState<PortfolioData>({
    title: "",
    subtitle: "",
    about: "",
    email: "",
    phone: "",
    location: "",
    profileImage: "",
    heroText: "",
    services: [],
    projects: [],
    socialMedia: [],
    faqItems: [],
  });

  const [activeTab, setActiveTab] = useState<"basic" | "services" | "projects" | "social" | "faq" | "animation">("basic");
  const [slug, setSlug] = useState("");
  const [slugError, setSlugError] = useState<string | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBasicChange = (field: keyof Omit<PortfolioData, "services" | "projects" | "socialMedia">, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    setData(prev => ({
      ...prev,
      services: [...prev.services, { id: Date.now().toString(), name: "", description: "", icon: "🎯" }]
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

  const addSocialMedia = () => {
    setData(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: "", url: "" }]
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

  const addFAQ = () => {
    setData(prev => ({
      ...prev,
      faqItems: [...(prev.faqItems || []), { id: Date.now().toString(), question: "", answer: "" }]
    }));
  };

  const updateFAQ = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      faqItems: (prev.faqItems || []).map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const removeFAQ = (id: string) => {
    setData(prev => ({
      ...prev,
      faqItems: (prev.faqItems || []).filter(f => f.id !== id)
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
      alert("Please enter a portfolio title");
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

  const serviceIcons = ["🎯", "💻", "🎨", "📱", "🚀", "📊", "🔧", "✨", "🔥", "⚡", "💡", "🌟"];

  const tabs = [
    { id: "basic", label: "Basic Info", shortLabel: "Basic", completed: data.title && data.email },
    { id: "services", label: "Services", shortLabel: "Services", completed: data.services.length > 0 },
    { id: "projects", label: "Projects", shortLabel: "Projects", completed: data.projects.length > 0 },
    { id: "faq", label: "FAQ", shortLabel: "FAQ", completed: (data.faqItems?.length || 0) > 0 },
    { id: "animation", label: "Animation", shortLabel: "Animation", completed: !!data.heroText },
    { id: "social", label: "Social", shortLabel: "Social", completed: data.socialMedia.length > 0 }
  ];

  const completionPercentage = Math.round(
    (tabs.filter(t => t.completed).length / tabs.length) * 100
  );

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
            services: [],
            projects: [],
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
      className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
    >
      {/* Premium Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onBack}
                className="group flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-white/10 hover:border-white/20"
              >
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-6 sm:h-8 w-px bg-white/10 hidden sm:block" />
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
                  <h1 className="text-sm sm:text-xl font-bold text-white">Portfolio Builder</h1>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 hidden sm:block">Using {templateTitle}</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right">
                <div className="text-xs sm:text-sm font-semibold text-white">{completionPercentage}%</div>
                <div className="w-16 sm:w-32 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden mt-0.5 sm:mt-1">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-500"
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 h-full overflow-y-auto">
          {/* Premium Tab Navigation */}
          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <div className="inline-flex gap-1 sm:gap-2 p-1 sm:p-1.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm min-w-full sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all flex-1 sm:flex-none ${
                    activeTab === tab.id
                      ? "text-white bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/25"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap">
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    {tab.completed && (
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Portfolio URL Section */}
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-white/10">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-sky-500/10 flex items-center justify-center">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">Your Portfolio URL</h3>
                        <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">This will be your unique portfolio address</p>
                        
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={slug}
                              onChange={(e) => handleSlugChange(e.target.value)}
                              placeholder="my-portfolio"
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                            />
                            {slugAvailable === true && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
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
                            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                          >
                            Check
                          </button>
                        </div>
                        
                        <div className="mt-2 sm:mt-3 text-xs sm:text-sm">
                          <span className="text-slate-400">your-site.com/portfolio/</span>
                          <span className="text-white font-medium break-all">{slug || "your-url"}</span>
                        </div>
                        
                        <AnimatePresence>
                          {slugAvailable === true && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 sm:mt-3 flex items-center gap-2 text-green-400 text-xs sm:text-sm font-medium"
                            >
                              <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Perfect! This URL is available</span>
                            </motion.div>
                          )}
                          {slugAvailable === false && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mt-2 sm:mt-3 flex items-center gap-2 text-red-400 text-xs sm:text-sm font-medium"
                            >
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="break-words">{slugError}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {/* Profile Image Section */}
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
                    <div className="flex items-center gap-6">
                      {data.profileImage && (
                        <div className="relative group">
                          <img 
                            src={data.profileImage} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-2xl object-cover ring-2 ring-sky-500/20"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <span className="text-white text-sm">Change</span>
                          </div>
                        </div>
                      )}
                      <label className="relative cursor-pointer group">
                        <div className="w-32 h-32 border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center hover:border-sky-500 transition-all bg-slate-900/50 group-hover:bg-sky-500/5">
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-sky-400 transition-colors" />
                          <span className="text-xs text-slate-400 group-hover:text-sky-400 mt-2">Upload Image</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Personal Info Section */}
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10 space-y-5">
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={data.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Professional Title *</label>
                        <input
                          type="text"
                          placeholder="Senior Product Designer"
                          value={data.subtitle}
                          onChange={(e) => handleBasicChange("subtitle", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">About Me</label>
                      <textarea
                        placeholder="Share your story, expertise, and what makes you unique..."
                        value={data.about}
                        onChange={(e) => handleBasicChange("about", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none resize-none transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-2">{data.about.length} / 500 characters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={data.email}
                          onChange={(e) => handleBasicChange("email", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={data.phone}
                          onChange={(e) => handleBasicChange("phone", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                        <input
                          type="text"
                          placeholder="San Francisco, CA"
                          value={data.location}
                          onChange={(e) => handleBasicChange("location", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === "services" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 mb-6">
                    <p className="text-sm text-sky-200">💡 Add the services or skills you offer. Each service should highlight your expertise.</p>
                  </div>

                  {data.services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 rounded-2xl bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <select
                            value={service.icon}
                            onChange={(e) => updateService(service.id, "icon", e.target.value)}
                            className="text-2xl px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:border-sky-500 transition-all cursor-pointer"
                          >
                            {serviceIcons.map(icon => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                          <div className="text-sm font-medium text-slate-400">Service Icon</div>
                        </div>
                        <button
                          onClick={() => removeService(service.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-all group"
                        >
                          <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Service Name</label>
                        <input
                          type="text"
                          placeholder="e.g., UI/UX Design"
                          value={service.name}
                          onChange={(e) => updateService(service.id, "name", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                          placeholder="Describe what you offer in this service..."
                          value={service.description}
                          onChange={(e) => updateService(service.id, "description", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none resize-none transition-all"
                        />
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={addService}
                    className="w-full py-4 px-6 bg-gradient-to-r from-sky-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 text-sky-300 font-semibold rounded-xl border-2 border-dashed border-sky-500/30 hover:border-sky-500/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Service
                  </button>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 mb-6">
                    <p className="text-sm text-sky-200">🚀 Showcase your best work. Add screenshots, descriptions, and links to your projects.</p>
                  </div>

                  {data.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 rounded-2xl bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          Project Details
                        </h4>
                        <button
                          onClick={() => removeProject(project.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-all group"
                        >
                          <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                      
                      {/* Project Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Project Image</label>
                        {project.image ? (
                          <div className="relative group">
                            <img 
                              src={project.image} 
                              alt={project.name} 
                              className="w-full h-48 object-cover rounded-xl ring-2 ring-sky-500/20"
                            />
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer">
                              <span className="text-white font-medium">Change Image</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      updateProject(project.id, "image", event.target?.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden" 
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="relative cursor-pointer block">
                            <div className="w-full h-48 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center hover:border-sky-500 transition-all bg-slate-900/50 hover:bg-sky-500/5">
                              <Upload className="w-8 h-8 text-slate-400 mb-2" />
                              <span className="text-sm text-slate-400">Click to upload project image</span>
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    updateProject(project.id, "image", event.target?.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden" 
                            />
                          </label>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                          <input
                            type="text"
                            placeholder="e.g., E-commerce Platform"
                            value={project.name}
                            onChange={(e) => updateProject(project.id, "name", e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Project Link</label>
                          <input
                            type="url"
                            placeholder="https://example.com"
                            value={project.link}
                            onChange={(e) => updateProject(project.id, "link", e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                          placeholder="Describe your project, your role, and the impact..."
                          value={project.description}
                          onChange={(e) => updateProject(project.id, "description", e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none resize-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Technologies Used</label>
                        <input
                          type="text"
                          placeholder="React, TypeScript, Node.js"
                          value={Array.isArray(project.tags) ? project.tags.join(", ") : ""}
                          onChange={(e) => updateProject(project.id, "tags", e.target.value.split(",").map(t => t.trim()))}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-2">Separate with commas</p>
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={addProject}
                    className="w-full py-4 px-6 bg-gradient-to-r from-sky-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 text-sky-300 font-semibold rounded-xl border-2 border-dashed border-sky-500/30 hover:border-sky-500/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Project
                  </button>
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === "faq" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 mb-6">
                    <p className="text-sm text-sky-200">❓ Add frequently asked questions to help visitors learn more about your services.</p>
                  </div>

                  {(data.faqItems || []).map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-slate-300">Question {index + 1}</label>
                        <button
                          onClick={() => removeFAQ(faq.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g., What is your design process?"
                        value={faq.question}
                        onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                      />
                      <textarea
                        placeholder="Your answer..."
                        value={faq.answer}
                        onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none resize-none transition-all"
                      />
                    </motion.div>
                  ))}

                  <button
                    onClick={addFAQ}
                    className="w-full py-4 px-6 bg-gradient-to-r from-sky-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 text-sky-300 font-semibold rounded-xl border-2 border-dashed border-sky-500/30 hover:border-sky-500/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add FAQ Item
                  </button>
                </div>
              )}

              {/* Animation Tab */}
              {activeTab === "animation" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 mb-6">
                    <p className="text-sm text-sky-200">🎬 Add animated text that moves across the black banner section. This text will appear to move from right to left.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        🎨 Banner Text Items (each item will scroll)
                      </label>
                      <textarea
                        placeholder="Enter text items separated by commas. Example: Web Design, Brand Identity, UX Research"
                        value={data.heroText || ""}
                        onChange={(e) => handleBasicChange("heroText", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none resize-none transition-all"
                      />
                      <p className="text-xs text-slate-500 mt-2">💡 Tip: These items will be displayed in a scrolling marquee banner between your hero section and about section.</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                      <p className="text-xs text-slate-400">
                        <strong>Preview:</strong> Your text will scroll like: {data.heroText?.split(",").slice(0, 2).join(" • ") || "Sample • Items • Here"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === "social" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 mb-6">
                    <p className="text-sm text-sky-200">🔗 Connect your social profiles so people can find you across the web.</p>
                  </div>

                  {data.socialMedia.map((social, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-3 items-end p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
                        <select
                          value={social.platform}
                          onChange={(e) => updateSocialMedia(index, "platform", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        >
                          <option value="">Select Platform</option>
                          <option value="Twitter">Twitter</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="GitHub">GitHub</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Dribbble">Dribbble</option>
                          <option value="Behance">Behance</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Profile URL</label>
                        <input
                          type="url"
                          placeholder="https://twitter.com/username"
                          value={social.url}
                          onChange={(e) => updateSocialMedia(index, "url", e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={() => removeSocialMedia(index)}
                        className="p-3 hover:bg-red-500/10 rounded-xl transition-all group flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
                      </button>
                    </motion.div>
                  ))}

                  <button
                    onClick={addSocialMedia}
                    className="w-full py-4 px-6 bg-gradient-to-r from-sky-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 text-sky-300 font-semibold rounded-xl border-2 border-dashed border-sky-500/30 hover:border-sky-500/50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Add Social Link
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Premium Sticky Footer */}
      <div className="sticky bottom-0 z-30 backdrop-blur-xl bg-slate-900/90 border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-0">
            <button
              onClick={onBack}
              disabled={saving}
              className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base text-slate-300 hover:text-white hover:bg-white/5 rounded-lg sm:rounded-xl transition-all font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:block text-sm text-slate-400">
                {slugAvailable ? (
                  <span className="text-green-400">✓ Ready to publish</span>
                ) : (
                  <span>Check your URL before saving</span>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={saving || saveSuccess || !slugAvailable}
                className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all shadow-lg shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2"
              >
                {saving && (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full" 
                  />
                )}
                {saveSuccess && <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                {!saving && !saveSuccess && <Save className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="whitespace-nowrap">
                  {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save & Publish"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 right-8 z-50 p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold">Portfolio Saved!</div>
              <div className="text-sm opacity-90">Redirecting to your portfolio...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
