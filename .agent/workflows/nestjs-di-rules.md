---
description: NestJS Dependency Injection rules - avoiding import type errors
---

# NestJS Dependency Injection Rules

## Critical: Do NOT use `import type` for injectable classes

When working with NestJS dependency injection, **NEVER** use `import type` for classes that are injected via constructor.

### ❌ WRONG - Breaks DI at runtime

```typescript
import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config'; // ❌ WRONG
import type { JwtService } from '@nestjs/jwt'; // ❌ WRONG

@Injectable()
export class MyService {
  constructor(
    private readonly jwtService: JwtService, // Undefined at runtime!
    private readonly configService: ConfigService // Undefined at runtime!
  ) {}
}
```

### ✅ CORRECT - Regular imports for injected classes

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ✅ CORRECT
import { JwtService } from '@nestjs/jwt'; // ✅ CORRECT

@Injectable()
export class MyService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
}
```

## Why this matters

- `import type` is **erased at compile time** by TypeScript
- NestJS DI uses **runtime reflection** to resolve dependencies
- If the class reference doesn't exist at runtime, DI fails silently or crashes

## When `import type` IS allowed

You CAN use `import type` for:

- Interfaces (they don't exist at runtime anyway)
- Types used only in type annotations, not in DI
- Generic type parameters

```typescript
import { type Result } from 'neverthrow';

// ✅ OK - only used as type
import { type AuthDomainError } from '../domain';

// ✅ OK - interface only
```

## ESLint Configuration

The `eslint.config.js` has been configured to **disable** `consistent-type-imports` for NestJS API files:

```javascript
// NestJS backend config in eslint.config.js
{
  files: ['apps/api/**/*.ts'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
  },
}
```

> ⚠️ **WARNING**: Never run `lint --fix` on NestJS files without this configuration!
> The auto-fix will convert regular imports to type-only imports, breaking DI at runtime.

## Verification

After creating NestJS services, always verify:

1. Run `pnpm typecheck`
2. Run `nx serve api` and check for runtime errors
3. Test that endpoints respond correctly
