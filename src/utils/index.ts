export const compareNumbers = (a: number, b: number): number => a - b;

export const compareStrings = (a: string, b: string): number =>
  a.localeCompare(b);

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
