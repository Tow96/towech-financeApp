import { GetAllCategoriesDto } from './get-all-categories.dto';

export async function GetAllCategories(token: string): Promise<GetAllCategoriesDto> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/category`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
}
