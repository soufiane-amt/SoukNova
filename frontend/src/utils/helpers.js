export function getFirstTwoWords(title) {
  // Split the title into an array of words
  const words = title.split(' ');

  // Check if there are at least two words
  if (words.length >= 2) {
    // Return the first two words joined by a space
    return `${words[0]} ${words[1]}`;
  }

  // If the title has less than two words, return the original title
  return title;
}
