import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { MinimalistPortfolio } from "./MinimalistPortfolio";
import CyberDevFolio from "./DevFolio/CyberDevFolio";

interface DemoData {
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

interface TemplateDemoProps {
  templateId: number;
  templateTitle: string;
  data?: DemoData;
  onBack: () => void;
}

const MinimalistTemplate: React.FC<{ data?: DemoData; onBack: () => void }> = ({ data, onBack }) => {
  const demoData = data || {
    title: "John Designer",
    subtitle: "Creative & UI/UX Designer",
    about: "Crafting beautiful digital experiences that solve real problems.",
    email: "john@example.com",
    location: "San Francisco, CA",
    phone: "+1 (555) 123-4567",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    services: [
      { id: "1", name: "UI Design", description: "Beautiful and functional interfaces", icon: "🎨" },
      { id: "2", name: "UX Research", description: "Understanding user needs", icon: "📊" },
    ],
    projects: [
      { id: "1", name: "E-Commerce Platform", description: "Redesigned checkout flow", image: "https://images.unsplash.com/photo-1460925895917-adf4e7c2e1c3?w=400&h=300&fit=crop", link: "#", tags: ["Design", "Research"] },
    ],
    socialMedia: [
      { platform: "Twitter", url: "#" },
      { platform: "LinkedIn", url: "#" },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white text-gray-900">
      <button onClick={onBack} className="fixed top-6 right-6 z-50 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">← Back</button>
      
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        {demoData.profileImage && <img src={demoData.profileImage} alt={demoData.title} className="w-32 h-32 rounded-full object-cover mb-8" />}
        <h1 className="text-6xl font-bold mb-4">{demoData.title}</h1>
        <p className="text-2xl text-gray-600 mb-8">{demoData.subtitle}</p>
        <p className="text-lg text-gray-500 max-w-2xl">{demoData.about}</p>
        <div className="mt-12 flex gap-4">
          <a href={`mailto:${demoData.email}`} className="px-8 py-3 bg-gray-900 text-white rounded font-medium hover:bg-gray-800">Get in Touch</a>
          <a href="#projects" className="px-8 py-3 bg-gray-200 text-gray-900 rounded font-medium hover:bg-gray-300">View Work</a>
        </div>
      </div>

      {demoData.services.length > 0 && (
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {demoData.services.map(service => (
                <div key={service.id} className="p-6 bg-white border border-gray-200 rounded">
                  <span className="text-3xl mb-2 block">{service.icon}</span>
                  <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {demoData.projects.length > 0 && (
        <section id="projects" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12">Featured Projects</h2>
            <div className="space-y-12">
              {demoData.projects.map(project => (
                <div key={project.id} className="flex gap-8 items-center">
                  {project.image && <img src={project.image} alt={project.name} className="w-1/2 h-64 object-cover rounded" />}
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{project.name}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex gap-2 flex-wrap mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">{tag}</span>
                      ))}
                    </div>
                    {project.link && <a href={project.link} className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all">View Project <ArrowRight className="w-4 h-4" /></a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center gap-6 mb-6">
            {demoData.socialMedia.map(social => (
              <a key={social.platform} href={social.url} className="hover:text-gray-300">
                {social.platform === "Twitter" && <Twitter className="w-6 h-6" />}
                {social.platform === "LinkedIn" && <Linkedin className="w-6 h-6" />}
                {social.platform === "GitHub" && <Github className="w-6 h-6" />}
              </a>
            ))}
          </div>
          <p className="text-gray-400">© 2024 {demoData.title}. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
};

export const TemplateDemo: React.FC<TemplateDemoProps> = ({ templateId, templateTitle, data, onBack }) => {
  if (templateId === 1) {
    return <MinimalistPortfolio data={data} onBack={onBack} />;
  } else if (templateId === 2) {
    return <CyberDevFolio data={data} onBack={onBack} />;
  }
  
  return <CyberDevFolio data={data} onBack={onBack} />;
};
