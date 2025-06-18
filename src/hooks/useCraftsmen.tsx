
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Craftsman {
  id: string;
  user_id: string;
  category_id: string;
  experience_years: number;
  hourly_rate?: number;
  description?: string;
  skills?: string[];
  available_at_home: boolean;
  has_car: boolean;
  payment_methods?: string[];
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
    phone?: string;
    cities?: {
      name: string;
    };
  };
  categories: {
    name: string;
  };
  craftsman_works: Array<{
    id: string;
    title: string;
    image_url?: string;
  }>;
}

export function useCraftsmen() {
  return useQuery({
    queryKey: ['craftsmen'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craftsmen')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url,
            phone,
            cities:city_id (name)
          ),
          categories:category_id (name),
          craftsman_works (id, title, image_url)
        `);
      
      if (error) throw error;
      return data as Craftsman[];
    },
  });
}

export function useCraftsman(id: string) {
  return useQuery({
    queryKey: ['craftsman', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craftsmen')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url,
            phone,
            cities:city_id (name)
          ),
          categories:category_id (name),
          craftsman_works (id, title, image_url, description)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Craftsman;
    },
    enabled: !!id,
  });
}
