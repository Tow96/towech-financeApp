import { UserButton } from '@clerk/nextjs';
import getUsers from '@/app/get-users';

export default async function Index() {
  const allUsers = await getUsers();
  console.log(allUsers);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-5">
      <UserButton />
    </div>
  );
}
