export const mapToObject = <T extends string, K>(map: Map<T, K>) =>
  [...map].reduce((l, [k, v]: [T, K]) => Object.assign(l, { [k]: v }), {});

export const objectToMap = <T>(object: { [key: string]: T }) => {
  return new Map(Object.entries(object));
};
