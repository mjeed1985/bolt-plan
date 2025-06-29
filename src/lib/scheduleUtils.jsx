export const generateScheduleLogic = (scheduleInput) => {
  const { classrooms: classroomDetails, teachers, goldenDayActive } = scheduleInput;
  const schoolDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periodsPerDay = 7;

  const schedule = {};
  const teacherWorkload = {};
  const teacherNisab = {};
  const teacherGoldenDay = {};

  classroomDetails.forEach((classroom) => {
    const classroomKey = classroom.name; // Use classroom name as key
    schedule[classroomKey] = {};
    schoolDays.forEach(day => {
      schedule[classroomKey][day] = Array(periodsPerDay).fill(null).map((_, i) => ({ period: i + 1, subject: '', teacher: '' }));
    });
  });

  teachers.forEach(teacher => {
    teacherWorkload[teacher.name] = {
      total: 0,
      dayCounts: Object.fromEntries(schoolDays.map(d => [d, 0])),
      seventhPeriodCount: 0,
    };
    teacherNisab[teacher.name] = 0; // This will be updated to an object later
    teacherGoldenDay[teacher.name] = null;
  });

  teachers.forEach(teacher => {
    let assignedGoldenDay = false;
    if (goldenDayActive) { // Only assign golden day if active
      while (!assignedGoldenDay) {
        const randomDayIndex = Math.floor(Math.random() * schoolDays.length);
        const dayForGolden = schoolDays[randomDayIndex];
        if (!teacherGoldenDay[teacher.name]) {
          teacherGoldenDay[teacher.name] = dayForGolden;
          assignedGoldenDay = true;
        }
      }
    }
  });

  teachers.sort(() => Math.random() - 0.5);

  for (const day of schoolDays) {
    for (let period = 0; period < periodsPerDay; period++) {
      for (const classroomDetail of classroomDetails) {
        const classroomKey = classroomDetail.name;

        if (schedule[classroomKey][day][period].subject === '') {
          let assignedTeacher = null;
          
          // Filter teachers who are assigned to this classroom
          const eligibleTeachersForClassroom = teachers.filter(t => 
            Array.isArray(t.assignedClassrooms) && t.assignedClassrooms.includes(classroomDetail.id)
          );

          for (const teacher of eligibleTeachersForClassroom) {
            const isGoldenDayForTeacher = goldenDayActive && teacherGoldenDay[teacher.name] === day;
            const isGoldenPeriod = period < 4;

            if (isGoldenDayForTeacher && !isGoldenPeriod) continue;
            if (period === 6 && teacherWorkload[teacher.name].seventhPeriodCount >= 2) continue;

            const currentNisab = teacherNisab[teacher.name]?.count || 0; // Access count property
            const maxNisab = 24; 

            if (teacherWorkload[teacher.name].dayCounts[day] < (isGoldenDayForTeacher && isGoldenPeriod ? 1 : 3) && currentNisab < maxNisab) {
              assignedTeacher = teacher;
              break;
            }
          }

          if (assignedTeacher) {
            // Determine subject: use first subject, or 'نشاط' if golden day/period
            let subjectToAssign = assignedTeacher.subjects && assignedTeacher.subjects[0] ? assignedTeacher.subjects[0] : 'مادة غير محددة';
            if (goldenDayActive && teacherGoldenDay[assignedTeacher.name] === day && period < 4) {
              subjectToAssign = 'نشاط';
            }
            
            schedule[classroomKey][day][period] = {
              period: period + 1,
              subject: subjectToAssign,
              teacher: assignedTeacher.name,
            };
            teacherWorkload[assignedTeacher.name].total++;
            teacherWorkload[assignedTeacher.name].dayCounts[day]++;
             if (teacherNisab[assignedTeacher.name] && typeof teacherNisab[assignedTeacher.name] === 'object') {
              teacherNisab[assignedTeacher.name].count = (teacherNisab[assignedTeacher.name].count || 0) + 1;
            } else { // Initialize if not an object (first time or reset)
              teacherNisab[assignedTeacher.name] = { count: 1, total: 24 };
            }

            if (period === 6) {
              teacherWorkload[assignedTeacher.name].seventhPeriodCount++;
            }
          } else {
            schedule[classroomKey][day][period] = { period: period + 1, subject: 'شاغر', teacher: 'غير محدد' };
          }
        }
      }
    }
  }

  // Ensure teacherNisab is structured correctly after all assignments
  teachers.forEach(teacher => {
    if (typeof teacherNisab[teacher.name] !== 'object' || teacherNisab[teacher.name] === null || teacherNisab[teacher.name] === undefined) {
        // If it's still not an object (e.g., teacher had no assignments), initialize it.
        teacherNisab[teacher.name] = { count: teacherWorkload[teacher.name].total, total: 24 };
    } else {
        // Ensure 'total' is set if it was somehow missed (shouldn't happen with above logic but good for safety)
        teacherNisab[teacher.name].total = teacherNisab[teacher.name].total || 24;
    }
  });

  return { schedule, teacherNisab };
};


export const saveScheduleToLocalStorage = (scheduleToSave, userId) => {
  const allSavedSchedules = JSON.parse(localStorage.getItem('schoolSchedules') || '[]');
  const otherUserSchedules = allSavedSchedules.filter(s => s.userId !== userId);
  let currentUserSchedules = allSavedSchedules.filter(s => s.userId === userId);
  
  const existingIndex = currentUserSchedules.findIndex(s => s.id === scheduleToSave.id);
  if (existingIndex > -1) {
    currentUserSchedules[existingIndex] = scheduleToSave;
  } else {
    currentUserSchedules.push(scheduleToSave);
  }
  
  const updatedAllSchedules = [...otherUserSchedules, ...currentUserSchedules];
  localStorage.setItem('schoolSchedules', JSON.stringify(updatedAllSchedules));
  return currentUserSchedules; 
};

export const loadSchedulesFromLocalStorage = (userId) => {
  const savedSchedules = JSON.parse(localStorage.getItem('schoolSchedules') || '[]');
  return savedSchedules.filter(s => s.userId === userId);
};