import { redirectIfAuthenticated } from '../../lib/serverAuth';
import LoginClient from './LoginClient';

export default async function LoginPage() {
  // This will redirect to /dashboard if user is already authenticated
  await redirectIfAuthenticated();

  return <LoginClient />;
}
