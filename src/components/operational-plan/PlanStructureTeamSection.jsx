import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PlusCircle, Users, FileText, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { COMMITTEE_MEMBER_ROLES, JOB_TITLES_KSA } from '@/lib/operationalPlanConstants';

const PlanStructureTeamSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [committeeMembers, setCommitteeMembers] = useState(planData.planning_committee_data || []);
  const [teamResponsibilities, setTeamResponsibilities] = useState(planData.team_responsibilities_data || '');
  const [showCommitteeForm, setShowCommitteeForm] = useState(planData.planning_committee_data && planData.planning_committee_data.length > 0);
  const [showResponsibilitiesForm, setShowResponsibilitiesForm] = useState(!!planData.team_responsibilities_data);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    setCommitteeMembers(planData.planning_committee_data || []);
    setTeamResponsibilities(planData.team_responsibilities_data || '');
    setShowCommitteeForm(planData.planning_committee_data && planData.planning_committee_data.length > 0);
    setShowResponsibilitiesForm(!!planData.team_responsibilities_data);
  }, [planData.planning_committee_data, planData.team_responsibilities_data]);

  const handleCommitteeMemberChange = (index, field, value) => {
    const updatedMembers = [...committeeMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setCommitteeMembers(updatedMembers);
    onChange({ planning_committee_data: updatedMembers });
  };

  const addCommitteeMember = () => {
    const newMember = { id: Date.now(), name: '', job_title: '', role_in_committee: '', additional_responsibilities: '' };
    const updatedMembers = [...committeeMembers, newMember];
    setCommitteeMembers(updatedMembers);
    onChange({ planning_committee_data: updatedMembers });
  };

  const removeCommitteeMember = (index) => {
    const updatedMembers = committeeMembers.filter((_, i) => i !== index);
    setCommitteeMembers(updatedMembers);
    onChange({ planning_committee_data: updatedMembers });
    if (updatedMembers.length === 0) {
      setShowCommitteeForm(false);
    }
  };

  const handleTeamResponsibilitiesChange = (e) => {
    setTeamResponsibilities(e.target.value);
    onChange({ team_responsibilities_data: e.target.value });
  };

  const generateDefaultResponsibilities = async () => {
    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const defaultResponsibilities = `
- تحليل واقع المدرسة وتحديد نقاط القوة والضعف والفرص والتحديات.
- صياغة رؤية ورسالة المدرسة وقيمها الأساسية.
- تحديد الأهداف العامة والتفصيلية للخطة التشغيلية.
- اقتراح البرامج والمبادرات التنفيذية لتحقيق الأهداف.
- وضع مؤشرات أداء رئيسية لمتابعة وتقويم الخطة.
- تحديد الموارد اللازمة لتنفيذ الخطة.
- إعداد الجدول الزمني لتنفيذ البرامج والمبادرات.
- متابعة تنفيذ الخطة وتقديم تقارير دورية.
- مراجعة الخطة وتحديثها بشكل دوري بناءً على المستجدات.
- تعزيز ثقافة التخطيط والتحسين المستمر في المدرسة.
      `.trim();
      setTeamResponsibilities(defaultResponsibilities);
      onChange({ team_responsibilities_data: defaultResponsibilities });
      toast({ title: "نجاح", description: "تم توليد المسؤوليات الافتراضية." });
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء توليد المسؤوليات.", variant: "destructive" });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const committeeLeadersCount = committeeMembers.filter(member => member.role_in_committee === 'leader').length;
  const responsibilitiesDefined = teamResponsibilities && teamResponsibilities.trim() !== '';

  return (
    <div className="space-y-8">
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5 text-indigo-600" /> تكوين لجنة إعداد الخطة التشغيلية</CardTitle>
          <CardDescription>هل ترغب في تحديد أعضاء لجنة إعداد الخطة التشغيلية؟</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {!showCommitteeForm ? (
            <div className="flex gap-4">
              <Button onClick={() => { setShowCommitteeForm(true); if(committeeMembers.length === 0) addCommitteeMember(); }} className="bg-indigo-600 hover:bg-indigo-700">نعم، تحديد أعضاء اللجنة</Button>
              <Button variant="outline" onClick={() => setShowCommitteeForm(false)}>لا، التخطي لاحقًا</Button>
            </div>
          ) : (
            <>
              {committeeMembers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">لم يتم إضافة أعضاء للجنة بعد.</p>
                  <Button onClick={addCommitteeMember} className="mt-4">
                    <PlusCircle className="ml-2 h-4 w-4" /> إضافة أول عضو
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[5%]">م</TableHead>
                        <TableHead className="w-[25%]">الاسم</TableHead>
                        <TableHead className="w-[20%]">المسمى الوظيفي</TableHead>
                        <TableHead className="w-[20%]">الدور في اللجنة</TableHead>
                        <TableHead className="w-[25%]">مسؤوليات إضافية (اختياري)</TableHead>
                        <TableHead className="w-[5%]">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {committeeMembers.map((member, index) => (
                        <TableRow key={member.id || index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Input
                              value={member.name}
                              onChange={(e) => handleCommitteeMemberChange(index, 'name', e.target.value)}
                              placeholder="اسم العضو"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={member.job_title}
                              onValueChange={(value) => handleCommitteeMemberChange(index, 'job_title', value)}
                            >
                              <SelectTrigger><SelectValue placeholder="اختر المسمى" /></SelectTrigger>
                              <SelectContent>
                                {JOB_TITLES_KSA.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={member.role_in_committee}
                              onValueChange={(value) => handleCommitteeMemberChange(index, 'role_in_committee', value)}
                            >
                              <SelectTrigger><SelectValue placeholder="اختر الدور" /></SelectTrigger>
                              <SelectContent>
                                {COMMITTEE_MEMBER_ROLES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={member.additional_responsibilities}
                              onChange={(e) => handleCommitteeMemberChange(index, 'additional_responsibilities', e.target.value)}
                              placeholder="مسؤوليات إضافية"
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeCommitteeMember(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <Button onClick={addCommitteeMember} variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                  <PlusCircle className="ml-2 h-4 w-4" /> إضافة عضو جديد
                </Button>
                <Button variant="outline" onClick={() => { setShowCommitteeForm(false); onChange({ planning_committee_data: [] }); setCommitteeMembers([]); }}>
                  إلغاء تحديد اللجنة
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-teal-600" /> مسؤوليات ومهام فريق التخطيط المدرسي</CardTitle>
          <CardDescription>هل ترغب في تضمين قائمة بمسؤوليات ومهام فريق التخطيط المدرسي؟</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {!showResponsibilitiesForm ? (
            <div className="flex gap-4">
              <Button onClick={() => setShowResponsibilitiesForm(true)} className="bg-teal-600 hover:bg-teal-700">نعم، تضمين المسؤوليات</Button>
              <Button variant="outline" onClick={() => setShowResponsibilitiesForm(false)}>لا، التخطي</Button>
            </div>
          ) : (
            <>
              <Textarea
                value={teamResponsibilities}
                onChange={handleTeamResponsibilitiesChange}
                placeholder="اكتب مسؤوليات ومهام فريق التخطيط المدرسي هنا..."
                rows={8}
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
              <div className="flex justify-between items-center mt-2">
                <Button onClick={generateDefaultResponsibilities} variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50" disabled={isGeneratingAI}>
                  {isGeneratingAI ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 h-4 w-4" />}
                  {isGeneratingAI ? 'جاري التوليد...' : 'توليد المسؤوليات الافتراضية'}
                </Button>
                <Button variant="outline" onClick={() => { setShowResponsibilitiesForm(false); setTeamResponsibilities(''); onChange({ team_responsibilities_data: '' }); }}>
                  إلغاء تحديد المسؤوليات
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">يمكنك تعديل هذه المسؤوليات أو إضافة مهام مخصصة حسب احتياجات مدرستك.</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-md text-blue-700">ملخص فريق إعداد الخطة</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-2xl font-bold text-blue-600">{committeeMembers.length}</p>
            <p className="text-sm text-gray-600">عدد أعضاء اللجنة</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-2xl font-bold text-blue-600">{committeeLeadersCount}</p>
            <p className="text-sm text-gray-600">رئيس اللجنة</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center justify-center">
            {responsibilitiesDefined ? (
              <CheckCircle className="w-8 h-8 text-green-500 mb-1" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500 mb-1" />
            )}
            <p className="text-sm text-gray-600">تحديد المسؤوليات</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanStructureTeamSection;