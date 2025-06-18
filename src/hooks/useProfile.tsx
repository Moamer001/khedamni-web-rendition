
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  user_type: 'client' | 'craftsman';
  gender?: 'male' | 'female';
  avatar_url?: string;
  city_id?: string;
  created_at: string;
  updated_at: string;
  cities?: {
    name: string;
  };
}

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          cities:city_id (name)
        `)
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<Profile> & { id: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', profileData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "تم تحديث الملف الشخصي بنجاح",
        description: "تم حفظ التغييرات",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
