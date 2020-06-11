const eqArray = (left: Array<any>, right: Array<any>): boolean =>
  left.length === right.length && left.every((value, index) => right[index] === value);

const memoizeLast = (fn: Function) => {
  let lastMemoized: { args: Array<any>; answer: ReturnType<<T>() => T> };

  const memoizedFn = (...args: Array<any>) => {
    if (lastMemoized && eqArray(lastMemoized.args, args)) {
      return lastMemoized.answer;
    }

    const result = fn(...args);

    lastMemoized = { args, answer: result };

    return result;
  };

  return memoizedFn;
};

export default memoizeLast;
