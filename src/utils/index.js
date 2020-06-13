export const searchInArr = (arr, searchKey) => {
  return arr.filter((obj) =>
    Object.keys(obj).some((key) => {
      return `${obj[key]}`.includes(searchKey);
    })
  );
};

export const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};
