import { verifyEmail } from '@/libs/legacyStuff/db/UserModel';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
  const token = req.nextUrl.pathname.split('/').pop() || '';
  const { payload } = await jwtVerify(token, process.env.EMAILVERIFICATION_TOKEN_KEY as any);

  await verifyEmail(payload._id as any);
  return NextResponse.json({ status: 204 });
};
