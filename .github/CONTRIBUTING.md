# Contributing Guidelines

Thank you for considering contributing to the data-structures library! This document provides guidelines and steps for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to maintain a respectful and inclusive environment.

## Getting Started

1. Fork the repository
2. Clone your fork:

```bash
   git clone https://github.com/your-username/data-structures.git
```

3. Install dependencies(currently we do not hav):

```bash
   deno cache
```

## Development Process

1. Create a new branch:

Branch naming convention:

- feat/your-feature-name: For feature branches
- fix/your-fix-name: For bugfix and hotfix branches
- release/release-name: For releasing features

```bash
   git checkout -b feat/your-feature-name
```

1. Make your changes following our coding standards

2. Write/update tests for your changes

3. Run tests:

```bash
   deno test
```

5. Update documentation:

   - Update JSDoc comments
   - Update relevant markdown files
   - Update examples if needed

6. Test the linting, formatting and JSDOCs in case anything missed:

```bash
   deno task verify
```

7. Commit your changes:

```bash
   git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/)

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Ensure all tests pass and coverage is maintained
3. Update all relevant documentation
4. Submit a pull request

### PR Title Format

- feat: Add new feature
- fix: Fix bug
- docs: Update documentation
- test: Add/update tests
- refactor: Code refactoring
- perf: Performance improvements

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide type definitions for all parameters and return values
- Use generics where appropriate
- Follow functional programming principles where possible

### Documentation

- Use JSDoc for all public methods
- Include examples in documentation
- Document time complexities
- Keep documentation up to date

### Testing

- Write unit tests for all new features
- Maintain test coverage above 85%
- Include edge cases in tests
- Use descriptive test names

## Example Pull Request

Here's an example of a good pull request:

```typescript
/**
 * Reverses the linked list in-place
 * Time complexity: O(n)
 * Space complexity: O(1)
 */
reverse(): void {
  if (this.size <= 1) return;

  let prev = null;
  let current = this.head;
  this.tail = current;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  this.head = prev;
}

// Tests
Deno.test("LinkedList - reverse", () => {
  const list = new LinkedList<number>();
  list.append(1);
  list.append(2);
  list.append(3);

  list.reverse();

  assertEquals(list.toArray(), [3, 2, 1]);
  assertEquals(list.head?.value, 3);
  assertEquals(list.tail?.value, 1);
});
```
