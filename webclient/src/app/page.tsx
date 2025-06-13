import { ReactNode } from "react";
import { redirect } from 'next/navigation';
const IndexPage = (): ReactNode => redirect('dashboard');

export default IndexPage;