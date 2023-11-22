/** page.tsx
 * Copyright (c) 2023, Towechlabs
 *
 * Root page for app, unused, so it immediately redirects
 */
import { redirect } from 'next/navigation';

const Home = () => redirect('/dashboard');
export default Home;
