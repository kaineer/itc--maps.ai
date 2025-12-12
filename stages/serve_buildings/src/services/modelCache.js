const getValuesDefault = async () => {
  throw new Error("getValues() not set");
};

const createModelCache = (getValues = getValuesDefault) => {
  let cache = null;
  let cacheIsValid = false;

  const updateCache = (obj) => {
    cacheIsValid = true;
    return (cache = obj);
  };

  const invalidateCache = () => {
    cacheIsValid = false;
  };

  const cacheValues = async () => {
    if (cacheIsValid) return cache;
    return updateCache(await getValues());
  };

  return {
    cacheValues,
    invalidateCache,
  };
};

module.exports = {
  createModelCache,
};
