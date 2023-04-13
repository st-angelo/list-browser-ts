export const setNestedProperty = (target: any, path: string, value: any) => {
  if (!path || !target) {
    console.error("[ListBrowser].[setNestedProperty] invalid 'path' or 'target'");
    return;
  }
  const segments = path.split('.');
  const property = segments.pop();
  if (!property) {
    console.error("[ListBrowser].[setNestedProperty] invalid 'property'");
    return;
  }
  let _target = target;
  segments.forEach(segment => (_target = target[segment]));
  _target[property] = value;
};

export const removeApolloTypename = <T>(data: (T & { __typename: string })[]) => {
  if (!data) return [];
  return data.map(({ __typename, ...rest }) => {
    Object.freeze(rest);
    return rest as T;
  });
};

// #region Sorting

export const byPropertiesOf =
  <T extends object>(field: keyof T, direction: 'asc' | 'desc' = 'asc') =>
  (obj1: T, obj2: T) => {
    let sortOrder = direction === 'asc' ? 1 : -1;
    const result = obj1[field] < obj2[field] ? -1 : obj1[field] > obj2[field] ? 1 : 0;
    return result * sortOrder;
  };

export const sort = <T extends object>(array: Array<T>, field: keyof T, direction: 'asc' | 'desc' = 'asc') => {
  array.sort(byPropertiesOf<T>(field, direction));
};

// #endregion
