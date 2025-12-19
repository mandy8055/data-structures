# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Go to the [Security tab](https://github.com/mandy8055/data-structures/security/advisories)
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email**
   - Send details to the maintainers via email (check package.json for contact info)
   - Include "SECURITY" in the subject line

### What to Include

When reporting a vulnerability, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Affected versions
- Potential impact
- Any suggested fixes (if available)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
- **Assessment**: We'll assess the vulnerability and determine its severity within 7 days
- **Updates**: We'll keep you informed about our progress
- **Resolution**: We'll work on a fix and coordinate disclosure timing with you
- **Credit**: If desired, we'll acknowledge your contribution in the release notes

## Security Considerations

### For This Library

This is a zero-dependency data structures library. Primary security considerations include:

1. **Algorithmic Complexity**: Potential for DoS attacks through algorithmic complexity exploitation
2. **Input Validation**: Edge cases in data structure operations
3. **Memory Safety**: Memory leaks or excessive memory consumption

### For Documentation Website

The documentation website ([website/](website/)) uses external dependencies (Docusaurus, React, etc.):

- Dependencies are monitored via Dependabot
- Security updates are applied promptly
- See [dependabot.yml](.github/dependabot.yml) for our update policy

## Security Best Practices

When using this library:

1. **Validate Input**: Always validate and sanitize user input before passing to data structures
2. **Resource Limits**: Set appropriate size limits for collections to prevent DoS
3. **Keep Updated**: Use the latest stable version to benefit from security fixes
4. **Review Changes**: Check release notes for security-related updates

## Disclosure Policy

- We follow coordinated disclosure practices
- Security advisories will be published via GitHub Security Advisories
- Critical vulnerabilities will trigger immediate patch releases
- Non-critical issues will be bundled into the next regular release

## Attribution

We appreciate the security research community and will credit researchers (with permission) who report valid security issues.
