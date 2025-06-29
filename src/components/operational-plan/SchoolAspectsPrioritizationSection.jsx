import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GripVertical, ListOrdered, Settings2, Sparkles, Loader2, CheckSquare, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { SCHOOL_ASPECTS_AREAS, DETAILED_ASPECTS_TEMPLATE } from '@/lib/constants/schoolAspectsData';
=======
import { SCHOOL_ASPECTS_AREAS, DETAILED_ASPECTS_TEMPLATE } from '@/lib/operationalPlanConstants';
>>>>>>> cd51de4 (initial push)

const getRankColor = (index) => {
  const colors = [
    'bg-red-500',    // Rank 1
    'bg-red-400',    // Rank 2
    'bg-orange-400', // Rank 3
    'bg-yellow-400', // Rank 4
    'bg-yellow-300', // Rank 5
    'bg-green-400',  // Rank 6
    'bg-green-500',  // Rank 7
  ];
  return colors[index] || 'bg-gray-300';
};

const SchoolAspectsPrioritizationSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [availableAspects, setAvailableAspects] = useState(
    SCHOOL_ASPECTS_AREAS.filter(aspect => !(planData.ranked_school_aspects || []).find(ranked => ranked.id === aspect.id))
  );
  const [rankedAspects, setRankedAspects] = useState(planData.ranked_school_aspects || []);
  const [detailedAspects, setDetailedAspects] = useState(planData.detailed_school_aspects || {});
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false);

  useEffect(() => {
    const currentRankedIds = (planData.ranked_school_aspects || []).map(r => r.id);
    setAvailableAspects(SCHOOL_ASPECTS_AREAS.filter(aspect => !currentRankedIds.includes(aspect.id)));
    setRankedAspects(planData.ranked_school_aspects || []);
    setDetailedAspects(planData.detailed_school_aspects || {});
  }, [planData.ranked_school_aspects, planData.detailed_school_aspects]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    let newAvailableAspects = Array.from(availableAspects);
    let newRankedAspects = Array.from(rankedAspects);

    if (source.droppableId === 'available' && destination.droppableId === 'ranked') {
      const [movedItem] = newAvailableAspects.splice(source.index, 1);
      newRankedAspects.splice(destination.index, 0, movedItem);
    } else if (source.droppableId === 'ranked' && destination.droppableId === 'available') {
      const [movedItem] = newRankedAspects.splice(source.index, 1);
      newAvailableAspects.splice(destination.index, 0, movedItem);
    } else if (source.droppableId === 'ranked' && destination.droppableId === 'ranked') {
      const [movedItem] = newRankedAspects.splice(source.index, 1);
      newRankedAspects.splice(destination.index, 0, movedItem);
    } else if (source.droppableId === 'available' && destination.droppableId === 'available') {
      const [movedItem] = newAvailableAspects.splice(source.index, 1);
      newAvailableAspects.splice(destination.index, 0, movedItem);
    }
    
    setAvailableAspects(newAvailableAspects);
    setRankedAspects(newRankedAspects);
    onChange({ ranked_school_aspects: newRankedAspects });
  };

  const handleDetailedAspectChange = (aspectId, subAspectId, field, value) => {
    const updatedDetailedAspects = { ...detailedAspects };
    if (!updatedDetailedAspects[aspectId]) {
      updatedDetailedAspects[aspectId] = [];
    }
    const aspectDetails = updatedDetailedAspects[aspectId];
    const subAspectIndex = aspectDetails.findIndex(sa => sa.id === subAspectId);

    if (subAspectIndex > -1) {
      aspectDetails[subAspectIndex] = { ...aspectDetails[subAspectIndex], [field]: value };
    }
    
    setDetailedAspects(updatedDetailedAspects);
    onChange({ detailed_school_aspects: updatedDetailedAspects });
  };

  const generateDetailedAspects = async () => {
    setIsGeneratingDetails(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const newDetailedAspects = { ...DETAILED_ASPECTS_TEMPLATE };
      setDetailedAspects(newDetailedAspects);
      onChange({ detailed_school_aspects: newDetailedAspects });
      toast({
        title: "تم التوليد بنجاح",
        description: "تم توليد الجوانب المدرسية التفصيلية حسب المجالات.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "خطأ في التوليد",
        description: "حدث خطأ أثناء توليد الجوانب التفصيلية.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDetails(false);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-8">
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <ListOrdered className="w-6 h-6" />
              الجوانب المدرسية العامة وترتيبها (أولويات التطوير والتحسين)
            </CardTitle>
            <CardDescription className="text-purple-100">
              اسحب وأفلت المجالات لترتيبها حسب الأولوية من الأعلى إلى الأدنى.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-50 grid md:grid-cols-2 gap-6">
            <Droppable droppableId="available">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-4 rounded-lg min-h-[200px] border-2 border-dashed ${snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">المجالات المتاحة</h3>
                  {availableAspects.map((aspect, index) => (
                    <Draggable key={aspect.id} draggableId={aspect.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-2 rounded-md shadow-sm flex items-center justify-between cursor-grab transition-all
                                      ${snapshot.isDragging ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-white hover:bg-gray-50'}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-gray-800">{aspect.name}</span>
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {availableAspects.length === 0 && <p className="text-sm text-gray-500 text-center mt-4">جميع المجالات تم ترتيبها.</p>}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="ranked">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-4 rounded-lg min-h-[200px] border-2 border-dashed ${snapshot.isDraggingOver ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}`}
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">المجالات الأولى بالترتيب (تنازليًا)</h3>
                  {rankedAspects.map((aspect, index) => (
                    <Draggable key={aspect.id} draggableId={aspect.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-2 rounded-md shadow-md flex items-center justify-between cursor-grab text-white transition-all
                                      ${getRankColor(index)} ${snapshot.isDragging ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="font-medium">{index + 1}. {aspect.name}</span>
                          <GripVertical className="w-5 h-5 text-white/70" />
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {rankedAspects.length === 0 && <p className="text-sm text-gray-500 text-center mt-4">اسحب المجالات إلى هنا لترتيبها.</p>}
                </div>
              )}
            </Droppable>
          </CardContent>
        </Card>

        <Card className="border-teal-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Settings2 className="w-6 h-6" />
              الجوانب المدرسية حسب المجالات (تفصيلي)
            </CardTitle>
            <CardDescription className="text-teal-100">
              تفصيل الجوانب الفرعية لكل مجال من المجالات الرئيسية المحددة.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-50">
            <div className="mb-6 flex justify-center">
              <Button 
                onClick={generateDetailedAspects} 
                disabled={isGeneratingDetails}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform hover:scale-105"
              >
                {isGeneratingDetails ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Sparkles className="ml-2 h-5 w-5" />}
                {isGeneratingDetails ? 'جاري التوليد...' : 'توليد تلقائي للجوانب التفصيلية (نموذج)'}
              </Button>
            </div>

            {Object.keys(detailedAspects).length === 0 && (
              <p className="text-center text-gray-500 py-8">
                <HelpCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                لم يتم توليد الجوانب التفصيلية بعد. استخدم الزر أعلاه لتوليد نموذج.
              </p>
            )}

            {SCHOOL_ASPECTS_AREAS.map(mainAspect => (
              detailedAspects[mainAspect.id] && detailedAspects[mainAspect.id].length > 0 && (
                <motion.div 
                  key={mainAspect.id}
                  initial={{ opacity: 0, y:10 }}
                  animate={{ opacity: 1, y:0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 p-4 bg-white rounded-lg shadow"
                >
                  <h4 className="text-lg font-semibold text-teal-700 mb-3 border-b pb-2">{mainAspect.name}</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-teal-50">
                        <TableRow>
                          <TableHead className="w-[5%] text-center">م</TableHead>
                          <TableHead className="w-[30%]">الجانب الفرعي</TableHead>
                          <TableHead className="w-[30%]">مؤشرات الأداء</TableHead>
                          <TableHead className="w-[35%]">ملاحظات / إجراءات مقترحة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailedAspects[mainAspect.id].map((subAspect, index) => (
                          <TableRow key={subAspect.id} className={index % 2 === 0 ? 'bg-white' : 'bg-teal-50/30'}>
                            <TableCell className="text-center">{index + 1}</TableCell>
                            <TableCell>
                              <Textarea
                                value={subAspect.name}
                                onChange={(e) => handleDetailedAspectChange(mainAspect.id, subAspect.id, 'name', e.target.value)}
                                placeholder="اسم الجانب الفرعي"
                                className="min-h-[60px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                value={subAspect.indicators}
                                onChange={(e) => handleDetailedAspectChange(mainAspect.id, subAspect.id, 'indicators', e.target.value)}
                                placeholder="مؤشرات الأداء"
                                className="min-h-[60px]"
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                value={subAspect.notes}
                                onChange={(e) => handleDetailedAspectChange(mainAspect.id, subAspect.id, 'notes', e.target.value)}
                                placeholder="ملاحظات أو إجراءات"
                                className="min-h-[60px]"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              )
            ))}
             {Object.keys(detailedAspects).length > 0 && (
                <p className="mt-6 text-sm text-gray-600 text-center">
                    <CheckSquare className="inline w-4 h-4 mr-1 text-green-600" />
                    يمكنك تعديل البيانات المولدة لتناسب احتياجات مدرستك بشكل دقيق.
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DragDropContext>
  );
};

export default SchoolAspectsPrioritizationSection;