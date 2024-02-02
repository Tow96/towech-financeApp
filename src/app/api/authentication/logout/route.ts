import { logout } from '@/libs/legacyStuff/db/UserModel';
import Middlewares from '@/libs/legacyStuff/middleware';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = async () => {
  try {
    const token = cookies().get('jid')?.value;
    const user = await Middlewares.checkRefresh();

    await logout(user._id, token);
    cookies().delete('jid');
    return NextResponse.json({ status: 204 });
  } catch (e) {
    return NextResponse.json(e);
  }
};
