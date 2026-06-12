import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { SectionData } from '../types';

interface DashboardData {
  featured: {
    title: string;
    description: string;
    coverUrl: string;
  };
  sections: SectionData[];
}

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const { data } = await axios.get('/data.json');
      return data;
    },
  });
};
