import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Wallet, 
  BarChart3, 
  Shield, 
  Smartphone, 
  TrendingUp, 
  Users,
  ChevronRight
} from "lucide-react";
import { Metadata } from "next";
import { ModeToggle } from "@/components/theme-mode-toggle";

export const metadata: Metadata = {
  title: "My Wallets - Personal Finance Management Made Simple",
  description: "Track your expenses, manage multiple wallets, and gain insights into your spending habits with our intuitive financial management platform. Start managing your finances like a pro today.",
  keywords: [
    "personal finance",
    "expense tracking", 
    "wallet management",
    "financial analytics",
    "budget tracker",
    "money management",
    "spending insights",
    "financial planning"
  ],
  authors: [{ name: "My Wallets Team" }],
  creator: "My Wallets",
  publisher: "My Wallets",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mywallets.app",
    siteName: "My Wallets",
    title: "My Wallets - Personal Finance Management Made Simple",
    description: "Track your expenses, manage multiple wallets, and gain insights into your spending habits with our intuitive financial management platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Wallets - Personal Finance Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Wallets - Personal Finance Management Made Simple",
    description: "Track your expenses, manage multiple wallets, and gain insights into your spending habits with our intuitive financial management platform.",
    creator: "@mywallets",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  alternates: {
    canonical: "https://mywallets.app",
  },
  category: "finance",
};

export default async function LandingPage() {
  const session = await auth();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "My Wallets",
    "description": "Personal finance management platform for tracking expenses, managing multiple wallets, and gaining insights into spending habits.",
    "url": "https://mywallets.app",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free personal finance management"
    },
    "featureList": [
      "Multiple Wallets Management",
      "Smart Analytics",
      "Expense Tracking", 
      "Bank-Level Security",
      "Mobile Friendly",
      "Easy Sharing"
    ],
    "publisher": {
      "@type": "Organization",
      "name": "My Wallets",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mywallets.app/logo.png"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">My Wallets</span>
            </div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
              {session?.user ? (
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="relative z-10">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
                  Manage Your Finances
                </span>
                <br />
                <span className="text-foreground">Like a Pro</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Track your expenses, manage multiple wallets, and gain insights into your spending habits 
                with our intuitive and powerful financial management platform.
              </p>
              <div className="mt-10 flex justify-center">
                <Button size="lg" className="h-12 px-8" asChild>
                  <Link href="/register">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-brand-teal/20 to-brand-orange/20 rounded-full blur-3xl opacity-20" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to manage your money
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make financial management simple, secure, and insightful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Wallets</h3>
              <p className="text-muted-foreground">
                Organize your finances with multiple wallets for different purposes. 
                Track spending across various accounts effortlessly.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Get detailed insights into your spending patterns with beautiful charts 
                and comprehensive financial analytics.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-brand-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
              <p className="text-muted-foreground">
                Categorize and track your expenses automatically. 
                See where your money goes and make informed financial decisions.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-brand-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bank-Level Security</h3>
              <p className="text-muted-foreground">
                Your financial data is protected with enterprise-grade security 
                and encryption. Your privacy is our priority.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-brand-pink/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-brand-pink" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-muted-foreground">
                Access your financial data anywhere, anytime. 
                Fully responsive design that works on all your devices.
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
              <p className="text-muted-foreground">
                Share expenses with family and friends. 
                Collaborate on budgets and keep everyone on the same page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-blue to-brand-purple p-12">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to take control of your finances?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already transformed their financial management. 
                Start your journey today - it's completely free!
              </p>
              <Button size="lg" variant="secondary" className="h-12 px-8" asChild>
                <Link href="/register">
                  Get Started Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="ml-2 font-semibold">My Wallets</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 My Wallets. Built with ❤️ for better financial management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}