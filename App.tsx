import React, { useState, useEffect } from "react";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton,
  UserButton, 
  useUser, 
  useAuth 
} from "@clerk/clerk-react";
import { WebGLShader } from "./components/ui/web-gl-shader";
import { Zap, LayoutDashboard, UserCog, Settings, LogOut, Bell, Shield, CreditCard, User, Home, FolderOpen, Star, TrendingUp, Eye, DollarSign, Plus, Trash2, ExternalLink } from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "./components/ui/sidebar";
import { motion } from "framer-motion";
import { cn } from "./lib/utils";
import { PricingCard } from "./components/ui/dark-gradient-pricing";
import { PortfolioBuilder } from "./components/PortfolioBuilder";
import { DevFolioBuilder } from "./components/DevFolio/DevFolioBuilder";
import { TemplateDemo } from "./components/TemplateDemo";
import { PortfolioPublic } from "./components/PortfolioPublic";
import { createOrUpdateUser, getPortfoliosByUserId, deletePortfolio, getUserByClerkId, PortfolioRecord } from "./lib/supabase";

type ViewState = "landing" | "dashboard" | "profile" | "settings" | "pricing" | "logout" | "preview" | "builder" | "demo" | "portfolio" | "my-portfolios";

interface PortfolioData {
  title: string;
  subtitle: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  heroText?: string;
  skills?: Array<{ id: string; name: string; level: number; color: 'cyan' | 'purple' | 'green' }>;
  stats?: Array<{ id: string; value: string; label: string }>;
  services: Array<{ id: string; name: string; description: string; icon: string }>;
  projects: Array<{ id: string; name: string; description: string; image: string; link: string; tags: string[] }>;
  socialMedia: Array<{ platform: string; url: string }>;
  faqItems?: Array<{ id: string; question: string; answer: string }>;
}

