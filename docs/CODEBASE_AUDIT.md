# My Wallets - Codebase Audit Report

**Date:** December 16, 2025  
**Project:** My Wallets Next.js  
**Version:** 0.1.0  
**Auditor:** GitHub Copilot  
**Status:** Learning Project Audit

---

## 🎯 Executive Summary

This is a comprehensive audit of the My Wallets expense tracker application built with Next.js 15. The application is well-structured for a learning project and demonstrates good understanding of modern web development practices. However, there are several security concerns, performance optimizations, and best practices that should be addressed before production deployment.

**Overall Assessment:** 🟡 **Good Foundation - Needs Production Hardening**

### Key Findings

- ✅ **Strengths:** 12 positive aspects
- ⚠️ **Warnings:** 8 areas needing attention
- 🔴 **Critical:** 6 security/production concerns

---

## 📊 Project Overview

### Tech Stack

- **Framework:** Next.js 15.4.5 (App Router)
- **Runtime:** React 19.1.0
- **Database:** PostgreSQL with Prisma 7.1.0
- **Authentication:** NextAuth.js v5 (beta)
- **Styling:** Tailwind CSS 4.0
- **UI Components:** Radix UI
- **Deployment:** Docker support with standalone output

### Architecture

```
app/
├── (root)/          # Protected routes
├── api/             # API routes
├── login/           # Auth pages
└── register/
components/          # Reusable UI
lib/                 # Business logic
prisma/             # Database schema
```

---

## ✅ What's Working Well

### 1. **Modern Next.js Structure**

The project uses Next.js 15's App Router correctly with proper route groups and layouts.

### 2. **Type Safety**

- TypeScript with strict mode enabled
- Prisma-generated types in use
- Good type definitions throughout

### 3. **Authentication Architecture**

- Proper use of NextAuth.js v5
- JWT strategy with secure session handling
- Multiple auth providers (GitHub, Google, Credentials)
- Middleware-based route protection

### 4. **Database Design**

- Well-structured Prisma schema
- Proper relations between models
- Cascade deletes configured
- Timestamps on all models

### 5. **Docker Support**

- Multi-stage Docker build
- Production-optimized image
- Docker Compose for local development
- Standalone output configuration

### 6. **Code Organization**

- Clean separation of concerns
- Server actions in dedicated file
- API routes properly structured
- Reusable components

### 7. **Development Tools**

- ESLint configuration
- TypeScript type checking
- Database seeding script
- Development environment setup

### 8. **UI/UX Components**

- Professional UI using Radix UI primitives
- Responsive design considerations
- Loading states and error handling
- Toast notifications for user feedback

### 9. **Recent Improvements**

- Successfully upgraded to Prisma 7
- Fixed all linting issues
- Proper Image optimization with Next.js Image component
- Clean TypeScript types

### 10. **Analytics Module**

Well-structured analytics with proper type definitions and comprehensive calculations.

### 11. **Password Security**

- bcrypt for password hashing with cost factor 12
- Password reset token system with expiration

### 12. **Environment Management**

Good `.env.example` file documenting required environment variables.

---

## ⚠️ Areas Needing Improvement

### 1. **Security: Logging Sensitive Information** 🔴 **CRITICAL**

**Location:** `auth.ts`, `lib/actions.ts`

**Issue:**

```typescript
// auth.ts lines 33, 45, 51, 62, 66
console.log("Missing credentials");
console.log("User not found");
console.log("User has no password set");
console.log("Invalid password");
console.log(`User found: ${user.createdAt}`);
```

**Risk:** These logs can:

- Expose authentication flow details to attackers
- Help enumerate valid user emails
- Reveal system behavior patterns
- Leak information in production logs

**Recommendation:**

```typescript
// Use a proper logging library with log levels
import { logger } from "@/lib/logger";

// In production, don't log auth failures
if (process.env.NODE_ENV === "development") {
  logger.debug("Auth attempt failed", { reason: "user_not_found" });
}

// OR use structured logging
logger.info("Auth attempt", {
  success: false,
  userId: user?.id, // Don't log email
  timestamp: Date.now(),
});
```

---

### 2. **Security: Environment Variable Exposure** 🔴 **CRITICAL**

**Location:** `lib/email.ts`, missing validation

**Issue:**

```typescript
const resend = new Resend(process.env.RESEND_API_KEY);
```

No validation that required environment variables exist before using them.

**Risk:**

- Application crashes in production if env vars missing
- Silent failures that are hard to debug
- Potential security issues with undefined values

**Recommendation:**

