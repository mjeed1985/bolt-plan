<<<<<<< HEAD
import React, { createContext, useState, useContext, useEffect } from 'react';

const LetterTemplatesContext = createContext();

export const LetterTemplatesProvider = ({ children }) => {
  const [letterTemplates, setLetterTemplates] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTemplates = localStorage.getItem('letterTemplates');
        const parsed = storedTemplates ? JSON.parse(storedTemplates) : {};
        return {
          external: parsed.external || null,
          bulletin: parsed.bulletin || null,
          notification: parsed.notification || null,
        };
      } catch (e) {
        console.error("Failed to parse letter templates from localStorage", e);
        return { external: null, bulletin: null, notification: null };
      }
    }
    return { external: null, bulletin: null, notification: null };
  });

  useEffect(() => {
    try {
      localStorage.setItem('letterTemplates', JSON.stringify(letterTemplates));
    } catch (e) {
      console.error("Failed to save letter templates to localStorage", e);
    }
  }, [letterTemplates]);

  const updateLetterTemplate = (type, url) => {
    setLetterTemplates(prev => ({
      ...prev,
      [type]: url
    }));
  };

  return (
    <LetterTemplatesContext.Provider value={{ letterTemplates, updateLetterTemplate }}>
      {children}
    </LetterTemplatesContext.Provider>
  );
};

export const useLetterTemplates = () => useContext(LetterTemplatesContext);
=======
import React, { createContext, useContext, useState, useEffect } from 'react';

const LetterImageContext = createContext();

export const useLetterImage = () => {
  const context = useContext(LetterImageContext);
  if (!context) {
    throw new Error('useLetterImage must be used within a LetterImageProvider');
  }
  return context;
};

export const LetterImageProvider = ({ children }) => {
  const [letterImage, setLetterImage] = useState(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('letterOfficialImage');
    if (storedImage) {
      setLetterImage(storedImage);
    }
  }, []);

  const updateLetterImage = (newImage) => {
    setLetterImage(newImage);
    if (newImage) {
        localStorage.setItem('letterOfficialImage', newImage);
    } else {
        localStorage.removeItem('letterOfficialImage');
    }
  };

  const value = {
    letterImage,
    setLetterImage: updateLetterImage,
  };

  return (
    <LetterImageContext.Provider value={value}>
      {children}
    </LetterImageContext.Provider>
  );
};
>>>>>>> cd51de4 (initial push)
