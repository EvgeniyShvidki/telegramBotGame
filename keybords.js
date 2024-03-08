let mainKeyboard = {
  reply_markup: {
    inline_keyboard: [[{ text: "my btn", callback_data: "click" }]],
  },
};

// 6 (4) ✅
export function recordsKeyboard(num = 1) {
  let btns = [];
  if (num <= 0){
    num = 1
  }
  for (let i = num; i < num + 4; i++) {
      if (i == num) {
        btns.push({ text: `${i} ✅`, callback_data: `records-num-${i}` });
      } else {
        btns.push({ text: `${i} ⬜️`, callback_data: `records-num-${i}` });
      }
  }
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⬅️", callback_data: `records-left-${num-1}` },
          ...btns,
          { text: "➡️", callback_data: `records-right-${num+4}` },
        ],
      ],
    },
  };
}

export let levelKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "1", callback_data: "setLevel-1" },
        { text: "2", callback_data: "setLevel-2" },
        { text: "3", callback_data: "setLevel-3" },
        { text: "4", callback_data: "setLevel-4" },
        { text: "5", callback_data: "setLevel-5" },
      ],
      [
        { text: "6", callback_data: "setLevel-6" },
        { text: "7", callback_data: "setLevel-7" },
        { text: "8", callback_data: "setLevel-8" },
        { text: "9", callback_data: "setLevel-9" },
        { text: "10", callback_data: "setLevel-10" },
      ],
      [
        { text: "11", callback_data: "setLevel-11" },
        { text: "12", callback_data: "setLevel-12" },
        { text: "13", callback_data: "setLevel-13" },
        { text: "14", callback_data: "setLevel-14" },
        { text: "15", callback_data: "setLevel-15" },
      ],
      [
        { text: "16", callback_data: "setLevel-16" },
        { text: "17", callback_data: "setLevel-17" },
        { text: "18", callback_data: "setLevel-18" },
        { text: "19", callback_data: "setLevel-19" },
        { text: "20", callback_data: "setLevel-20" },
      ],
    ],
  },
};
