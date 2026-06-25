# Embir P0 Security & Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fermer les chemins d’escalade de privilèges, rendre l’inscription juridiquement fidèle aux choix soumis et empêcher les faux profils ou faux matchs de contaminer le produit.

**Architecture:** Centraliser l’authentification utilisateur et administrateur dans des helpers fail-closed, valider l’inscription dans une fonction pure testable, puis faire consommer ces contrats par les routes. Les endpoints publics ne doivent plus inventer de données. La réciprocité du matching doit conserver l’identité de l’initiateur afin qu’un second clic du même utilisateur ne crée jamais un match mutuel.

**Tech Stack:** Next.js App Router, TypeScript, Node test runner, Prisma/PostgreSQL, JSON Web Tokens, Web Crypto/Node Crypto.

---

### Task 1: Contrats de sécurité exécutables

**Files:**
- Create: `tests/security/auth-contract.test.ts`
- Create: `tests/security/admin-contract.test.ts`
- Create: `tests/security/data-integrity-contract.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing tests**

Les tests doivent lire les routes critiques et vérifier :

```ts
assert.doesNotMatch(authSource, /\|\|\s*["'][^"']+["']/);
assert.doesNotMatch(registerSource, /role:\s*"AMBASSADOR"/);
assert.doesNotMatch(registerSource, /isPremium:\s*true/);
assert.match(registerSource, /validateRegistrationInput/);
assert.match(adminRouteSource, /requireAdmin/);
assert.doesNotMatch(profilesSource, /MOCK_PROFILES/);
assert.match(matchActionSource, /initiatorId/);
```

- [ ] **Step 2: Verify RED**

Run: `npm run test:security`

Expected: FAIL on the known hard-coded secrets, unprotected admin routes, automatic premium/ambassador grants, mock profiles and directionless matching.

- [ ] **Step 3: Add the security test command**

```json
"test:security": "node --experimental-strip-types --test tests/security/*.test.ts"
```

- [ ] **Step 4: Commit the red contract**

```bash
git add package.json tests/security
git commit -m "test: define Embir P0 security contracts"
```

### Task 2: Fail-closed authentication helpers

**Files:**
- Modify: `src/lib/auth.ts`
- Create: `src/lib/admin-auth.ts`
- Test: `tests/security/auth-contract.test.ts`
- Test: `tests/security/admin-contract.test.ts`

- [ ] **Step 1: Make JWT resolution fail closed**

```ts
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return secret;
}
```

`signToken` appelle `getJwtSecret()`. `verifyToken` renvoie `null` lorsque la configuration est absente ou lorsque le token est invalide.

- [ ] **Step 2: Create signed admin sessions**

`src/lib/admin-auth.ts` doit :

```ts
export function verifyAdminPassword(candidate: string): boolean;
export function createAdminSessionToken(): string;
export function verifyAdminSessionToken(token: string | undefined): boolean;
export async function requireAdmin(): Promise<{ type: "session" | "user"; userId?: string } | null>;
```

Le cookie contient une signature HMAC dérivée de `ADMIN_SECRET`, jamais le secret lui-même. La comparaison du mot de passe utilise `timingSafeEqual`. `requireAdmin` accepte soit la session admin signée, soit un utilisateur JWT dont le rôle en base est `ADMIN`.

- [ ] **Step 3: Verify GREEN**

Run: `npm run test:security`

Expected: les contrats secret/JWT/session passent.

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/lib/admin-auth.ts tests/security
git commit -m "fix: fail closed on authentication secrets"
```

### Task 3: Fermer toutes les routes administrateur

**Files:**
- Modify: `src/app/api/admin/auth/route.ts`
- Modify: `src/app/[locale]/analytics-dashboard/page.tsx`
- Modify: every `src/app/api/admin/**/route.ts` except the login route
- Test: `tests/security/admin-contract.test.ts`

- [ ] **Step 1: Protect reads and writes**

Chaque handler commence par :

```ts
const admin = await requireAdmin();
if (!admin) {
  return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
}
```

- [ ] **Step 2: Replace the raw-secret cookie**

La route `/api/admin/auth` valide le formulaire avec `verifyAdminPassword`, puis écrit `createAdminSessionToken()` dans un cookie `HttpOnly`, `Secure` en production, `SameSite=Strict`, durée 8 heures.

- [ ] **Step 3: Remove public notification forgery**

`/api/admin/notify-signup` devient administrateur uniquement. L’inscription continue d’utiliser son envoi interne direct et ne dépend pas de cet endpoint.

- [ ] **Step 4: Verify**

Run: `npm run test:security`

Expected: toutes les routes admin hors login importent et appellent `requireAdmin`.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin src/app/[locale]/analytics-dashboard/page.tsx tests/security
git commit -m "fix: require authentication on Embir admin routes"
```

### Task 4: Inscription fidèle aux consentements

**Files:**
- Create: `src/lib/registration.ts`
- Modify: `src/app/api/auth/register/route.ts`
- Modify: `src/app/[locale]/auth/register/page.tsx`
- Modify: `src/components/auth/AuthModal.tsx`
- Test: `tests/security/registration.test.ts`

- [ ] **Step 1: Write failing validation tests**

Tester les refus pour email invalide, mot de passe court, `isAdult !== true`, `acceptTerms !== true`, `acceptPrivacy !== true`, date invalide et âge inférieur à 18 ans. Tester la normalisation `trim().toLowerCase()`.

- [ ] **Step 2: Implement the pure validator**

```ts
export type RegistrationInput = {
  email?: unknown;
  password?: unknown;
  isAdult?: unknown;
  acceptTerms?: unknown;
  acceptPrivacy?: unknown;
  consentSensitiveData?: unknown;
  birthDate?: unknown;
};

