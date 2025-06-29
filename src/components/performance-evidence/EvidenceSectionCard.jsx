import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EvidenceSectionCard = ({ section }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/performance-evidence/section/${section.id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ y: -10, scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col items-center text-center h-full"
    >
      <div className={`w-20 h-20 sm:w-24 sm:h-24 ${section.color} rounded-xl flex items-center justify-center mb-6 mx-auto shadow-md`}>
        {React.cloneElement(section.icon, { className: "w-10 h-10 sm:w-12 sm:h-12 text-white" })}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 arabic-text">
        {section.title}
      </h3>
      {section.description && (
         <p className="text-gray-600 text-sm arabic-text leading-relaxed flex-grow">
            {section.description}
         </p>
      )}
    </motion.div>
  );
};

export default EvidenceSectionCard;