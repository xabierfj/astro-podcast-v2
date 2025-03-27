export function Slugify(text: string) {
  return text
  .replace( /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^_`{|}~-]/g, '') // Remove leading/trailing punctuation and symbols
  .replace(/\s+/g, '-') // Replace whitespace with hyphen
  .toLowerCase();
}

export function TitleBeautifier(title: string) {
  return title
  .replace(/\|.*$/, '') // Remove everything afeter a pipe
  .replace(/-/, ':')
}

export function Truncate(str: any, length: number) {
  const sanitizedString = str.replace(/(<([^>]+)>)/gi, '');
  if (sanitizedString.length > length) {
      let truncated = sanitizedString.slice(0, length);
      if(sanitizedString.charAt(length) !== ' '){
          truncated = truncated.substring(0, truncated.lastIndexOf(" "));
      }
      return `${truncated.trim()}...`;
  } else return sanitizedString;
}

export function FormattedDate(date: string) {
  return new Date(date).toLocaleDateString('es-es', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

