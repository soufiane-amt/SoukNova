export const getFormatInDate = (date: string | Date) => {
  const today = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return today.toLocaleDateString('en-US', options);
};


export function splitTextIntoParagraphs(text: string | undefined, numParagraphs = 4): string[] {
  if (!text) return [];

  const words = text.split(/\s+/); // split text into words
  const totalWords = words.length;
  const paragraphSize = Math.ceil(totalWords / numParagraphs);

  const paragraphs: string[] = [];

  for (let i = 0; i < numParagraphs; i++) {
    const start = i * paragraphSize;
    const end = start + paragraphSize;
    const paragraphWords = words.slice(start, end);
    if (paragraphWords.length > 0) {
      paragraphs.push(paragraphWords.join(' '));
    }
  }
  console.log("paragraphs : ", paragraphs.length)
  return paragraphs;
}
