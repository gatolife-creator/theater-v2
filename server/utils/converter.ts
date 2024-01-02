function isObject(item: any) {
  return (
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    !(item instanceof Map)
  );
}

export const mapToObjectRecursive = <T extends string, K>(map: Map<T, K>) => {
  let obj: { [key: string]: any } = {}; // Update the type of 'obj' to '{ [key: string]: any }'
  for (let [k, v] of map) {
    if (v instanceof Map) {
      obj[k] = mapToObjectRecursive(v);
    } else {
      obj[k] = v;
    }
  }
  return obj;
};

export const objectToMapRecursive = (object: { [key: string]: unknown }) => {
  let map = new Map();
  for (let k in object) {
    if (isObject(object[k])) {
      map.set(k, objectToMapRecursive(object[k] as { [key: string]: unknown }));
    } else {
      map.set(k, object[k]);
    }
  }
  return map;
};
