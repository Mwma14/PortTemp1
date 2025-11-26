import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPortfolioBySlug } from "../lib/supabase";
import { MinimalistPortfolio } from "./MinimalistPortfolio";
import CyberDevFolio from "./DevFolio/CyberDevFolio";

interface PortfolioPublicProps {
  slug: string;
}

export const PortfolioPublic: React.FC<PortfolioPublicProps> = ({ slug }) => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        console.log('PortfolioPublic: Fetching portfolio for slug:', slug);
        setLoading(true);
        const data = await getPortfolioBySlug(slug);
        
        if (!data) {
          console.warn('PortfolioPublic: Portfolio not found for slug:', slug);
          setError("Portfolio not found");
          return;
        }
        
        console.log('PortfolioPublic: Portfolio loaded successfully:', data.title);
        setPortfolioData(data);
      } catch (err) {
        console.error('PortfolioPublic: Error loading portfolio:', err);
        setError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-12 h-12 border-4 border-black border-t-[#00DC82] rounded-full" />
        </motion.div>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600">{error || "Portfolio not found"}</p>
          <a href="/" className="mt-6 inline-block px-6 py-3 bg-black text-white font-bold rounded-lg">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Render based on templateId
  const templateId = portfolioData.templateId || 1;
  
  if (templateId === 2) {
    return <CyberDevFolio data={portfolioData} onBack={() => window.history.back()} />;
  }

  return <MinimalistPortfolio data={portfolioData} onBack={() => window.history.back()} />;
};
