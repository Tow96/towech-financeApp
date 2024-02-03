import { editUser } from '@/libs/legacyStuff/db/UserModel';
import Middlewares from '@/libs/legacyStuff/middleware';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest, { params }: any) => {
  try {
    // Middlewares.checkAuth(req as any);
    const body = await req.json();
    const { userid } = params;

    const result = await editUser(userid as string, body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(e);
  }
};
