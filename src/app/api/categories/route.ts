import { getCategories } from '@/libs/legacyStuff/db/CategoryModel';
import Middlewares from '@/libs/legacyStuff/middleware';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  try {
    Middlewares.checkAuth(req as any);
    const res = await getCategories();

    return NextResponse.json(res);
  } catch (e) {
    return NextResponse.json(e);
  }
};