```typescript
// Create lib/config.ts
const requiredEnvVars = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "RESEND_API_KEY",
] as const;

function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Call in app initialization
validateEnv();

// Type-safe env access
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  // ... etc
} as const;
```

---

### 3. **Security: Database Query Authorization** ⚠️ **HIGH**

**Location:** `app/api/categories/[id]/route.ts`

**Issue:**

```typescript
const category = await prisma.category.findUnique({
  where: { id: categoryId, userId: userId as string },
});

if (!category) {
  return NextResponse.json({ error: "Category not found" }, { status: 404 });
}
// Check again after fetching?
if (category.userId !== userId) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

**Problems:**

1. Double authorization check (redundant)
2. Returns 404 for both "not found" and "not authorized" (info leakage)
3. Type assertion `as string` without validation

**Recommendation:**

```typescript
// First verify ownership in the WHERE clause
const category = await prisma.category.findFirst({
  where: {
    id: categoryId,
    userId: userId, // Remove as string, fix type at source
  },
});

if (!category) {
  // Don't distinguish between not found and not authorized
  return NextResponse.json(
    {
      error: "Category not found or access denied",
    },
    { status: 404 }
  );
}

// Only one check needed
await prisma.category.delete({ where: { id: categoryId } });
```

---

### 4. **Security: SQL Injection Prevention** ✅ **LOW RISK**

**Current Status:** Using Prisma ORM which prevents SQL injection automatically.

**Note:** Good practice. Prisma parameterizes all queries, so no raw SQL injection risk. However, if you ever add raw queries:

```typescript
// ❌ NEVER do this
await prisma.$executeRaw`SELECT * FROM users WHERE email = ${email}`;

// ✅ Always use tagged templates
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
```

---

### 5. **Error Handling: Generic Error Messages** ⚠️

**Location:** Multiple API routes

**Issue:**

```typescript
catch (error) {
  console.error("Error creating balance:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

**Problems:**

1. All errors return same message (unhelpful for debugging)
2. No error tracking/monitoring
3. Lost context in production
4. No error reporting to external service

**Recommendation:**

```typescript
import * as Sentry from '@sentry/nextjs'; // or similar

catch (error) {
  // Log with context
  console.error("Error creating balance:", {
    error: error instanceof Error ? error.message : 'Unknown error',
    userId: session.user.id,
    timestamp: new Date().toISOString(),
  });

  // Report to monitoring service
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { operation: 'create_balance' },
      user: { id: session.user.id },
    });
  }

  // Return helpful error in dev, generic in prod
  const message = process.env.NODE_ENV === 'development'
    ? error instanceof Error ? error.message : 'Unknown error'
    : 'Internal server error';

  return NextResponse.json({ error: message }, { status: 500 });
}
```

---

### 6. **Performance: Database Query Optimization** ⚠️

**Location:** `lib/actions.ts`, `hooks/use-dashboard-data.ts`

**Issue:**

```typescript
// Fetching transactions with all relations every time
const transactions = await prisma.transaction.findMany({
  include: {
    category: true,
    user: true,
    balance: true,
  },
});
```

**Problems:**

1. Over-fetching data (user relation not always needed)
2. No pagination
3. No query result caching
4. Could be slow with many transactions

**Recommendation:**

```typescript
// Add pagination
export async function fetchTransactions(page: number = 1, limit: number = 50) {
  const skip = (page - 1) * limit;

  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where: { userId: user.id },
      select: {
        // Only select needed fields
        id: true,
        amount: true,
        description: true,
        date: true,
        type: true,
        category: {
          select: { id: true, name: true, icon: true },
        },
        balance: {
          select: { id: true, name: true, currency: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({
      where: { userId: user.id },
    }),
  ]);

  return { transactions, total, page, pages: Math.ceil(total / limit) };
}

// Consider adding React Query for caching
```

---

### 7. **Performance: Prisma Client Connection** ⚠️

**Location:** `prisma.ts`

**Issue:**

```typescript
export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

**Problems:**

1. Query logging in production (performance impact)
2. No connection pool configuration
3. Missing error handling for connection failures

**Recommendation:**

```typescript
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
  errorFormat: "minimal",
});

// Add connection test
prisma
  .$connect()
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

// Graceful shutdown
if (process.env.NODE_ENV === "production") {
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
```

---

### 8. **Code Quality: Type Assertions** ⚠️

**Location:** Throughout codebase

**Issue:**

```typescript
userId: userId as string;
```

**Problem:** Multiple type assertions instead of fixing the root type issue.

**Recommendation:**

```typescript
// In auth.ts or types file
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Make id required and typed
      email: string;
      name?: string;
      image?: string;
    };
  }
}

// Then no need for assertions
const userId = session.user.id; // Already typed as string
```

---

## 🔴 Critical Production Issues

### 1. **Missing Rate Limiting**

**Risk:** API abuse, DoS attacks, credential stuffing

**Location:** All API routes, especially auth endpoints

**Recommendation:**

```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(
    identifier
  );

  return { success, limit, reset, remaining };
}

// In API route
const { success } = await checkRateLimit(`api:${request.ip}:${request.url}`);

if (!success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

---

### 2. **Missing CSRF Protection**

**Risk:** Cross-Site Request Forgery attacks

**Current Status:** NextAuth provides some protection, but server actions need CSRF tokens.

**Recommendation:**

```typescript
// For server actions
import { headers } from "next/headers";

export async function serverAction() {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("host");

  // Verify same-origin
  if (origin && new URL(origin).host !== host) {
    throw new Error("CSRF validation failed");
  }

  // Your action logic
}
```

---

### 3. **Password Reset Token Security**

**Location:** `lib/actions.ts`

**Issue:**

```typescript
const resetToken = crypto.randomBytes(32).toString("hex");
```

**Problems:**

1. Token stored in plain text in database
2. No token invalidation after use
3. 1 hour expiry might be too long

**Recommendation:**

```typescript
// Hash the token before storing
const resetToken = crypto.randomBytes(32).toString("hex");
const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

await prisma.passwordResetToken.create({
  data: {
    email,
    token: hashedToken, // Store hashed
    expires: new Date(Date.now() + 900000), // 15 minutes
  },
});

// When verifying, hash the incoming token
const hashedToken = crypto
  .createHash("sha256")
  .update(incomingToken)
  .digest("hex");

const tokenRecord = await prisma.passwordResetToken.findUnique({
  where: { token: hashedToken },
});

// After successful reset, delete the token
await prisma.passwordResetToken.delete({
  where: { id: tokenRecord.id },
});
```

---

### 4. **Session Security**

**Location:** `auth.ts`

**Missing:**

- Session rotation on privilege change
- Secure cookie settings documentation
- Session activity monitoring

**Recommendation:**

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ... existing config
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  events: {
    async signIn({ user, account }) {
      // Log successful sign-ins
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SIGN_IN",
          provider: account?.provider,
          timestamp: new Date(),
        },
      });
    },
  },
});
```

---

### 5. **Missing Input Validation**

**Location:** All API routes

**Issue:** Direct trust of user input

**Example:**

```typescript
const { name, amount, currency } = await request.json();
if (!name || !amount || !currency) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}
```

**Problems:**

1. No validation of data types
2. No sanitization
3. No length limits
4. No format validation

**Recommendation:**

```typescript
// Install zod
import { z } from "zod";

const createBalanceSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  amount: z.number().positive().finite(),
  currency: z.enum(["USD", "EUR", "GBP", "JPY"]), // whitelist
});

// In API route
try {
  const body = await request.json();
  const validated = createBalanceSchema.parse(body);

  // Use validated data
  const newBalance = await prisma.balance.create({
    data: {
      ...validated,
      userId: session.user.id,
    },
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Invalid input", details: error.errors },
      { status: 400 }
    );
  }
  throw error;
}
```

---

### 6. **Production Build Configuration**

**Location:** `next.config.ts`

**Issue:**

```typescript
eslint: {
  ignoreDuringBuilds: true, // ❌ Dangerous
},
```

**Risk:** Shipping code with lint errors to production

**Recommendation:**

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: false, // Fail builds on lint errors
  },
  typescript: {
    ignoreBuildErrors: false, // Also check TypeScript
  },
  // Add security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

---

## 🎯 Recommendations by Priority

### 🔥 Immediate (Before Production)

1. ✅ Remove/secure all console.log statements with sensitive info
2. ✅ Add environment variable validation
3. ✅ Implement rate limiting on API routes
4. ✅ Add input validation with Zod
5. ✅ Hash password reset tokens
6. ✅ Add security headers
7. ✅ Fix ESLint ignore in build

### 📈 High Priority (Next Sprint)

1. Add error monitoring (Sentry/LogRocket)
2. Implement proper logging system
3. Add pagination to transaction queries
4. Set up database connection pooling
5. Fix TypeScript types instead of assertions
6. Add CSRF protection for server actions
7. Implement audit logging

### 📊 Medium Priority (Future Improvements)

1. Add React Query for data caching
2. Implement optimistic updates
3. Add database query optimization
4. Set up automated testing
5. Add API documentation
6. Implement database backups
7. Add monitoring and alerting

### 🔮 Nice to Have (Enhancements)

1. Add GraphQL layer
2. Implement real-time updates
3. Add multi-currency support
4. Implement data export features
5. Add advanced analytics
6. Mobile app with React Native
7. Add integration with banking APIs

---

## 📝 Code Examples - Best Practices

### 1. Server Action Pattern

```typescript
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
});

