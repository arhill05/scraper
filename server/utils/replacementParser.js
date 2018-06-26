module.exports = replacements => {
  const response = [];
  let replacementsArray = [];
  if (Array.isArray(replacements)) {
    replacementsArray = replacements;
  } else if (replacements != null) {
    replacementsArray = [replacements];
  }
  replacementsArray.forEach(replacement => {
    const separated = replacement.split(',');
    response.push({ replaceThis: separated[0], withThis: separated[1] });
  });

  return response;
};
