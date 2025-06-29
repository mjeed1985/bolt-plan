import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, PlusCircle, Users, FileText, CheckCircle, XCircle, Sparkles, Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { COMMITTEE_MEMBER_ROLES, JOB_TITLES_KSA } from '@/lib/operationalPlanConstants';

const DEFAULT_EXCELLENCE_COMMITTEE_RESPONSIBILITIES = `
- نشر ثقافة التميز والجودة في المدرسة.
- متابعة تطبيق معايير التقويم والاعتماد المدرسي.
- الإشراف على عمليات التقويم الذاتي للمدرسة وتحديد نقاط القوة وفرص التحسين.
- إعداد وتنفيذ خطط التحسين والتطوير المستمر بناءً على نتائج التقويم.
- متابعة مؤشرات الأداء الرئيسية المتعلقة بالتميز المدرسي.
- تنسيق جهود المدرسة للمشاركة في جوائز التميز المحلية والوطنية.
- توثيق الممارسات المتميزة ونشرها داخل المدرسة وخارجها.
- تقديم الدعم والتدريب للمعلمين والإداريين في مجالات الجودة والتميز.
- تحليل رضا المستفيدين (طلاب، أولياء أمور، معلمين) واقتراح التحسينات.
- إعداد تقارير دورية عن مستوى أداء المدرسة في مجالات التميز وتقديمها للجهات المعنية.
`.trim();

const SchoolExcellenceCommitteeSection = ({ planData, onChange }) => {
  const { toast } = useToast();
  const [committeeMembers, setCommitteeMembers] = useState(planData.excellence_committee_members || []);
  const [teamResponsibilities, setTeamResponsibilities] = useState(planData.excellence_committee_responsibilities || '');
  const [showCommitteeForm, setShowCommitteeForm] = useState(planData.excellence_committee_members && planData.excellence_committee_members.length > 0);
  const [showResponsibilitiesForm, setShowResponsibilitiesForm] = useState(!!planData.excellence_committee_responsibilities);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    setCommitteeMembers(planData.excellence_committee_members || []);
    setTeamResponsibilities(planData.excellence_committee_responsibilities || '');
    setShowCommitteeForm(planData.excellence_committee_members && planData.excellence_committee_members.length > 0);
    setShowResponsibilitiesForm(!!planData.excellence_committee_responsibilities);
  }, [planData.excellence_committee_members, planData.excellence_committee_responsibilities]);

  const handleCommitteeMemberChange = (index, field, value) => {
    const updatedMembers = [...committeeMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setCommitteeMembers(updatedMembers);
    onChange({ excellence_committee_members: updatedMembers });
  };

  const addCommitteeMember = () => {
    const newMember = { id: Date.now(), name: '', job_title: '', role_in_committee: '', additional_responsibilities: '' };
    const updatedMembers = [...committeeMembers, newMember];
    setCommitteeMembers(updatedMembers);
    onChange({ excellence_committee_members: updatedMembers });
  };

  const removeCommitteeMember = (index) => {
    const updatedMembers = committeeMembers.filter((_, i) => i !== index);
    setCommitteeMembers(updatedMembers);
    onChange({ excellence_committee_members: updatedMembers });
    if (updatedMembers.length === 0) {
      setShowCommitteeForm(false);
    }
  };

  const handleTeamResponsibilitiesChange = (e) => {
    setTeamResponsibilities(e.target.value);
    onChange({ excellence_committee_responsibilities: e.target.value });
  };

  const generateDefaultResponsibilities = async () => {
    setIsGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      setTeamResponsibilities(DEFAULT_EXCELLENCE_COMMITTEE_RESPONSIBILITIES);
      onChange({ excellence_committee_responsibilities: DEFAULT_EXCELLENCE_COMMITTEE_RESPONSIBILITIES });
      toast({ title: "نجاح", description: "تم توليد مسؤوليات ومهام لجنة التميز الافتراضية." });
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
      <Card className="border-green-200 shadow-sm">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-600" /> تشكيل لجنة التميز المدرسي</CardTitle>
          <CardDescription>هل ترغب في تحديد أعضاء لجنة التميز المدرسي؟</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {!showCommitteeForm ? (
            <div className="flex gap-4">
              <Button onClick={() => { setShowCommitteeForm(true); if(committeeMembers.length === 0) addCommitteeMember(); }} className="bg-green-600 hover:bg-green-700">نعم، تحديد أعضاء اللجنة</Button>
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
                <Button onClick={addCommitteeMember} variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  <PlusCircle className="ml-2 h-4 w-4" /> إضافة عضو جديد
                </Button>
                <Button variant="outline" onClick={() => { setShowCommitteeForm(false); onChange({ excellence_committee_members: [] }); setCommitteeMembers([]); }}>
                  إلغاء تحديد اللجنة
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-orange-600" /> مسؤوليات ومهام لجنة التميز المدرسي</CardTitle>
          <CardDescription>هل ترغب في تضمين قائمة بمسؤوليات ومهام لجنة التميز المدرسي؟</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {!showResponsibilitiesForm ? (
            <div className="flex gap-4">
              <Button onClick={() => setShowResponsibilitiesForm(true)} className="bg-orange-600 hover:bg-orange-700">نعم، تضمين المسؤوليات</Button>
              <Button variant="outline" onClick={() => setShowResponsibilitiesForm(false)}>لا، التخطي</Button>
            </div>
          ) : (
            <>
              <Textarea
                value={teamResponsibilities}
                onChange={handleTeamResponsibilitiesChange}
                placeholder="اكتب مسؤوليات ومهام لجنة التميز المدرسي هنا..."
                rows={10}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <div className="flex justify-between items-center mt-2">
                <Button onClick={generateDefaultResponsibilities} variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50" disabled={isGeneratingAI}>
                  {isGeneratingAI ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Sparkles className="ml-2 h-4 w-4" />}
                  {isGeneratingAI ? 'جاري التوليد...' : 'توليد المسؤوليات والمهام الافتراضية'}
                </Button>
                <Button variant="outline" onClick={() => { setShowResponsibilitiesForm(false); setTeamResponsibilities(''); onChange({ excellence_committee_responsibilities: '' }); }}>
                  إلغاء تحديد المسؤوليات
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">يمكنك تعديل هذه المسؤوليات أو إضافة مهام مخصصة حسب احتياجات مدرستك ولجنة التميز.</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-sky-200 bg-sky-50/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-md text-sky-700">ملخص لجنة التميز المدرسي</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-2xl font-bold text-sky-600">{committeeMembers.length}</p>
            <p className="text-sm text-gray-600">عدد أعضاء اللجنة</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-2xl font-bold text-sky-600">{committeeLeadersCount}</p>
            <p className="text-sm text-gray-600">رئيس اللجنة</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow flex flex-col items-center justify-center">
            {responsibilitiesDefined ? (
              <CheckCircle className="w-8 h-8 text-green-500 mb-1" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500 mb-1" />
            )}
            <p className="text-sm text-gray-600">تحديد المسؤوليات والمهام</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolExcellenceCommitteeSection;