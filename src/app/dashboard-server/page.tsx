import { requireAuth } from '../../lib/serverAuth';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  // This will redirect to /login if user is not authenticated
  const user = await requireAuth();

  return <DashboardClient user={user} />;
}
