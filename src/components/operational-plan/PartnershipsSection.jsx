import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, HeartHandshake as Handshake, RefreshCw, Sparkles, Loader2 } from 'lucide-react';
import { PARTNERSHIP_TYPES, RESPONSIBLE_PARTIES } from '@/lib/operationalPlanConstants';
import { useToast } from '@/components/ui/use-toast';

const PartnershipsSection = ({ partnerships, onChange, planData }) => {
  const { toast } = useToast();
  const [isLoadingAI, setIsLoadingAI] = useState({});

  const handlePartnershipChange = (index, field, value) => {
    const newPartnerships = [...partnerships];
    newPartnerships[index] = { ...newPartnerships[index], [field]: value };
    onChange(newPartnerships);
  };

  const addPartnership = () => {
    onChange([
      ...partnerships,
      {
        id: `partnership_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        partner_name: '',
        partnership_type: '',
        objectives: '',
        activities: '',
        responsible_person: ''
      }
    ]);
  };

  const removePartnership = (index) => {
    onChange(partnerships.filter((_, i) => i !== index));
  };

  const generateAIContent = async (index, fieldToUpdate) => {
    const partnership = partnerships[index];
    if (!partnership.partner_name || !partnership.partnership_type) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى إدخال اسم الشريك ونوع الشراكة أولاً لتوليد المحتوى.",
        variant: "destructive",
      });
      return;
    }

    const loadingKey = `${index}-${fieldToUpdate}`;
    setIsLoadingAI(prev => ({ ...prev, [loadingKey]: true }));
    toast({ title: "جاري توليد المحتوى...", description: "يرجى الانتظار قليلاً." });

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    let generatedText = '';
    const partnerTypeLabel = PARTNERSHIP_TYPES.find(pt => pt.value === partnership.partnership_type)?.label || partnership.partnership_type;

    if (fieldToUpdate === 'objectives') {
      if (partnership.partnership_type === 'educational_institution') {
        generatedText = `تعزيز التعاون الأكاديمي مع ${partnership.partner_name}، تبادل الخبرات التعليمية والبحثية، وتوفير فرص تطوير مهني مشتركة للكادر التعليمي. بالإضافة إلى إثراء تجربة الطلاب من خلال برامج مشتركة.`;
      } else if (partnership.partnership_type === 'government_entity') {
        generatedText = `الاستفادة من دعم ${partnership.partner_name} في تنفيذ المبادرات التعليمية المتوافقة مع التوجهات الوطنية، تسهيل الإجراءات المتعلقة بالمدرسة، والمساهمة في تحقيق أهداف التنمية المجتمعية.`;
      } else if (partnership.partnership_type === 'private_sector') {
        generatedText = `توفير دعم مادي أو عيني من ${partnership.partner_name} لتطوير مرافق المدرسة أو برامجها، إتاحة فرص تدريب عملي للطلاب في مجالات عمل الشركة، والمساهمة في ربط مخرجات التعليم بسوق العمل.`;
      } else {
        generatedText = `تحقيق أهداف مشتركة مع ${partnership.partner_name} كـ ${partnerTypeLabel} تشمل ${planData?.plan_objective ? `دعم تحقيق الهدف العام للخطة المتمثل في: "${planData.plan_objective}"` : 'تطوير المجتمع المحلي ودعم المدرسة.'}`;
      }
    } else if (fieldToUpdate === 'activities') {
      const objectivesText = partnership.objectives || "الأهداف المشتركة";
      if (partnership.partnership_type === 'educational_institution') {
        generatedText = `بناءً على ${objectivesText} مع ${partnership.partner_name}: تنظيم ورش عمل وندوات مشتركة، إطلاق برامج تبادل طلابي وأعضاء هيئة تدريس، تطوير مشاريع بحثية مشتركة، ومشاركة المصادر التعليمية.`;
      } else if (partnership.partnership_type === 'government_entity') {
        generatedText = `لتفعيل الشراكة مع ${partnership.partner_name} لتحقيق ${objectivesText}: المشاركة في الحملات التوعوية التي تنظمها الجهة، استضافة ممثلين من الجهة لتقديم محاضرات للطلاب، والتعاون في تنفيذ مشاريع تخدم الصالح العام.`;
      } else if (partnership.partnership_type === 'private_sector') {
        generatedText = `لتحقيق ${objectivesText} مع ${partnership.partner_name}: تنظيم زيارات ميدانية لمقر الشركة، رعاية الشركة لبعض الأنشطة المدرسية، وتقديم الشركة لبرامج تدريبية أو إرشاد مهني للطلاب.`;
      } else {
        generatedText = `تنفيذ مجموعة من الأنشطة مع ${partnership.partner_name} لتحقيق ${objectivesText}، مثل إقامة فعاليات مجتمعية، وحملات توعية، ومبادرات تطوعية مشتركة.`;
      }
    }
    
    handlePartnershipChange(index, fieldToUpdate, generatedText);
    setIsLoadingAI(prev => ({ ...prev, [loadingKey]: false }));
    toast({ title: "تم التوليد بنجاح!", description: `تم تحديث حقل "${fieldToUpdate === 'objectives' ? 'أهداف الشراكة' : 'الأنشطة والمبادرات'}"` });
  };


  return (
    <div className="space-y-8">
      {partnerships.map((partnership, index) => (
        <Card key={partnership.id || index} className="border-gray-200">
          <CardHeader className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Handshake className="w-6 h-6 text-green-600" />
                <CardTitle className="text-lg">الشراكة/التعاون {index + 1}</CardTitle>
              </div>
              {partnerships.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removePartnership(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف الشراكة
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`partner_name-${index}`}>اسم الشريك/الجهة المتعاونة</Label>
                <Input
                  id={`partner_name-${index}`}
                  value={partnership.partner_name || ''}
                  onChange={(e) => handlePartnershipChange(index, 'partner_name', e.target.value)}
                  placeholder="مثال: جامعة الملك سعود، مكتب التعليم المحلي"
                />
              </div>
              <div>
                <Label htmlFor={`partnership_type-${index}`}>نوع الشراكة</Label>
                <Select
                  value={partnership.partnership_type || ''}
                  onValueChange={(value) => handlePartnershipChange(index, 'partnership_type', value)}
                >
                  <SelectTrigger id={`partnership_type-${index}`}>
                    <SelectValue placeholder="اختر نوع الشراكة" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTNERSHIP_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor={`objectives-${index}`}>أهداف الشراكة</Label>
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => generateAIContent(index, 'objectives')}
                  disabled={isLoadingAI[`${index}-objectives`]}
                  className="text-xs border-indigo-500 text-indigo-600 hover:bg-indigo-50 flex items-center gap-1"
                >
                  {isLoadingAI[`${index}-objectives`] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  توليد تلقائي
                </Button>
              </div>
              <Textarea
                id={`objectives-${index}`}
                value={partnership.objectives || ''}
                onChange={(e) => handlePartnershipChange(index, 'objectives', e.target.value)}
                placeholder="مثال: تبادل الخبرات، توفير برامج تدريبية للطلاب"
                rows={3}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor={`activities-${index}`}>الأنشطة والمبادرات المشتركة</Label>
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => generateAIContent(index, 'activities')}
                  disabled={isLoadingAI[`${index}-activities`]}
                  className="text-xs border-teal-500 text-teal-600 hover:bg-teal-50 flex items-center gap-1"
                >
                  {isLoadingAI[`${index}-activities`] ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  توليد تلقائي
                </Button>
              </div>
              <Textarea
                id={`activities-${index}`}
                value={partnership.activities || ''}
                onChange={(e) => handlePartnershipChange(index, 'activities', e.target.value)}
                placeholder="مثال: تنظيم ورش عمل مشتركة، إقامة فعاليات ثقافية"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor={`responsible_person-${index}`}>الشخص/القسم المسؤول عن المتابعة من المدرسة</Label>
              <Select
                value={partnership.responsible_person || ''}
                onValueChange={(value) => handlePartnershipChange(index, 'responsible_person', value)}
              >
                <SelectTrigger id={`responsible_person-${index}`}>
                  <SelectValue placeholder="اختر المسؤول" />
                </SelectTrigger>
                <SelectContent>
                  {RESPONSIBLE_PARTIES.map((party) => (
                    <SelectItem key={party} value={party}>
                      {party}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        onClick={addPartnership}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        إضافة شراكة/تعاون جديد
      </Button>
    </div>
  );
};

export default PartnershipsSection;