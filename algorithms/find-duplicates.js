function findFirstDuplicate(str) {
  const seen = new Set();
  const duplicates = new Set();

  for (let i = 0; i < str.length; i++) {
    if (seen.has(str[i])) {
      duplicates.add(str[i]);
    } else {
      seen.add(str[i]);
    }
  }

  if (!duplicates.size) {
    return undefined;
  }

  for (let i = 0; i < str.length; i++) {
    if (duplicates.has(str[i])) {
      return str[i];
    }
  }
}

findFirstDuplicate('abcbaca');

function findDuplicate(str) {
  const seen = new Set();

  for (let i = 0; i < str.length; i++) {
    if (seen.has(str[i])) {
      return str[i];
    }
    seen.add(str[i]);
  }
}

findDuplicate('abcbaca');
