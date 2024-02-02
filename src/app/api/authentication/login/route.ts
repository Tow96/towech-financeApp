import { login } from '@/libs/legacyStuff/db/UserModel';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { authToken, refreshToken } = await login(body);

  const now = new Date();
  const expiration = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  if (process.env.NODE_ENV === 'development') {
    cookies().set('jid', refreshToken, {
      httpOnly: true,
      expires: body.keepSession ? expiration : undefined,
    });
  } else {
    cookies().set('jid', refreshToken, {
      httpOnly: true,
      expires: body.keepSession ? expiration : undefined,
      secure: true,
      // domain: process.env.COOKIEDOMAIN || '',
    });
  }

  return NextResponse.json({ token: authToken });
};
