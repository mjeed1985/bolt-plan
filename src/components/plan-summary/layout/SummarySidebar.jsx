import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const SummarySidebar = ({ sections, activeSection, onScrollToSection, onClose }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h3 className="text-white font-semibold">أقسام الخطة</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <span className="sr-only">إغلاق</span>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="space-y-2">
        {sections.map(({ id, title, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => onScrollToSection(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-start ${
              activeSection === id
                ? 'bg-white/20 text-white shadow-lg border border-white/30'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {typeof Icon === 'string' ? (
              <span className="ml-3 text-lg">{Icon}</span>
            ) : (
              <Icon className="ml-3 h-5 w-5" />
            )}
            {title}
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default SummarySidebar;