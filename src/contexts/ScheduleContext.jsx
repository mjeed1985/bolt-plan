import React, { createContext, useContext, useState, useEffect } from 'react';

const ScheduleContext = createContext();

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState([]); // Array of {id, name}
  const [teachers, setTeachers] = useState([]); // Array of {id, name, subject, assignedClassroom}

  // Load from localStorage on initial mount
  useEffect(() => {
    const storedClassrooms = localStorage.getItem('globalClassrooms');
    if (storedClassrooms) {
      setClassrooms(JSON.parse(storedClassrooms));
    }
    const storedTeachers = localStorage.getItem('globalTeachers');
    if (storedTeachers) {
      setTeachers(JSON.parse(storedTeachers));
    }
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('globalClassrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  useEffect(() => {
    localStorage.setItem('globalTeachers', JSON.stringify(teachers));
  }, [teachers]);


  const value = {
    classrooms,
    setClassrooms,
    teachers,
    setTeachers,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};