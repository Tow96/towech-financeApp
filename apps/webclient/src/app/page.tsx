import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/button';

export default async function Index() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-5">
      <UserButton />
      <Button>TEST</Button>
    </div>
  );
}
