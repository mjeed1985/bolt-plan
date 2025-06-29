import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, PieChart, Activity, Users, TrendingUp } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ParentCommunicationReportsPage = () => {
  // Placeholder data - replace with actual data fetching and processing
  const communicationByPurposeData = {
    labels: ['أكاديمي', 'سلوكي', 'إداري', 'تهنئة', 'دعوة'],
    datasets: [
      {
        label: 'عدد الرسائل حسب الغرض',
        data: [120, 80, 50, 30, 20],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const parentInteractionRateData = {
    labels: ['قرأ الرسالة', 'رد على الرسالة', 'لم يتفاعل'],
    datasets: [
      {
        label: 'معدل تفاعل أولياء الأمور',
        data: [300, 150, 50], // Example: 300 read, 150 replied, 50 no interaction
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        hoverOffset: 4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Cairo' }
        }
      },
      title: {
        display: true,
        font: { family: 'Cairo', size: 16 }
      },
      tooltip: {
        bodyFont: { family: 'Cairo' },
        titleFont: { family: 'Cairo' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Cairo' } },
        grid: { color: 'rgba(200, 200, 200, 0.1)' }
      },
      x: {
        ticks: { font: { family: 'Cairo' } },
        grid: { display: false }
      }
    }
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
         labels: { font: { family: 'Cairo' } }
      },
      title: {
        display: true,
        font: { family: 'Cairo', size: 16 }
      },
      tooltip: {
        bodyFont: { family: 'Cairo' },
        titleFont: { family: 'Cairo' }
      }
    }
  };


  const insights = [
    { text: "أكثر الأوقات فعالية للتواصل هي أيام الأحد والثلاثاء بين الساعة 10 صباحًا و 12 ظهرًا.", icon: TrendingUp, color: "text-green-500" },
    { text: "الملاحظات السلوكية المتعلقة بالتأخر الصباحي هي الأكثر شيوعًا هذا الشهر.", icon: Activity, color: "text-red-500" },
    { text: "أولياء أمور الصف الأول الابتدائي هم الأكثر تفاعلاً مع الرسائل.", icon: Users, color: "text-blue-500" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90 } }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <BarChart className="h-10 w-10 text-teal-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 arabic-text">تقارير وتحليلات التواصل</h1>
            <p className="text-gray-600 arabic-text">استكشف بيانات التواصل لاستخلاص رؤى قيمة وتحسين الفعالية.</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-xl bg-white/90 backdrop-blur-md border-0 h-[450px]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 arabic-text">توزيع الرسائل حسب الغرض</CardTitle>
              <CardDescription className="text-gray-600 arabic-text">يوضح هذا الرسم البياني عدد الرسائل المرسلة لكل غرض من أغراض التواصل.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text:'توزيع الرسائل حسب الغرض'}}}} data={communicationByPurposeData} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="shadow-xl bg-white/90 backdrop-blur-md border-0 h-[450px]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 arabic-text">معدل تفاعل أولياء الأمور</CardTitle>
              <CardDescription className="text-gray-600 arabic-text">نسبة تفاعل أولياء الأمور مع الرسائل المرسلة (قراءة، رد).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
               <Pie options={{...pieChartOptions, plugins: {...pieChartOptions.plugins, title: {...pieChartOptions.plugins.title, text:'معدل تفاعل أولياء الأمور'}}}} data={parentInteractionRateData} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="shadow-xl bg-white/90 backdrop-blur-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 arabic-text">رؤى واقتراحات</CardTitle>
            <CardDescription className="text-gray-600 arabic-text">أنماط وملاحظات مستخلصة من بيانات التواصل لمساعدتك على تحسين استراتيجياتك.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start p-4 bg-gray-50/70 rounded-lg border border-gray-200/50">
                  <insight.icon className={`h-6 w-6 mt-1 ml-3 flex-shrink-0 ${insight.color}`} />
                  <p className="text-gray-700 arabic-text text-sm">{insight.text}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParentCommunicationReportsPage;