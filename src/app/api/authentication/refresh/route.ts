import { NextResponse } from 'next/server';
import Middlewares from '@/libs/legacyStuff/middleware';
import TokenGenerator from '@/libs/legacyStuff/TokenGenerator';

export const POST = async () => {
  try {
    const user = await Middlewares.checkRefresh();
    return NextResponse.json({ token: TokenGenerator.authToken(user) });
  } catch (e) {
    return NextResponse.json(e);
  }
};
