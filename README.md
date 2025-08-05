# Firebase Authentication with Next.js

A complete Firebase Authentication implementation using Next.js 15, TypeScript, and Tailwind CSS.

## Features

- ✅ Email/Password Authentication
- ✅ Google Sign-In
- ✅ Protected Routes
- ✅ User State Management with React Context
- ✅ Responsive Design with Tailwind CSS
- ✅ TypeScript Support
- ✅ Loading States
- ✅ Error Handling

## Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd firebase-auth
pnpm install
```

### 2. Set up Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Enable "Google" provider (optional)
4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app config icon
   - Copy the configuration object

### 3. Environment Variables

1. Copy the environment example file:
```bash
cp .env.example .env.local
```

2. Fill in your Firebase configuration in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── dashboard/          # Protected dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Sign up page
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Home page
├── components/
│   └── ProtectedRoute.tsx # Higher-order component for route protection
├── contexts/
│   └── AuthContext.tsx    # Authentication context and hooks
└── lib/
    └── firebase.ts        # Firebase configuration
```

## Usage

### Authentication Context

The app uses React Context to manage authentication state:

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, signIn, signUp, signInWithGoogle, logout } = useAuth();
  
  // Your component logic
}
```

### Protected Routes

Wrap any component that requires authentication:

```tsx
import { ProtectedRoute } from '../components/ProtectedRoute';

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### Available Authentication Methods

1. **Email/Password Sign Up**
```tsx
await signUp(email, password);
```

2. **Email/Password Sign In**
```tsx
await signIn(email, password);
```

3. **Google Sign In**
```tsx
await signInWithGoogle();
```

4. **Sign Out**
```tsx
await logout();
```

## Firebase Security Rules

Make sure to set up proper Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access on all documents to any user signed in to the application
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to set the environment variables on your deployment platform.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Firebase** - Authentication and backend services
- **Tailwind CSS** - Utility-first CSS framework
- **React Context** - State management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
