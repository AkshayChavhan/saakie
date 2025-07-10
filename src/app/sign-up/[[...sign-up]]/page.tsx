import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-center">
        <SignUp
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
