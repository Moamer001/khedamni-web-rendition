
import React, { useState } from "react";
import {
  Info,
  FileText,
  Shield,
  Phone,
  LogOut,
  ChevronLeft,
  User,
  Edit,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useCities } from "@/hooks/useCities";

const Section = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}) => (
  <div className="mb-3 bg-white rounded-2xl shadow px-0">
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 focus:outline-none">
        <span className="flex items-center gap-2 text-[#202c76] text-base font-semibold">
          <Icon className="w-5 h-5" />
          {title}
        </span>
        <ChevronLeft className="w-4 h-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  </div>
);

const Profile = () => {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: cities } = useCities();
  const updateProfile = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    city_id: ''
  });

  React.useEffect(() => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        city_id: profile.city_id || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (user && profile) {
      await updateProfile.mutateAsync({
        id: user.id,
        ...editData
      });
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth';
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">لم يتم العثور على البيانات الشخصية</p>
          <Link to="/auth" className="text-blue-600 hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Profile Card */}
      <div className="max-w-md w-full mx-auto pt-8 mb-8 bg-white rounded-2xl shadow p-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-3 ring-2 ring-[#f3b12d] ring-offset-2 ring-offset-white">
          <AvatarImage
            src={profile.avatar_url}
            alt={`${profile.first_name} ${profile.last_name}`}
          />
          <AvatarFallback>
            {profile.first_name.charAt(0)}{profile.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        {isEditing ? (
          <div className="w-full space-y-3" dir="rtl">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">الاسم</Label>
                <Input
                  value={editData.first_name}
                  onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <Label className="text-sm">اللقب</Label>
                <Input
                  value={editData.last_name}
                  onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm">رقم الهاتف</Label>
              <Input
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="text-right"
                dir="rtl"
              />
            </div>
            
            <div>
              <Label className="text-sm">المدينة</Label>
              <Select 
                value={editData.city_id} 
                onValueChange={(value) => setEditData({...editData, city_id: value})}
              >
                <SelectTrigger className="text-right" dir="rtl">
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleSave} 
                disabled={updateProfile.isPending}
                className="flex-1"
              >
                {updateProfile.isPending ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-xl font-bold text-[#252525] mb-1" dir="rtl">
              {profile.first_name} {profile.last_name}
            </div>
            <div className="text-[#202c76] text-sm mb-1" dir="ltr">
              {profile.email}
            </div>
            {profile.phone && (
              <div className="text-gray-600 text-sm mb-1" dir="rtl">
                {profile.phone}
              </div>
            )}
            {profile.cities?.name && (
              <div className="text-gray-600 text-sm mb-3" dir="rtl">
                {profile.cities.name}
              </div>
            )}
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="rounded-full border border-[#bcbcbc] px-5 py-1.5 text-[#202c76] text-sm font-medium hover:bg-gray-50 transition mb-2"
            >
              <Edit className="w-4 h-4 ml-2" />
              تعديل الملف الشخصي
            </Button>
          </>
        )}
      </div>

      {/* Sections */}
      <div className="max-w-md w-full mx-auto">
        {/* زر حول الموقع */}
        <Link
          to="/about"
          className="flex items-center gap-2 px-7 py-3 mb-3 bg-white rounded-2xl shadow text-[#202c76] text-base font-semibold hover:bg-gray-50 transition w-full"
        >
          <Info className="w-5 h-5" />
          <span className="flex-1 text-right">حول الموقع</span>
          <ChevronLeft className="w-4 h-4 ml-auto" />
        </Link>

        {/* قانوني */}
        <Section title="قانوني" icon={FileText}>
          <div className="px-7 pb-3">
            <a
              href="/terms"
              className="flex items-center gap-2 py-2 text-gray-700 hover:underline"
            >
              <FileText className="w-5 h-5" />
              <span className="flex-1">شروط الاستخدام</span>
              <ChevronLeft className="w-4 h-4 ml-auto" />
            </a>
            <a
              href="/privacy"
              className="flex items-center gap-2 py-2 text-gray-700 hover:underline"
            >
              <Shield className="w-5 h-5" />
              <span className="flex-1">سياسة الخصوصية</span>
              <ChevronLeft className="w-4 h-4 ml-auto" />
            </a>
          </div>
        </Section>

        {/* المزيد */}
        <Section title="المزيد" icon={User}>
          <div className="px-7 pb-3">
            <Link
              to="/contact"
              className="flex items-center gap-2 py-2 text-gray-700 hover:underline w-full text-right"
            >
              <Phone className="w-5 h-5" />
              <span className="flex-1">تواصل معنا</span>
              <ChevronLeft className="w-4 h-4 ml-auto" />
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 py-2 text-gray-700 hover:underline w-full text-right"
              type="button"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1">تسجيل الخروج</span>
              <ChevronLeft className="w-4 h-4 ml-auto" />
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Profile;