interface Template {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  tags: string[];
  fullDescription: string;
  features: string[];
  technologies: string[];
  demoColor?: string;
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewState>("landing");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null);
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/portfolio/")) {
      const slug = path.replace("/portfolio/", "");
      setPortfolioSlug(slug);
      setActiveTab("portfolio");
    }
  }, []);

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (isSignedIn && user) {
        try {
          const userData = await createOrUpdateUser({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            first_name: user.firstName || undefined,
            last_name: user.lastName || undefined,
            profile_image: user.imageUrl || undefined
          });
          if (userData?.id) {
            setDbUserId(userData.id);
          }
        } catch (error) {
          console.error('Error syncing user to Supabase:', error);
        }
      }
    };

    if (isUserLoaded) {
      syncUserToSupabase();
    }
  }, [isSignedIn, user, isUserLoaded]);

  const links = [
    {
      label: "Home",
      href: "#",
      icon: <Home className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveTab("landing")
    },
    {
      label: "Templates",
      href: "#",
      icon: <LayoutDashboard className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveTab("dashboard")
    },
    {
      label: "My Portfolios",
      href: "#",
      icon: <FolderOpen className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveTab("my-portfolios"),
      requiresAuth: true
    },
    {
      label: "Pricing",
      href: "#",
      icon: <DollarSign className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveTab("pricing")
    },
    {
      label: "Profile",
      href: "#",
      icon: <UserCog className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveTab("profile"),
      requiresAuth: true
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
      onClick: () => setActiveTab("settings"),
      requiresAuth: true
    },
  ];

  const visibleLinks = links.filter(link => !link.requiresAuth || isSignedIn);

  const renderContent = () => {
    switch (activeTab) {
      case "landing":
        return <LandingContent onStart={() => setActiveTab("dashboard")} />;
      case "dashboard":
        return <DashboardContent 
          onPreview={(template) => {
            setSelectedTemplate(template);
            setActiveTab("preview");
          }}
          onUseTemplate={(template) => {
            setSelectedTemplate(template);
            setActiveTab("builder");
          }}
        />;
      case "my-portfolios":
        return <MyPortfoliosContent userId={dbUserId} onCreateNew={() => setActiveTab("dashboard")} />;
      case "preview":
        return (
          <div className="w-full h-full overflow-y-auto">
            <TemplatePreviewContent 
              template={selectedTemplate} 
              onBack={() => setActiveTab("dashboard")}
              onUseTemplate={() => {
                if (selectedTemplate) {
                  setActiveTab("builder");
                }
              }}
              onViewDemo={() => {
                if (selectedTemplate) {
                  setActiveTab("demo");
                }
              }}
            />
          </div>
        );
      case "builder":
        if (!isSignedIn) {
          return <AuthRequiredContent message="Sign in to create your portfolio" onBack={() => setActiveTab("dashboard")} />;
        }
        return (
          <div className="w-full h-full overflow-y-auto">
            {selectedTemplate ? (
              selectedTemplate.id === 2 ? (
                <DevFolioBuilder
                  templateId={selectedTemplate.id}
                  templateTitle={selectedTemplate.title}
                  userId={dbUserId || undefined}
                  onSave={(data) => {
                    setPortfolioData(data);
                  }}
                  onBack={() => setActiveTab("preview")}
                />
              ) : (
                <PortfolioBuilder
                  templateId={selectedTemplate.id}
                  templateTitle={selectedTemplate.title}
                  userId={dbUserId || undefined}
                  onSave={(data) => {
                    setPortfolioData(data);
                  }}
                  onBack={() => setActiveTab("preview")}
                />
              )
            ) : null}
          </div>
        );
      case "demo":
        return (
          <div className="w-full h-full overflow-y-auto">
            {selectedTemplate ? (
              <TemplateDemo
                templateId={selectedTemplate.id}
                templateTitle={selectedTemplate.title}
                data={portfolioData || undefined}
                onBack={() => setActiveTab("preview")}
              />
            ) : null}
          </div>
        );
      case "pricing":
        return <PricingContent />;
      case "profile":
        if (!isSignedIn) {
          return <AuthRequiredContent message="Sign in to view your profile" onBack={() => setActiveTab("landing")} />;
        }
        return <ProfileContent />;
      case "settings":
        if (!isSignedIn) {
          return <AuthRequiredContent message="Sign in to access settings" onBack={() => setActiveTab("landing")} />;
        }
        return <SettingsContent />;
      case "portfolio":
        return portfolioSlug ? (
          <PortfolioPublic slug={portfolioSlug} />
        ) : null;
      case "logout":
        return <LogoutContent onReturn={() => setActiveTab("landing")} />;
      default:
        return <LandingContent onStart={() => setActiveTab("dashboard")} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black dark">
      <WebGLShader />

      <div className="relative z-10 w-full h-full flex flex-col md:flex-row bg-transparent overflow-hidden">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-transparent border-r border-white/5">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {visibleLinks.map((link, idx) => (
                  <SidebarLink 
                    key={idx} 
                    link={link} 
                    className={
                      activeTab === link.label.toLowerCase() || 
                      (link.label === "Home" && activeTab === "landing") ||
                      (link.label === "Templates" && activeTab === "dashboard")
                        ? "bg-white/10 rounded-md px-2" 
                        : "px-2"
                    } 
                  />
                ))}
              </div>
            </div>
            <div className="px-2">
              <SignedIn>
                <div className="flex items-center gap-2 py-2">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8"
                      }
                    }}
                  />
                  {open && user && (
                    <div className="flex flex-col">
                      <span className="text-sm text-white truncate max-w-[120px]">
                        {user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0]}
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-[120px]">
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  )}
                </div>
              </SignedIn>
              <SignedOut>
                <div className="flex flex-col gap-2">
                  <SignInButton mode="modal">
                    <button className="w-full py-2 px-3 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
                      Sign In
                    </button>
                  </SignInButton>
                  {open && (
                    <SignUpButton mode="modal">
                      <button className="w-full py-2 px-3 text-sm bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  )}
                </div>
              </SignedOut>
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex flex-1 h-full p-2 md:p-10 transition-all duration-500">
          <div className={cn(
            "rounded-tl-2xl border border-white/10",
            "bg-transparent",
            "flex flex-col gap-2 flex-1 w-full h-full overflow-hidden relative"
          )}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

const AuthRequiredContent = ({ message, onBack }: { message: string; onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-sky-500/10 flex items-center justify-center mb-6 mx-auto border border-sky-500/20">
          <User className="w-10 h-10 text-sky-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
        <p className="text-slate-400 mb-6">
          Create an account to save your portfolio and access it from anywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <SignUpButton mode="modal">
            <button className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors font-medium">
              Sign Up Free
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/10">
              Sign In
            </button>
          </SignInButton>
        </div>
        <button 
          onClick={onBack}
          className="mt-6 text-slate-400 hover:text-white text-sm underline"
        >
          Go Back
        </button>
      </div>
    </motion.div>
  );
};

const LandingContent = ({ onStart }: { onStart: () => void }) => {
  const { isSignedIn } = useAuth();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="text-center space-y-4 relative z-20 px-4">
          <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Create Your Portfolio<br /> For Free
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Showcase your work with our next-gen neural infrastructure. Build, deploy, and scale your personal brand in minutes.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 z-40">
          <button 
            onClick={onStart}
            className="bg-slate-800 w-[280px] md:w-[320px] h-[80px] md:h-[100px] no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
          >
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <div className="relative flex justify-center w-full h-full text-center space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-sky-400 mr-2" />
              <span className="md:text-3xl text-xl inline-block bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 via-neutral-600 to-neutral-300">
                Start Building
              </span>
            </div>
          </button>
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="bg-sky-600 hover:bg-sky-500 w-[280px] md:w-[200px] h-[60px] md:h-[100px] rounded-full text-white font-semibold text-xl transition-colors shadow-lg shadow-sky-900/30">
                Sign Up Free
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
        
        <SignedOut>
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <SignInButton mode="modal">
              <button className="text-sky-400 hover:text-sky-300 underline">
                Sign In
              </button>
            </SignInButton>
          </p>
        </SignedOut>
      </div>
    </motion.div>
  );
};

const MyPortfoliosContent = ({ userId, onCreateNew }: { userId: string | null; onCreateNew: () => void }) => {
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (userId) {
        setLoading(true);
        const data = await getPortfoliosByUserId(userId);
        setPortfolios(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, [userId]);

  const handleDelete = async (slug: string) => {
    if (!userId) return;
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    
    setDeleting(slug);
    const success = await deletePortfolio(slug, userId);
    if (success) {
      setPortfolios(prev => prev.filter(p => p.slug !== slug));
    }
    setDeleting(null);
  };

  const getPortfolioUrl = (slug: string) => {
    return `${window.location.origin}/portfolio/${slug}`;
  };

  if (!userId) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in to view your portfolios</h2>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors">
              Sign In
            </button>
          </SignInButton>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full p-4 md:p-8 overflow-y-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">My Portfolios</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and view all your created portfolios</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> Create New Portfolio
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No portfolios yet</h3>
          <p className="text-slate-400 mb-6">Create your first portfolio to get started</p>
          <button 
            onClick={onCreateNew}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors"
          >
            Create Portfolio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <motion.div 
              key={portfolio.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all"
            >
              <div className="h-32 w-full overflow-hidden relative bg-gradient-to-br from-sky-900/50 to-purple-900/50">
                {portfolio.profileImage && (
                  <img 
                    src={portfolio.profileImage} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    {portfolio.profileImage ? (
                      <img 
                        src={portfolio.profileImage} 
                        alt={portfolio.title}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-1">{portfolio.title}</h3>
                <p className="text-sm text-slate-400 mb-2">{portfolio.subtitle}</p>
                <p className="text-xs text-slate-500 mb-4 truncate">/{portfolio.slug}</p>
                
                <div className="flex gap-2">
                  <a 
                    href={getPortfolioUrl(portfolio.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" /> View
                  </a>
                  <button 
                    onClick={() => handleDelete(portfolio.slug)}
                    disabled={deleting === portfolio.slug}
                    className="py-2 px-3 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {deleting === portfolio.slug ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-400"></div>
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const DashboardContent = ({ onPreview, onUseTemplate }: { onPreview: (template: Template) => void; onUseTemplate: (template: Template) => void }) => {
  const templates: Template[] = [
    {
      id: 1,
      title: "Minimalist Portfolio",
      category: "Creative",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Clean, whitespace-heavy design perfect for photographers and designers.",
      tags: ["React", "Tailwind", "Motion"],
      fullDescription: "A beautifully crafted minimalist portfolio template that lets your work speak for itself. With generous whitespace and elegant typography, this design is perfect for creative professionals who want a clean, professional presence online.",
      features: ["Smooth scrolling", "Responsive design", "Mobile optimized", "Fast loading", "SEO friendly", "Dark mode support"],
      technologies: ["React", "Tailwind CSS", "Framer Motion"]
    },
    {
      id: 2,
      title: "DevFolio Dark",
      category: "Developer",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "A dark-themed, code-centric portfolio for software engineers.",
      tags: ["Next.js", "TypeScript", "Dark Mode"],
      fullDescription: "Built for developers by developers. This template features a dark theme that's easy on the eyes during long browsing sessions. Showcase your GitHub projects, code snippets, and technical achievements with style.",
      features: ["GitHub integration", "Project showcase", "Blog integration", "Code syntax highlighting", "Experience timeline", "Skills matrix"],
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX"]
    },
    {
      id: 3,
      title: "Agency Modern",
      category: "Business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Professional layout for agencies and small businesses.",
      tags: ["Agency", "Corporate", "SaaS"],
      fullDescription: "A professional template designed for agencies and small businesses. Features modern design patterns, client testimonials section, services showcase, and lead generation forms to help grow your business.",
      features: ["Services showcase", "Team profiles", "Client testimonials", "Case studies", "Contact forms", "Analytics dashboard"],
      technologies: ["React", "Tailwind CSS", "Headless CMS integration"]
    },
    {
      id: 4,
      title: "SaaS Landing",
      category: "Product",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "High-conversion landing page template for SaaS products.",
      tags: ["Marketing", "Conversion", "Startup"],
      fullDescription: "Designed to convert visitors into customers. This SaaS landing page template includes pricing tiers, feature comparisons, FAQ sections, and clear call-to-action buttons optimized for maximum conversions.",
      features: ["Pricing calculator", "Feature comparison", "FAQ section", "Social proof", "Email capture", "Payment integration"],
      technologies: ["React", "Stripe API", "Email service integration"]
    },
    {
      id: 5,
      title: "3D Interactive",
      category: "Creative",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Immersive 3D experience using Three.js and WebGL.",
      tags: ["Three.js", "WebGL", "Interactive"],
      fullDescription: "Take your portfolio to the next level with stunning 3D effects and interactive elements. This template uses WebGL and Three.js to create an immersive experience that will impress visitors.",
      features: ["3D animations", "Mouse tracking", "Particle effects", "WebGL shaders", "Performance optimized", "Touch support"],
      technologies: ["Three.js", "WebGL", "GLSL", "React"]
    },
    {
      id: 6,
      title: "Bento Grid",
      category: "Personal",
      image: "https://images.unsplash.com/photo-1481487484168-9b995ecc168d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Trendy bento-box style layout for showcasing multiple projects.",
      tags: ["Grid", "Modern", "Personal"],
      fullDescription: "A modern take on portfolio design using the popular bento box layout. Perfect for showcasing multiple projects, skills, and achievements in an organized yet visually appealing grid layout.",
      features: ["Responsive grid", "Image galleries", "Project cards", "Skill tags", "Social links", "Light/Dark theme"],
      technologies: ["React", "Tailwind CSS", "CSS Grid", "Framer Motion"]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full p-4 md:p-8 overflow-y-auto"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Free Portfolio Templates</h2>
          <p className="text-slate-400 text-sm mt-1">Choose a professionally designed template to kickstart your personal website.</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/50 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          <Star className="w-4 h-4" /> Premium Themes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {templates.map((template, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-white/20 transition-all flex flex-col"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
              <img 
                src={template.image} 
                alt={template.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white border border-white/10">
                {template.category}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-2">{template.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{template.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.map((tag, t) => (
                    <span key={t} className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-300 border border-white/5">
                        {tag}
                    </span>
                ))}
              </div>

              <div className="mt-auto flex gap-2">
                <button 
                  onClick={() => onUseTemplate(template)}
                  className="flex-1 py-2 text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors shadow-lg shadow-sky-900/20"
                >
                  Use Template
                </button>
                <button 
                  onClick={() => onPreview(template)}
                  className="flex-1 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const PricingContent = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full p-4 md:p-8 overflow-y-auto flex flex-col items-center"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Pricing
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto">
            Use it for free for yourself, upgrade when your team needs advanced control.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 pb-20">
          <PricingCard
            tier="Free"
            price="$0/mo"
            bestFor="Best for 1-5 users"
            CTA="Get started free"
            benefits={[
              { text: "1 Portfolio Website", checked: true },
              { text: "Free Templates Access", checked: true },
              { text: "Subdomain (.acet.app)", checked: true },
              { text: "Community Support", checked: true },
              { text: "Custom Domain", checked: false },
              { text: "Remove Branding", checked: false },
            ]}
          />
          <PricingCard
            tier="Pro"
            price="$12/mo"
            bestFor="Best for 5-50 users"
            CTA="14-day free trial"
            benefits={[
              { text: "5 Portfolio Websites", checked: true },
              { text: "All Templates Access", checked: true },
              { text: "Custom Domain", checked: true },
              { text: "Remove Branding", checked: true },
              { text: "Basic Analytics", checked: true },
              { text: "Priority Support", checked: false },
            ]}
          />
          <PricingCard
            tier="Agency"
            price="Contact us"
            bestFor="Best for 50+ users"
            CTA="Contact us"
            benefits={[
              { text: "Unlimited Portfolios", checked: true },
              { text: "White-label Solution", checked: true },
              { text: "Custom Domain", checked: true },
              { text: "Remove Branding", checked: true },
              { text: "Advanced Analytics", checked: true },
              { text: "Dedicated Success Manager", checked: true },
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ProfileContent = () => {
  const { user } = useUser();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full p-8 overflow-y-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-6">User Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col items-center text-center">
          <img
            src={user?.imageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"}
            className="w-32 h-32 rounded-full border-4 border-white/10 mb-4 object-cover"
            alt="Profile"
          />
          <h3 className="text-xl font-semibold text-white">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-sm text-slate-400 mb-4">{user?.primaryEmailAddress?.emailAddress}</p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs">Member</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Free</span>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                <p className="text-white">{user?.fullName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email</label>
                <p className="text-white">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">User ID</label>
                <p className="text-white text-xs truncate">{user?.id}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Joined</label>
                <p className="text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Security
            </h4>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-300">Two-Factor Authentication</span>
              <span className={`text-sm ${user?.twoFactorEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-300">Email Verified</span>
              <span className="text-green-400 text-sm">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SettingsContent = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full p-8 overflow-y-auto"
    >
      <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
      <div className="max-w-3xl space-y-6">
        
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Bell className="w-5 h-5" /> Notifications
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {['Email Notifications', 'Push Notifications', 'Marketing Emails', 'Security Alerts'].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-slate-300">{item}</span>
                <div className={`w-10 h-6 rounded-full relative cursor-pointer ${i < 2 ? 'bg-sky-600' : 'bg-slate-700'}`}>
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${i < 2 ? 'left-5' : 'left-1'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Billing
            </h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
              <div>
                <p className="text-white font-medium">Free Plan</p>
                <p className="text-xs text-slate-400">$0/month</p>
              </div>
              <button className="px-3 py-1.5 text-xs bg-white text-black font-bold rounded hover:bg-slate-200 transition">Upgrade</button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const LogoutContent = ({ onReturn }: { onReturn: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex flex-col items-center justify-center text-center p-4"
    >
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
        <LogOut className="w-10 h-10 text-red-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Signed Out</h2>
      <p className="text-slate-400 max-w-xs mb-8">
        You have been safely logged out of your session. You can close this window or log back in.
      </p>
      <button 
        onClick={onReturn}
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition shadow-lg shadow-white/10"
      >
        Log Back In
      </button>
    </motion.div>
  );
};

export const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
  );
};

const TemplatePreviewContent = ({ 
  template, 
  onBack,
  onUseTemplate,
  onViewDemo
}: { 
  template: Template | null; 
  onBack: () => void;
  onUseTemplate: () => void;
  onViewDemo: () => void;
}) => {
  if (!template) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full p-4 md:p-8 overflow-y-auto flex flex-col"
    >
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-white/10 hover:border-white/20 w-fit"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 bg-white/5">
            <img
              src={template.image}
              alt={template.title}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {template.title}
              </h1>
              <p className="text-xl text-slate-300">
                {template.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
              <p className="text-slate-300 leading-relaxed">
                {template.fullDescription}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {template.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-sky-400 mt-2 flex-shrink-0" />
                    <span className="text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {template.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-sm border border-sky-500/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Category</p>
              <p className="text-2xl font-bold text-white">{template.category}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Tags</p>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/10 text-slate-300 rounded text-xs border border-white/5 hover:border-white/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={onUseTemplate}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-sky-900/20"
              >
                Use This Template
              </button>
              <button 
                onClick={onViewDemo}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
              >
                View Demo
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs font-medium">Ready to Use</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Template Type</span>
                <span className="text-white font-medium">{template.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Responsive</span>
                <span className="text-sky-300">✓ Mobile Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};