function shuffleEmoji(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getEmoji(newListEmoji, amount) {
  let array = [
    ...newListEmoji.slice(0, amount),
    ...newListEmoji.slice(0, amount),
  ];

  return array;
}


export {shuffleEmoji, getEmoji}

