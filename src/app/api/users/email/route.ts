import Middlewares from '@/libs/legacyStuff/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/libs/legacyStuff/db/prisma';
import Mailer from '@/libs/legacyStuff/mailer';
import TokenGenerator from '@/libs/legacyStuff/TokenGenerator';

export const GET = async (req: NextRequest) => {
  try {
    const user = Middlewares.checkAuth(req);
    const token = TokenGenerator.verificationToken(user._id, user.username);

    // Confirms that the user still exists
    const dbUser = await prisma.users.findFirst({ where: { id: user._id } });
    if (!dbUser) return NextResponse.json({ status: 404, message: 'User not found' });

    Mailer.accountVerification(dbUser.name, dbUser.username, token);

    return NextResponse.json({ status: 204 });
  } catch (error) {
    return NextResponse.json(error);
  }
};
