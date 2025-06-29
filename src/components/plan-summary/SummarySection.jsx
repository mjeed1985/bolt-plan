import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SummarySection = ({ children, id, title, icon }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false }); 

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.7, ease: "circOut" } 
    }
  };
  
  const renderIcon = () => {
    if (!icon) {
      return null;
    }

    if (typeof icon === 'string') {
      return <span className="ml-4 text-2xl">{icon}</span>;
    }

    if (React.isValidElement(icon)) {
      const newClassName = `h-8 w-8 text-white ml-4 ${icon.props.className || ''}`.trim();
      return React.cloneElement(icon, { className: newClassName });
    }

    const IconComponent = icon;
    return <IconComponent className="h-8 w-8 text-white ml-4" />;
  };

  return (
    <motion.section
      id={id}
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className="mb-8"
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-white/20 to-white/10 px-6 py-4 border-b border-white/20">
          <div className="flex items-center">
            {renderIcon()}
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </motion.section>
  );
};

export default SummarySection;