import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SummaryMainContent = ({ sections, sectionRefs, planData }) => {
  return (
    <main className="flex-1 min-w-0">
      <div className="space-y-8">
        <AnimatePresence mode="wait">
          {sections.map(({ id, component: Component }) => (
            <motion.div
              key={id}
              ref={(el) => (sectionRefs.current[id] = el)}
              id={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Component planData={planData} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default SummaryMainContent;