import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Eye, Share2 } from 'lucide-react';

interface PortfolioSuccessScreenProps {
  slug: string;
  title: string;
  onViewPortfolio: () => void;
  onBack: () => void;
}

export const PortfolioSuccessScreen: React.FC<PortfolioSuccessScreenProps> = ({
  slug,
  title,
  onViewPortfolio,
  onBack
}) => {
  const [copied, setCopied] = useState(false);
  
  const portfolioUrl = `${window.location.origin}/portfolio/${slug}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=Check%20out%20my%20portfolio&url=${encodeURIComponent(portfolioUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl">
          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-50" />
              <div className="relative bg-emerald-500/20 border-2 border-emerald-400 rounded-full p-6">
                <Check className="w-12 h-12 text-emerald-400" strokeWidth={3} />
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Portfolio Created! 🎉
            </h2>
            <p className="text-lg text-slate-300">
              Your portfolio <span className="font-semibold text-emerald-400">{title}</span> is now live.
            </p>
          </motion.div>

          {/* URL Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <label className="block text-sm font-medium text-slate-400 mb-3">
              📎 Share Your Portfolio Link
            </label>
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-slate-300 font-mono text-sm break-all">{portfolioUrl}</span>
              </div>
              <button
                onClick={copyToClipboard}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Copy className="w-5 h-5" />
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </motion.div>

          {/* Share Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-sm text-slate-400 mb-3">📤 Share on Social Media</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-600 border border-slate-600 text-white py-2 rounded-lg transition-all font-medium"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Twitter</span>
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-600 border border-slate-600 text-white py-2 rounded-lg transition-all font-medium"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            <button
              onClick={onViewPortfolio}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all"
            >
              <Eye className="w-5 h-5" />
              View My Portfolio
            </button>
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Create Another
            </button>
          </motion.div>

          {/* Extra Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-8 border-t border-slate-700"
          >
            <p className="text-sm text-slate-400 text-center">
              💡 Save this link and share it with anyone! Your portfolio is now publicly accessible.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
