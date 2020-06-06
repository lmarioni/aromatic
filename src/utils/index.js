export const searchInArr = (arr, searchKey) => {
  return arr.filter((obj) =>
    Object.keys(obj).some((key) => {
      return `${obj[key]}`.includes(searchKey);
    })
  );
};
