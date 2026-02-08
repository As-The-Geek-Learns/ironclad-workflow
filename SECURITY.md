# Security Policy

## Supported Versions

We actively support the latest version of ironclad-workflow.

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public GitHub issue
2. Email security concerns to: james@astgl.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Considerations

ironclad-workflow executes scripts that interact with:
- Git repositories (local)
- GitHub API (via `gh` CLI)
- AI services for code review (Gemini API)

### For Users

- Keep your `gh` CLI authenticated with minimal scopes
- Review AI review output before acting on suggestions
- Never store API keys in workflow state files
- Use environment variables for all credentials

### For Developers

- Never commit API keys, tokens, or credentials
- Use environment variables for all secrets
- Keep dependencies up to date
- Run security scans before releases
- Validate all external inputs in scripts

## Security Features

- **Secrets Scanning**: Gitleaks prevents accidental credential commits
- **Workflow State Isolation**: `.workflow/state/` excluded from commits
- **CI/CD Security**: Automated Semgrep + Gitleaks checks on every PR
- **Minimal Permissions**: GitHub Actions use read-only permissions by default

## Contact

For security concerns: james@astgl.com