export function validateRegistrationInput(input: RegistrationInput):
  | { ok: true; value: ValidRegistrationInput }
  | { ok: false; status: 400; error: string };
```

- [ ] **Step 3: Remove privilege fabrication**

La création doit conserver `role: USER`, `isPremium: false`, `isFounder: false`, ne créer aucun `Ambassador`, et ne créer que les consentements explicitement reçus. `consentSensitiveData` reste faux sauf consentement explicite associé à une donnée sensible réellement soumise.

- [ ] **Step 4: Submit consent flags from both UIs**

```ts
body: JSON.stringify({
  email,
  password,
  isAdult,
  acceptTerms: acceptCGU,
  acceptPrivacy: acceptCGU,
});
```

- [ ] **Step 5: Verify**

Run: `npm run test:security`

Expected: validation and source contracts PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/registration.ts src/app/api/auth/register/route.ts src/app/[locale]/auth/register/page.tsx src/components/auth/AuthModal.tsx tests/security
git commit -m "fix: enforce explicit registration consent"
```

### Task 5: Supprimer les profils inventés

**Files:**
- Modify: `src/app/api/profiles/route.ts`
- Test: `tests/security/data-integrity-contract.test.ts`

- [ ] **Step 1: Remove `MOCK_PROFILES`**

La route retourne uniquement les colonnes réelles sélectionnées en base. Une base vide renvoie `[]`. Une erreur de base renvoie HTTP 503 avec `{ error: "Profiles temporarily unavailable" }`.

- [ ] **Step 2: Verify**

Run: `npm run test:security`

Expected: aucun import ni fallback `MOCK_PROFILES` dans la route publique.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/profiles/route.ts tests/security
git commit -m "fix: stop serving fabricated profiles"
```

### Task 6: Préserver la direction des likes

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260625_match_initiator/migration.sql`
- Modify: `src/app/api/match/action/route.ts`
- Test: `tests/security/match-reciprocity.test.ts`

- [ ] **Step 1: Write failing transition tests**

Extraire une fonction pure :

```ts
decideMatchTransition({
  actorId,
  targetId,
  existingStatus,
  existingInitiatorId,
  action,
});
```

Cas obligatoires : premier like → pending, même auteur répète → pending, autre personne like → mutual, pass → rejected, self-like → invalid.

- [ ] **Step 2: Add direction to the schema**

```prisma
initiatorId String?
```

Migration :

```sql
ALTER TABLE "Match" ADD COLUMN "initiatorId" TEXT;
```

- [ ] **Step 3: Implement transitions and target checks**

Vérifier l’existence de la cible, interdire self-like et comptes supprimés/bannis, conserver la paire triée mais enregistrer l’initiateur réel.

- [ ] **Step 4: Verify**

Run: `npm run test:security`

Expected: all reciprocity transitions PASS.

- [ ] **Step 5: Commit**

```bash
git add prisma src/app/api/match/action/route.ts tests/security
git commit -m "fix: require two distinct users for mutual matches"
```

### Task 7: Durcir messagerie et uploads

**Files:**
- Modify: `src/app/api/messages/route.ts`
- Modify: `src/app/api/conversations/route.ts`
- Modify: `src/app/api/conversations/[id]/messages/route.ts`
- Modify: `src/app/api/messages/audio/route.ts`
- Modify: `src/app/api/verification/upload/route.ts`
- Create: `src/lib/upload-policy.ts`
- Test: `tests/security/upload-policy.test.ts`
- Test: `tests/security/data-integrity-contract.test.ts`

- [ ] **Step 1: Test upload policy**

La fonction pure accepte uniquement les MIME et extensions explicitement autorisés, impose 10 Mo pour audio et 8 Mo pour image, ignore toujours `file.name` pour construire le chemin et produit une extension côté serveur.

- [ ] **Step 2: Enforce messaging invariants**

Limiter les messages texte à 4 000 caractères, interdire soi-même, vérifier cible active, blocage dans les deux sens et appartenance à la conversation. La route historique `/api/messages` doit appliquer les mêmes règles ou déléguer au même helper.

- [ ] **Step 3: Enforce upload invariants**

Audio : liste MIME fermée sans `startsWith("audio/")`.

Vérification : taille maximale, MIME image fermé (`image/jpeg`, `image/png`, `image/webp`), extension dérivée du MIME, chemin construit avec `path.join`, jamais depuis le nom client.

- [ ] **Step 4: Verify**

Run: `npm run test:security`

Expected: upload and messaging contracts PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/messages src/app/api/conversations src/app/api/verification src/lib/upload-policy.ts tests/security
git commit -m "fix: harden messaging and verification uploads"
```

### Task 8: Vérification globale et documentation

**Files:**
- Modify: `docs/superpowers/evidence/p0-security/verification.txt`
- Modify: `/Users/dalilrhasrhass/Documents/Obsidian Vault/30_EMBYR/2026-06-25_CODEX_SEO_MASTERRUN.md`
- Modify: `/Users/dalilrhasrhass/Documents/Obsidian Vault/80_QA_BUGS/Bugs ouverts.md`

- [ ] **Step 1: Run focused tests**

Run: `npm run test:security`

Expected: 0 failures.

- [ ] **Step 2: Run existing regression checks**

Run:

```bash
npm run test:landing
npx tsc --noEmit
npm run lint
npm run build
```

Expected: tests and build exit 0; lint contains no errors.

- [ ] **Step 3: Inspect the final diff**

Run:

```bash
git diff --check
git status --short
git log --oneline -15
```

- [ ] **Step 4: Record reality**

Document local corrections, migrations pending production, exact verification output and the continuing VPS access blocker. Do not claim live remediation before deployment and HTTP verification.

