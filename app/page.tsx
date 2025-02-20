'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { ArrowRight, ShoppingBasket } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <ShoppingBasket className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">SharedList</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {user ? (
            <Link href="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Shopping Lists Made Simple
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create, share, and manage shopping lists with your family and friends. Stay organized and never forget an item again.
                </p>
              </div>
              <div className="space-x-4">
                {user ? (
                  <Link href="/dashboard">
                    <Button>
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/sign-up">
                    <Button>
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white rounded-full dark:bg-gray-900">
                  <svg
                    className=" h-6 w-6 text-gray-800 dark:text-gray-200"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Create Lists</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create and organize your shopping lists with ease.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white rounded-full dark:bg-gray-900">
                  <svg
                    className=" h-6 w-6 text-gray-800 dark:text-gray-200"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" x2="12" y1="2" y2="15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Share Instantly</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Share your lists with family and friends in real-time.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-white rounded-full dark:bg-gray-900">
                  <svg
                    className=" h-6 w-6 text-gray-800 dark:text-gray-200"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Stay Secure</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Your lists are protected with enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 SharedList. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}