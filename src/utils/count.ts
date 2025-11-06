const countCharsWithSpaces = (text: string): number => {
  return [...text].length;
};

const countCharsWithoutSpaces = (text: string): number => {
  return [...text.replace(/\s/g, "")].length;
};

const countWords = (text: string): number => {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
};

export { countCharsWithoutSpaces, countCharsWithSpaces, countWords };
