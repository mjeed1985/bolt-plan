import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GripVertical, PlusCircle, Trash2 } from 'lucide-react';
import { SCHOOL_ASPECTS_AREAS } from '@/lib/operationalPlanConstants';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SchoolAspectsPrioritizationSection = ({ planData, onChange }) => {
  const [rankedAspects, setRankedAspects] = useState(planData.ranked_school_aspects || SCHOOL_ASPECTS_AREAS);
  const [detailedAspects, setDetailedAspects] = useState(planData.detailed_school_aspects || {});

  useEffect(() => {
    onChange({ ranked_school_aspects: rankedAspects, detailed_school_aspects: detailedAspects });
  }, [rankedAspects, detailedAspects, onChange]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(rankedAspects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRankedAspects(items);
  };
  
  const handleDetailChange = (aspectKey, field, value) => {
      setDetailedAspects(prev => ({
          ...prev,
          [aspectKey]: {
              ...prev[aspectKey],
              [field]: value
          }
      }));
  };

  const handleAddItem = (aspectKey, listField) => {
    const list = detailedAspects[aspectKey]?.[listField] || [''];
    setDetailedAspects(prev => ({
        ...prev,
        [aspectKey]: {
            ...prev[aspectKey],
            [listField]: [...list, '']
        }
    }));
  };
  
  const handleRemoveItem = (aspectKey, listField, index) => {
      const list = (detailedAspects[aspectKey]?.[listField] || []).filter((_, i) => i !== index);
       setDetailedAspects(prev => ({
        ...prev,
        [aspectKey]: {
            ...prev[aspectKey],
            [listField]: list
        }
    }));
  };

  const handleItemChange = (aspectKey, listField, index, value) => {
     const list = [...(detailedAspects[aspectKey]?.[listField] || [])];
     list[index] = value;
      setDetailedAspects(prev => ({
        ...prev,
        [aspectKey]: {
            ...prev[aspectKey],
            [listField]: list
        }
    }));
  };


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>ترتيب أولويات مجالات العمل المدرسي</CardTitle>
          <CardDescription>اسحب وأفلت لترتيب المجالات حسب الأولوية. الأعلى هو الأكثر أولوية.</CardDescription>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="aspects">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {rankedAspects.map((aspect, index) => (
                    <Draggable key={aspect.key} draggableId={aspect.key} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center p-3 bg-white border rounded-md shadow-sm"
                        >
                          <GripVertical className="mr-2 text-gray-400" />
                          <span className="font-semibold text-gray-700">{index + 1}. {aspect.label}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>تفصيل الأولويات</CardTitle>
              <CardDescription>لكل من الأولويات الثلاثة الأولى، حدد جوانب القوة والضعف والتوصيات.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              {rankedAspects.slice(0, 3).map(aspect => (
                  <div key={aspect.key} className="p-4 border rounded-lg">
                      <h3 className="text-lg font-bold mb-4 text-sky-700">{aspect.label}</h3>
                      <div className="space-y-4">
                        <div>
                            <Label className="font-semibold">جوانب القوة:</Label>
                             {(detailedAspects[aspect.key]?.strengths || ['']).map((item, index) => (
                                <div key={index} className="flex items-center gap-2 mt-1">
                                    <Input value={item} onChange={(e) => handleItemChange(aspect.key, 'strengths', index, e.target.value)} placeholder="اكتب جانب قوة"/>
                                    <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(aspect.key, 'strengths', index)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                </div>
                            ))}
                             <Button size="sm" variant="outline" className="mt-2" onClick={() => handleAddItem(aspect.key, 'strengths')}><PlusCircle className="h-4 w-4 ml-2"/>إضافة قوة</Button>
                        </div>
                         <div>
                            <Label className="font-semibold">جوانب الضعف:</Label>
                             {(detailedAspects[aspect.key]?.weaknesses || ['']).map((item, index) => (
                                <div key={index} className="flex items-center gap-2 mt-1">
                                    <Input value={item} onChange={(e) => handleItemChange(aspect.key, 'weaknesses', index, e.target.value)} placeholder="اكتب جانب ضعف"/>
                                    <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(aspect.key, 'weaknesses', index)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                </div>
                            ))}
                             <Button size="sm" variant="outline" className="mt-2" onClick={() => handleAddItem(aspect.key, 'weaknesses')}><PlusCircle className="h-4 w-4 ml-2"/>إضافة ضعف</Button>
                        </div>
                        <div>
                            <Label className="font-semibold">التوصيات:</Label>
                             {(detailedAspects[aspect.key]?.recommendations || ['']).map((item, index) => (
                                <div key={index} className="flex items-center gap-2 mt-1">
                                    <Input value={item} onChange={(e) => handleItemChange(aspect.key, 'recommendations', index, e.target.value)} placeholder="اكتب توصية"/>
                                    <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(aspect.key, 'recommendations', index)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                </div>
                            ))}
                             <Button size="sm" variant="outline" className="mt-2" onClick={() => handleAddItem(aspect.key, 'recommendations')}><PlusCircle className="h-4 w-4 ml-2"/>إضافة توصية</Button>
                        </div>
                      </div>
                  </div>
              ))}
          </CardContent>
      </Card>

    </div>
  );
};

export default SchoolAspectsPrioritizationSection;