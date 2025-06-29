import React from 'react';

const ScheduleTable = ({ schedule, viewMode, teachers, classrooms, teacherNisab, goldenDayActive }) => {
  const schoolDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periodsPerDay = 7;

  if (!schedule) return <p className="text-center arabic-text">لا يوجد جدول لعرضه.</p>;

  if (viewMode === 'main') {
    const sortedTeachers = [...teachers].sort((a, b) => {
      if (a.subject < b.subject) return -1;
      if (a.subject > b.subject) return 1;
      return 0;
    });

    return (
      <div className="mb-8 print-page">
        <h3 className="text-xl font-bold mb-4 arabic-text text-center">الجدول الرئيسي للمدرسة</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 schedule-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 arabic-text">المعلم</th>
                {schoolDays.map(day => (
                  <th key={day} className="border border-gray-300 p-2 arabic-text">{day}</th>
                ))}
                <th className="border border-gray-300 p-2 arabic-text">النصاب</th>
              </tr>
            </thead>
            <tbody>
              {sortedTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td className="border border-gray-300 p-2 font-medium arabic-text">
                    {teacher.name} ({teacher.subject})
                  </td>
                  {schoolDays.map(day => (
                    <td key={day} className="border border-gray-300 p-1 schedule-cell text-center">
                      {[...Array(periodsPerDay)].map((_, periodIndex) => {
                        let periodContent = '-';
                        let cellClass = 'h-6 text-gray-400';
                        Object.values(schedule).forEach(classroomSchedule => {
                          const daySchedule = classroomSchedule[day] || [];
                          const periodData = daySchedule.find(p => p.period === periodIndex + 1 && p.teacher === teacher.name);
                          if (periodData && periodData.subject) {
                            periodContent = periodData.period;
                            cellClass = `h-6 ${periodData.subject === 'نشاط' ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-100 text-blue-700'}`;
                          }
                        });
                        return <div key={periodIndex} className={`p-0.5 ${cellClass}`}>{periodContent}</div>;
                      })}
                    </td>
                  ))}
                  <td className="border border-gray-300 p-2 text-center arabic-text">
                    {teacherNisab && teacherNisab[teacher.name] ? `${teacherNisab[teacher.name].count} / ${teacherNisab[teacher.name].total}` : '0 / 0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (viewMode === 'classroom') {
    return classrooms.map(classroomDetail => {
      const classroomKey = `الصف ${classrooms.findIndex(c => c.id === classroomDetail.id) + 1}`;
      const classroomSchedule = schedule[classroomKey];
      return (
        <div key={classroomDetail.id} className="mb-8 print-page">
          <h3 className="text-xl font-bold mb-4 arabic-text text-center">{classroomDetail.name}</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 schedule-table">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 arabic-text">الحصة</th>
                  {schoolDays.map(day => (
                    <th key={day} className="border border-gray-300 p-2 arabic-text">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(periodsPerDay)].map((_, periodIndex) => (
                  <tr key={periodIndex}>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {periodIndex + 1}
                      {periodIndex === 2 && <div className="text-xs text-gray-500">الفسحة</div>}
                      {periodIndex === 6 && <div className="text-xs text-gray-500">الصلاة</div>}
                    </td>
                    {schoolDays.map(day => {
                      const daySchedule = classroomSchedule?.[day] || [];
                      const periodData = daySchedule.find(p => p.period === periodIndex + 1);
                      const isGoldenPeriodActivity = periodData?.subject === 'نشاط';
                      return (
                        <td key={day} className={`border border-gray-300 p-2 schedule-cell ${isGoldenPeriodActivity ? 'bg-yellow-100' : ''}`}>
                          {periodData && periodData.subject ? (
                            <div className="text-center">
                              <div className="font-medium arabic-text text-sm">{periodData.subject}</div>
                              <div className="text-xs text-gray-600 arabic-text">{periodData.teacher}</div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    });
  }
  
  if (viewMode === 'teacher') {
    return teachers.map(teacher => {
      const teacherIndividualSchedule = {};
      schoolDays.forEach(day => {
        teacherIndividualSchedule[day] = Array(periodsPerDay).fill(null);
        Object.entries(schedule).forEach(([classroomKey, classroomData]) => {
          const classroomName = classrooms.find(c => `الصف ${classrooms.indexOf(c) + 1}` === classroomKey)?.name || classroomKey;
          const daySchedule = classroomData[day] || [];
          daySchedule.forEach(periodData => {
            if (periodData.teacher === teacher.name && periodData.period <= periodsPerDay) {
              teacherIndividualSchedule[day][periodData.period - 1] = {
                subject: periodData.subject,
                classroom: classroomName
              };
            }
          });
        });
      });

      return (
        <div key={teacher.id} className="mb-8 print-page">
          <h3 className="text-xl font-bold mb-4 arabic-text text-center">جدول المعلم: {teacher.name} <span className="text-sm text-gray-600">({teacher.subject})</span></h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 schedule-table">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 arabic-text">الحصة</th>
                  {schoolDays.map(day => (<th key={day} className="border border-gray-300 p-2 arabic-text">{day}</th>))}
                </tr>
              </thead>
              <tbody>
                {[...Array(periodsPerDay)].map((_, periodIndex) => (
                  <tr key={periodIndex}>
                    <td className="border border-gray-300 p-2 text-center font-bold">
                      {periodIndex + 1}
                      {periodIndex === 2 && <div className="text-xs text-gray-500">الفسحة</div>}
                      {periodIndex === 6 && <div className="text-xs text-gray-500">الصلاة</div>}
                    </td>
                    {schoolDays.map(day => {
                      const periodData = teacherIndividualSchedule[day]?.[periodIndex];
                      const isGoldenPeriodActivity = periodData?.subject === 'نشاط';
                      return (
                        <td key={day} className={`border border-gray-300 p-2 schedule-cell ${isGoldenPeriodActivity ? 'bg-yellow-100' : ''}`}>
                          {periodData ? (
                            <div className="text-center">
                              <div className="font-medium arabic-text text-sm">{periodData.subject}</div>
                              <div className="text-xs text-gray-600 arabic-text">{periodData.classroom}</div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
             <p className="text-center mt-2 arabic-text">النصاب الأسبوعي: {teacherNisab && teacherNisab[teacher.name] ? `${teacherNisab[teacher.name].count} / ${teacherNisab[teacher.name].total}` : '0 / 0'} حصة</p>
          </div>
        </div>
      );
    });
  }
  return null;
};

export default ScheduleTable;