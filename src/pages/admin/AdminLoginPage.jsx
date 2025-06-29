import React, { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { KeyRound, Loader2, Mail } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAdminAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 arabic-text" dir="rtl">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-4">
            <KeyRound className="h-10 w-10 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-indigo-700">تسجيل دخول المدير</CardTitle>
          <CardDescription>الرجاء إدخال البريد الإلكتروني وكلمة المرور للوصول.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-lg pl-10"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-lg"
                placeholder="********"
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-3" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500 text-center w-full">
            هذه الصفحة مخصصة للمسؤولين فقط.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;