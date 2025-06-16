import { useMutation } from '@tanstack/react-query';

interface AddCategoryDto {
  name: string;
  type: string;
}

export const useAddCategory = () => {
  // const auth = useAuth();

  return useMutation({
    mutationFn: async (newCategory: AddCategoryDto) => {
      // const token = (await auth.getToken()) || '';
      const token = '';

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/category`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}` },
        body: newCategory,
      })

      return res.json();
    }
  })
}
