import { cookies } from 'next/headers';

export default async function getUsers() {
  const cook = (await cookies()).get('__session')?.value;
  const res = await fetch('http://localhost:3000', {
    headers: {
      Authorization: `Bearer ${cook}`,
    },
  });

  return res.json();
}
