"use client";

import {
  signIn,
  getProviders,
  ClientSafeProvider,
  LiteralUnion,
} from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SignInSkeleton() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <div className="max-w-md w-full p-8 bg-[var(--color-bg-primary)] rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="h-8 w-32 bg-gray-200 rounded-md mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-md mx-auto animate-pulse"></div>
        </div>

        <div className="space-y-4">
          <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        <div className="mt-8 text-center">
          <div className="h-3 w-64 bg-gray-200 rounded-md mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

interface AuthError {
  [key: string]: {
    message: string;
    className: string;
  };
}

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const authErrors: AuthError = {
    OAuthAccountNotLinked: {
      message:
        "This email is already associated with another account. Please sign in with the same method you used previously.",
      className: "bg-red-50 border-red-200 text-red-600",
    },
    AccessDenied: {
      message: "Access denied. You don't have permission to sign in.",
      className: "bg-red-50 border-red-200 text-red-600",
    },
    Default: {
      message: "An error occurred during sign in. Please try again.",
      className: "bg-red-50 border-red-200 text-red-600",
    },
  };

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (err) {
        console.error("Failed to load providers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProviders();
  }, []);

  const errorDetails = error ? authErrors[error] || authErrors.Default : null;

  if (isLoading) return <SignInSkeleton />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-bg-secondary)]">
      <div className="max-w-md w-full p-8 bg-[var(--color-bg-primary)] rounded-lg shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-primary font-semibold text-gray-900 mb-2">
            Welcome
          </h1>
          <p className="text-gray-600 font-primary">
            Sign in to continue your journey
          </p>
        </div>

        {errorDetails && (
          <div
            className={`mb-6 p-4 border rounded-lg ${errorDetails.className}`}
          >
            <p className="text-sm text-center font-primary">
              {errorDetails.message}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id, { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 
                         bg-white border border-gray-300 rounded-lg shadow-sm 
                         hover:bg-gray-50 transition-colors duration-200 font-primary"
                aria-label={`Sign in with ${provider.name}`}
              >
                {provider.id === "google" && (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className="text-gray-700 font-medium">
                  Continue with {provider.name}
                </span>
              </button>
            ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 font-primary">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInContent />
    </Suspense>
  );
}
