export function removeForbiddenCharacters (str, isFileName) {
  const regexpStr = [
    '[\\\\\?%*:|"<>',
    isFileName ? '\\/' : '\\.',
    ']'
  ].join('');

  const regexp = new RegExp(regexpStr, 'g');
  return str.replace(regexp, '_');
}
