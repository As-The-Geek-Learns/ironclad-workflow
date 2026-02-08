# Pre-Release Security & Quality Checklist

<!--
WHAT: Comprehensive checklist to run before releasing an app to users
WHY:  The security-review.md covers per-change code review. This covers
      the WHOLE application — infrastructure, configuration, supply chain,
      deployment — before you open the doors to real users.

ANALOGY: security-review.md = inspecting each weld on a bridge
         pre-release-checklist.md = load-testing the whole bridge before
         opening it to traffic

WHEN TO USE:
  - First release of any application
  - Major version releases (new features, architecture changes)
  - After long periods between releases
  - Before any public-facing deployment
-->

---

## 1. Supply Chain & Dependencies

> **WHY:** Your app is only as secure as its weakest dependency.
> A single compromised package can inject malware into your build.

- [ ] `npm audit` / `pnpm audit` shows **zero** high/critical vulnerabilities
- [ ] All dependencies pinned to exact versions (no `^` or `~` for production)
- [ ] Lock file (`package-lock.json` / `pnpm-lock.yaml`) is committed and current
- [ ] No unnecessary dependencies (review `package.json` — do you need all of these?)
- [ ] Dependencies are from trusted, actively maintained sources
- [ ] No deprecated packages still in use
- [ ] Dependency licenses are compatible with your project's license
- [ ] Dependabot or equivalent is configured and active

### Commands
```bash
# Check for vulnerabilities
npm audit --audit-level=high

# Check for outdated packages
npm outdated

# Review dependency tree for unexpected packages
npm ls --depth=0
```

---

## 2. Secrets & Environment Configuration

> **WHY:** Hardcoded secrets are the #1 most common security mistake.
> If a secret is in your git history, assume it's compromised.

- [ ] **No secrets in code** — grep confirms clean
- [ ] **No secrets in git history** — Gitleaks/TruffleHog scan clean
- [ ] `.env.example` exists with dummy values (documents what env vars are needed)
- [ ] `.gitignore` covers: `.env*`, `*.key`, `*.pem`, `*.p12`, credentials files
- [ ] Production secrets use a secret manager (not env files on disk)
- [ ] API keys are scoped to minimum required permissions
- [ ] All secrets can be rotated without code changes
- [ ] Development and production use **different** secrets/keys

### Commands
```bash
# Quick grep for common secret patterns
git grep -iE "api[_-]?key\s*[:=]|secret\s*[:=]|password\s*[:=]|token\s*[:=]" -- '*.js' '*.ts' '*.py' '*.swift' '*.json'

# Run Gitleaks on full history
gitleaks detect --source . --verbose
```

---

## 3. Authentication & Authorization

> **WHY:** Auth bugs give attackers the keys to everything.
> Every endpoint, every route, every action — check them all.

- [ ] Authentication is required for all protected resources
- [ ] Password requirements meet current standards (min 12 chars, no max limit)
- [ ] Passwords hashed with bcrypt/argon2 (never MD5/SHA1)
- [ ] Session tokens are cryptographically random, sufficient length
- [ ] Sessions expire after reasonable timeout
- [ ] Logout actually invalidates the session server-side
- [ ] Failed login attempts are rate-limited
- [ ] Password reset flow doesn't reveal whether account exists
- [ ] API tokens can be revoked
- [ ] Authorization checks happen server-side (never trust the client)

### Not Applicable?
If your app has no auth (e.g., static site, local-only desktop app), mark this
section N/A and note why: _______________

---

## 4. Data Protection

> **WHY:** Data breaches destroy trust. Handle user data like it's your own.

- [ ] Sensitive data encrypted at rest (database, files, backups)
- [ ] Data transmitted over HTTPS only (no mixed content)
- [ ] PII (personally identifiable information) identified and documented
- [ ] Data retention policy defined (how long do you keep data?)
- [ ] User data can be exported and deleted (GDPR/privacy compliance)
- [ ] Backups are encrypted and access-controlled
- [ ] Logs don't contain PII or sensitive data
- [ ] Error messages don't leak internal data structures

### Data Classification

| Data Type | Classification | Storage | Encryption |
|-----------|---------------|---------|------------|
| _example: user email_ | _PII_ | _database_ | _at rest_ |
| | | | |
| | | | |

---

## 5. Input Validation & Output Encoding

> **WHY:** Every piece of user input is a potential attack vector.
> OWASP Top 10 #3: Injection. Still the most exploited category.

- [ ] All user inputs validated on the server side
- [ ] Input length limits enforced
- [ ] File uploads validated (type, size, content — not just extension)
- [ ] Output encoded appropriately for context (HTML, URL, SQL, etc.)
- [ ] Content Security Policy (CSP) headers configured (web apps)
- [ ] No `eval()` or `innerHTML` with user-controlled data
- [ ] SQL queries use parameterized statements exclusively
- [ ] No shell command injection possible (`exec()`, `spawn()` with user input)

---

## 6. Error Handling & Logging

> **WHY:** Good error handling prevents info leaks AND makes debugging possible.
> Bad error handling gives attackers a roadmap of your internals.

