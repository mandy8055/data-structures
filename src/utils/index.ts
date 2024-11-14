// Copyright 2024-2025 the @mskr/data-structures authors. All rights reserved. MIT license.

/**
 * @ignore
 * Compares two numbers and returns their difference.
 * @param a First number to compare
 * @param b Second number to compare
 * @returns Negative if a < b, 0 if a === b, positive if a > b
 */
export const compareNumbers = (a: number, b: number): number => a - b;

/**
 * @ignore
 * Compares two strings using locale-specific comparison.
 * @param a First string to compare
 * @param b Second string to compare
 * @returns Negative if a < b, 0 if a === b, positive if a > b
 */
export const compareStrings = (a: string, b: string): number =>
  a.localeCompare(b);

/**
 * @ignore
 * Creates a custom comparison function for objects based on a key extractor.
 * @template T The type of objects being compared
 * @param keyExtractor Function that extracts a comparable key from the objects
 * @returns A comparison function that compares objects based on their extracted keys
 */
export function createCustomComparer<T>(
  keyExtractor: (item: T) => number | string,
): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const keyA = keyExtractor(a);
    const keyB = keyExtractor(b);
    return typeof keyA === 'number'
      ? (keyA as number) - (keyB as number)
      : (keyA as string).localeCompare(keyB as string);
  };
}
