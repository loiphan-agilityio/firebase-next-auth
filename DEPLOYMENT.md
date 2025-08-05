# Deployment Guide

This guide covers deploying your Firebase Authentication Next.js app to various platforms.

## Environment Variables

Before deploying, make sure you have these environment variables set:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Vercel Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub, GitLab, or Bitbucket.

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/in with your Git provider
3. Click "New Project"
4. Import your repository

### 3. Configure Build Settings

Vercel should auto-detect Next.js settings:
- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: `pnpm build` (or `npm run build`)
- **Output Directory**: .next

### 4. Add Environment Variables

In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add each Firebase environment variable
3. Make sure to select the appropriate environments (Production, Preview, Development)

### 5. Deploy

Click "Deploy" and Vercel will build and deploy your app.

## Netlify Deployment

### 1. Build Configuration

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Deploy via Git

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

## Firebase Hosting

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login and Initialize

```bash
firebase login
firebase init hosting
```

### 3. Configure

Select these options:
- **Public directory**: `out`
- **Configure as SPA**: Yes
- **Set up automatic builds**: Optional

### 4. Update package.json

Add export script:

```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

### 5. Deploy

```bash
pnpm export
firebase deploy
```

## AWS Amplify

### 1. Push to Repository

Make sure your code is in GitHub, GitLab, or Bitbucket.

### 2. Create Amplify App

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your repository

### 3. Build Settings

Use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm
        - pnpm install
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 4. Environment Variables

Add your Firebase environment variables in the Amplify Console.

## Post-Deployment Checklist

### 1. Update Firebase Configuration

In Firebase Console:

1. **Authentication** → **Settings** → **Authorized Domains**
   - Add your production domain
   - Add your preview domains (if using Vercel)

2. **Authentication** → **Sign-in Method** → **Google**
   - Update authorized redirect URIs if using Google Sign-In

### 2. Update CORS Settings

If using Firestore, update security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Test Authentication

- Test email/password signup and login
- Test Google Sign-In (if enabled)
- Test protected routes
- Test logout functionality

### 4. Monitor Performance

Set up monitoring:
- Firebase Analytics
- Error tracking (Sentry, LogRocket, etc.)
- Performance monitoring

## Troubleshooting

### Common Issues

1. **Firebase Auth Domain Error**
   - Solution: Add your domain to Firebase authorized domains

2. **Environment Variables Not Working**
   - Solution: Ensure variables start with `NEXT_PUBLIC_`
   - Redeploy after adding variables

3. **Google Sign-In Not Working**
   - Solution: Update OAuth redirect URIs in Google Cloud Console

4. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Check for TypeScript errors

### Debug Mode

For development debugging, add to your Firebase config:

```typescript
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Enable debug mode for localhost
  console.log('Firebase Auth Debug Mode Enabled');
}
```

## Security Best Practices

1. **Environment Variables**: Never commit Firebase config to version control
2. **Firestore Rules**: Implement proper security rules
3. **HTTPS Only**: Ensure your deployed app uses HTTPS
4. **Regular Updates**: Keep Firebase SDK and dependencies updated
5. **Error Handling**: Don't expose sensitive error details to users