- [ ] Production errors show generic user-friendly messages
- [ ] Stack traces hidden in production
- [ ] All errors logged with enough context to debug
- [ ] Log levels configured appropriately (no debug logs in production)
- [ ] Logging doesn't create injection attacks (log forging)
- [ ] Critical errors trigger alerts/notifications
- [ ] Application fails gracefully (no bare metal crashes in production)

---

## 7. Infrastructure & Deployment

> **WHY:** Secure code on insecure infrastructure is like a vault with the door open.

- [ ] HTTPS enforced everywhere (HSTS headers if web app)
- [ ] TLS certificates are valid and auto-renewing
- [ ] CORS configured to allow only expected origins
- [ ] Rate limiting in place for public endpoints
- [ ] Security headers set (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Server/framework version not exposed in headers
- [ ] Debug mode / development tools disabled in production
- [ ] Database not publicly accessible (firewall/VPC)
- [ ] File permissions are restrictive (no world-readable configs)
- [ ] Deployment process is automated (reduces human error)

### For Desktop/Mobile Apps
- [ ] Code signing configured
- [ ] Auto-update mechanism uses HTTPS and validates signatures
- [ ] App sandbox configured (minimum permissions)
- [ ] No unnecessary network access

### Security Headers Checklist (Web Apps)
```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 8. CI/CD Pipeline Verification

> **WHY:** Your CI/CD pipeline IS your security perimeter for code changes.
> If it's broken, nothing downstream matters.

- [ ] CI runs on every PR (no way to bypass)
- [ ] Branch protection enabled on main (require CI + review)
- [ ] Linter runs and blocks on errors
- [ ] Tests run and block on failures
- [ ] Security scanner (Semgrep) runs and blocks on findings
- [ ] Secrets scanner (Gitleaks) runs
- [ ] Dependency audit runs
- [ ] Build verification passes
- [ ] Pre-commit hooks installed and working
- [ ] Force push to main disabled

### Pipeline Status

| Check | Tool | Status |
|-------|------|--------|
| Linting | ESLint / SwiftLint / Ruff | ☐ Active |
| Testing | Jest / pytest / XCTest | ☐ Active |
| SAST | Semgrep | ☐ Active |
| Secrets | Gitleaks | ☐ Active |
| Dependencies | npm audit / Dependabot | ☐ Active |
| Build | CI build step | ☐ Active |

---

## 9. Documentation & Incident Response

> **WHY:** When something goes wrong (and it will), you need to know
> what to do and who to contact. Document it BEFORE you need it.

- [ ] `SECURITY.md` exists with vulnerability reporting instructions
- [ ] README documents setup, configuration, and security considerations
- [ ] Architecture documented (data flow, components, trust boundaries)
- [ ] API documentation exists if applicable
- [ ] Known limitations / security boundaries documented
- [ ] Incident response plan defined (who to contact, what to do)
- [ ] Data breach notification process documented (if handling user data)

---

## 10. Final Verification

> **WHY:** Belt AND suspenders. Run everything one more time.

- [ ] Full test suite passes: `npm test` / `pnpm test`
- [ ] Linter clean: `npm run lint`
- [ ] Security audit clean: `npm audit --audit-level=high`
- [ ] Semgrep scan clean: `semgrep --config p/security-audit .`
- [ ] Gitleaks scan clean: `gitleaks detect --source .`
- [ ] Production build succeeds: `npm run build`
- [ ] Application starts and basic functionality works
- [ ] Ironclad verify passes: `npm run verify` (if available)

---

## Risk Assessment Summary

| Category | Risk Level | Notes |
|----------|-----------|-------|
| Supply Chain | ☐ LOW ☐ MED ☐ HIGH | |
| Secrets | ☐ LOW ☐ MED ☐ HIGH | |
| Auth | ☐ LOW ☐ MED ☐ HIGH ☐ N/A | |
| Data Protection | ☐ LOW ☐ MED ☐ HIGH ☐ N/A | |
| Input Validation | ☐ LOW ☐ MED ☐ HIGH | |
| Error Handling | ☐ LOW ☐ MED ☐ HIGH | |
| Infrastructure | ☐ LOW ☐ MED ☐ HIGH | |
| CI/CD Pipeline | ☐ LOW ☐ MED ☐ HIGH | |
| Documentation | ☐ LOW ☐ MED ☐ HIGH | |

**Overall Risk Assessment:** ☐ LOW ☐ MEDIUM ☐ HIGH ☐ CRITICAL

---

## Release Decision

**Release Blocked if ANY of the following are true:**
- Any CRITICAL risk category
- Secrets found in code or git history
- High/critical dependency vulnerabilities with no mitigation
- CI/CD pipeline not fully operational
- No SECURITY.md

**Release Approved with Conditions if:**
- Medium risk items have documented mitigation plans
- Known limitations are documented
- Timeline for fixing medium items is committed

---

## Sign-off

**Reviewer:** _______________
**Application:** _______________
**Version/Release:** _______________
**Date:** _______________
**Result:** ☐ APPROVED ☐ APPROVED WITH CONDITIONS ☐ BLOCKED

**Conditions (if applicable):**


**Notes:**
