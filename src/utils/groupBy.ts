/** Groups items by a string key, preserving first-seen key order. */
export const groupBy = <T,>(xs: T[], key: (x: T) => string) =>
  xs.reduce<Record<string, T[]>>((acc, x) => {
    (acc[key(x)] ??= []).push(x);
    return acc;
  }, {});
