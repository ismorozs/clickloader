export function removeForbiddenCharacters (str, forFile) {
  const regexpStr = [
    '[\\\\\?%*:|"<>',
    forFile ? '\\/' : '\\.',
    ']'
  ].join('');

  const regexp = new RegExp(regexpStr, 'g');
  return str.replace(regexp, '_');
}