export async function createBalance(
  formData: FormData
): Promise<{ success: boolean; error?: string; data?: Balance }> {
  try {
    // 1. Validate session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validate input
    const result = schema.safeParse({
      name: formData.get("name"),
      amount: Number(formData.get("amount")),
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0].message,
      };
    }

    // 3. Database operation
    const balance = await prisma.balance.create({
      data: {
        ...result.data,
        userId: session.user.id,
      },
    });

    // 4. Revalidate cache
    revalidatePath("/dashboard");

    return { success: true, data: balance };
  } catch (error) {
    console.error("Error creating balance:", error);
    return {
      success: false,
      error: "Failed to create balance",
    };
  }
}
```

### 2. API Route Pattern

```typescript
import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

const schema = z.object({
  name: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse & validate
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error },
        { status: 400 }
      );
    }

    // 3. Business logic
    const category = await prisma.category.create({
      data: {
        ...result.data,
        userId: session.user.id,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing Recommendations

### 1. Unit Tests

```typescript
// __tests__/lib/analytics.test.ts
import { calculateAnalytics } from "@/lib/analytics";

describe("calculateAnalytics", () => {
  it("should calculate total income correctly", () => {
    const transactions = [
      { type: "income", amount: 100 /* ... */ },
      { type: "income", amount: 200 /* ... */ },
    ];

    const result = calculateAnalytics(transactions);
    expect(result.totalIncome).toBe(300);
  });
});
```

### 2. Integration Tests

```typescript
// __tests__/api/balances.test.ts
import { POST } from "@/app/api/balances/route";

describe("POST /api/balances", () => {
  it("should create a balance for authenticated user", async () => {
    const request = new Request("http://localhost/api/balances", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Balance",
        amount: 1000,
        currency: "USD",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

### 3. E2E Tests (Playwright)

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("/login");
  await page.fill('[name="email"]', "test@example.com");
  await page.fill('[name="password"]', "password123");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/dashboard");
});
```

---

## 📊 Suggested Package Additions

```json
{
  "dependencies": {
    "zod": "^3.22.4", // Input validation
    "@sentry/nextjs": "^7.0.0", // Error monitoring
    "@upstash/ratelimit": "^1.0.0", // Rate limiting
    "@tanstack/react-query": "^5.0.0" // Data caching
  },
  "devDependencies": {
    "vitest": "^1.0.0", // Unit testing
    "@playwright/test": "^1.40.0", // E2E testing
    "@testing-library/react": "^14.0.0", // Component testing
    "msw": "^2.0.0" // API mocking
  }
}
```

---

## 🏁 Conclusion

### Strengths

- Solid foundation with modern Next.js practices
- Good project structure and organization
- Proper authentication flow
- Clean UI components
- Docker support for deployment

### Critical Needs

- Security hardening (rate limiting, input validation)
- Production error handling
- Environment variable validation
- Remove sensitive logging
- Add comprehensive testing

### Overall Rating

| Category          | Score     | Comment                          |
| ----------------- | --------- | -------------------------------- |
| **Architecture**  | ⭐⭐⭐⭐☆ | Well-structured, good separation |
| **Security**      | ⭐⭐☆☆☆   | Needs significant hardening      |
| **Performance**   | ⭐⭐⭐☆☆  | Good basics, needs optimization  |
| **Code Quality**  | ⭐⭐⭐⭐☆ | Clean, readable, typed           |
| **Testing**       | ⭐☆☆☆☆    | No tests found                   |
| **Documentation** | ⭐⭐☆☆☆   | Minimal comments/docs            |

**Overall: 3.0/5.0** - Good learning project, needs work for production

---

## 📚 Recommended Reading

1. [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/authentication)
2. [OWASP Top 10](https://owasp.org/www-project-top-ten/)
3. [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
4. [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
5. [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

## 📞 Next Steps

1. **Review this document** with your team
2. **Prioritize issues** based on deployment timeline
3. **Create tickets** for each recommendation
4. **Set up monitoring** before production deployment
5. **Implement testing** strategy
6. **Schedule security audit** before go-live

---

**Report Generated:** December 16, 2025  
**Version:** 1.0  
**Contact:** For questions about this audit, please review with senior developers
