import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-center">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              card: 'shadow-lg',
            },
          }}
        />
      </div>
    </div>
  );
}
