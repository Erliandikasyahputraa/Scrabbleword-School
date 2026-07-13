import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';

export function useMaterial(courseId: string | undefined, materialId: string | undefined) {
  return useQuery({
    queryKey: ['material', materialId],
    queryFn: () => {
      if (!courseId || !materialId) {
        throw new Error('Missing parameters');
      }
      return fetchApi(`/courses/${courseId}/materials/${materialId}`);
    },
    enabled: !!courseId && !!materialId,
  });
}
