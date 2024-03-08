import TelegramBot from "node-telegram-bot-api";
import { shuffleEmoji, getEmoji } from "./shuffle-emoji.js";
import fs from "fs";
import { levelKeyboard } from "./keybords.js";
import { recordsKeyboard } from "./keybords.js";

let numMessage = -1;
let emojiKeyboard = {};
let amountCards = 3;

let chatId = 0;
let nameUser = "";
let startTimeGame = 0;
let bot = new TelegramBot("6937853671:AAGT9Boa97ztrgOQzfv9aQOTLEfq4tjTfSs", {
  polling: true,
});
//  npm i @types/node-telegram-bot-api

bot.setMyCommands([
  { command: "level", description: "change level" },
  { command: "start", description: "start game" },
  { command: "username", description: "show username" },
  { command: "records", description: "show user time records" },
]);

let finishList = [];

let records = [];
function getRecords() {
  records = JSON.parse(fs.readFileSync("./records.json").toString());
}

function saveRecord() {
  fs.writeFile("records.json", JSON.stringify(records), () => {});
}

getRecords();
console.log(records);
console.log(typeof records);

// game:
// potok 10s  +10s 2min wait
// buffer pot + pot + pot [34, 56, 23, 32, 100].toString()

// 🌶🍊🥕🫐🥬🍋😂🍓🫑🍎🥭🥑🥥🌹🍇🌮🍠🥶🍕🍔🍌
let emoji = [
  "🌶",
  "🍊",
  "😂",
  "🍋",
  "🥬",
  "🥕",
  "🍓",
  "🫑",
  "🍎",
  "🥭",
  "🥑",
  "🥥",
  "🌹",
  "🍇",
  "🍠",
  "🌮",
  "🍌",
  "🥶",
  "🍕",
  "🍔",
  "🍙",
];

let unblockList = [];

// 6 btn: 3 fruit

function randomKeyboard(index, emoji_) {
  let oldEmoji = "";
  let newEmoji = emoji_;

  if (emojiKeyboard.reply_markup != undefined) {
    let keyboardOld = emojiKeyboard.reply_markup.inline_keyboard.flat();
    console.log(keyboardOld.length);
    for (let i = 0; i < keyboardOld.length; i++) {
      console.log(keyboardOld[i].text);
      if (
        keyboardOld[i].text != "⬜️" &&
        !unblockList.includes(keyboardOld[i].text)
      ) {
        oldEmoji = keyboardOld[i].text;

        break;
      }
    }
  }

  console.log("oldEmoji", oldEmoji);
  console.log("newEmoji", newEmoji);

  if (oldEmoji == newEmoji) {
    unblockList.push(oldEmoji);
  }

  if (!emoji_) {
    let newListEmoji = shuffleEmoji(emoji);
    let readyList = getEmoji(newListEmoji, amountCards);
    finishList = shuffleEmoji(readyList);
  }

  console.log(finishList);

  let rows = [];
  let amountCardsInRow = 5;
  if (amountCards < 5) {
    amountCardsInRow = amountCards;
  }

  // 8 === '8'

  for (let i = 0; i < finishList.length; i++) {
    if (i % amountCardsInRow === 0) {
      rows.push([]);
    }
    console.log(i, index, "i index");

    if (i == index) {
      console.log("emoji index", emoji);
      rows[rows.length - 1].push({
        text: emoji_,
        callback_data: "emoji-" + i + "-" + finishList[i],
      });
    } else if (unblockList.includes(finishList[i])) {
      rows[rows.length - 1].push({
        text: finishList[i],
        callback_data: "emoji-" + i + "-" + finishList[i],
      });
    } else {
      rows[rows.length - 1].push({
        text: "⬜️",
        callback_data: "emoji-" + i + "-" + finishList[i],
      });
    }
  }

  emojiKeyboard = {
    reply_markup: {
      inline_keyboard: rows,
    },
  };

  let amountWhite = emojiKeyboard.reply_markup.inline_keyboard
    .flat()
    .filter((btn) => btn.text === "⬜️").length;

  if (amountWhite === 0) {
    let newRecord = false;
    let isContainsUserRecord = false;
    let time = Number((new Date().getTime() / 1000 - startTimeGame).toFixed(0));
    let index = -1;
    let oldRecord = 1000000000;

    for (let i = 0; i < records.length; i++) {
      if (nameUser == records[i].name && records[i].level == amountCards - 2) {
        isContainsUserRecord = true;
        index = i;
        oldRecord = records[i].record;
      }
    }

    if (isContainsUserRecord) {
      console.log("time", time);
      console.log("oldRecord", oldRecord);
      if (time < oldRecord) {
        bot.sendMessage(chatId, `<b>New Record!</b> You time: ${time}`, {
          parse_mode: "HTML",
        });

        let day = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getUTCFullYear();
        records[index] = {
          date: `${day}.${month}.${year}`,
          record: time,
          level: amountCards - 2,
          name: nameUser,
        };
        saveRecord();
      }
    } else {
      let day = new Date().getDate();
      let month = new Date().getMonth() + 1;
      let year = new Date().getUTCFullYear();
      if (month < 10) {
        month = "0" + month.toString();
      }
      records.push({
        date: `${day}.${month}.${year}`,
        record: time,
        level: amountCards - 2,
        name: nameUser,
      });
      saveRecord();
    }

    if (amountCards == 22) {
      bot.sendMessage(chatId, `You Win! Ви пройшли гру!`);
    } else {
      bot.sendMessage(
        chatId,
        `You Win! You time: ${time}\n /records /start /level`
      );
      amountCards++;
    }
  }

  if (numMessage >= 0) {
    // bot.answerCallbackQuery({
    //   callback_query_id: numMessage,
    // });
  }

  return emojiKeyboard;
}

// /uusername - > italic username reg
let mainKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "my btn", callback_data: "firstBtn" },
        { text: "my btn", callback_data: "click" },
        { text: "my btn", callback_data: "thirdBtn" },
      ],
      [
        { text: "my btn", callback_data: "click" },
        { text: "my btn", callback_data: "click" },
      ],
    ],
  },
};

bot.on("message", function (message) {
  let text = message.text;
  chatId = message.chat.id; // 957345345
  nameUser = message.chat.first_name;
  let name = message.chat.first_name;
  let lastname = message.chat.last_name;
  let username = message.chat.username;
  if (text == "/start") {
    emojiKeyboard = {};
    finishList = [];
    unblockList = [];
    bot.sendMessage(
      chatId,
      `<b> start game, you level ${amountCards - 2}</b>`,
      {
        parse_mode: "HTML",
        ...randomKeyboard(),
      }
    );
    startTimeGame = new Date().getTime() / 1000; // 1703868016757   - amount seconds from 1 jan 1970 year

    // bot.sendMessage(
    //   chatId,
    //   "<b>Hello,</b> <i> " +
    //     name +
    //     "</i> <u>" +
    //     lastname +
    //     "</u>  <s> strike</s> " +
    //     username +
    //     "! <a href= 'https://google.com'>link</a>   ",
    //   {
    //     parse_mode: "HTML",
    //     ...randomKeyboard(),
    //   }
    // );
  }
  if (text == "/level") {
    bot.sendMessage(chatId, "change level", levelKeyboard);
  }
  if (text == "/records") {
    let text = "";

    for (let i = 0; i < records.length; i++) {
      if (records[i].level == amountCards - 2) {
        text += `
<b>🧑 ${records[i].name} ${records[i].record}s </b> 
     <code>${records[i].date}</code>
      `;
      }
    }

    if (text == "") {
      text = "рекордів не знайдено";
    }
    bot.sendMessage(chatId, text, {
      parse_mode: "HTML",
      ...recordsKeyboard(amountCards - 2),
    });
  }
  if (text == "hello") {
    bot.sendMessage(chatId, "hi");
  }

  if (text == "/username") {
    bot.sendMessage(chatId, "<i> " + username + "</i>", {
      parse_mode: "HTML",
    });
  }

  if (text == 2) {
    bot.sendMessage(chatId, "<b>4</b>", {
      parse_mode: "HTML",
    });
  }
});

bot.on("callback_query", async function (message) {
  nameUser = message.message.chat.first_name;
  numMessage = message.id;
  chatId = message.message.chat.id; // 957345345

  if (message.data.startsWith("setLevel")) {
    let level = message.data.slice(9);
    amountCards = +level + 2;
    console.log(amountCards);
    let maxLevelPlayer = 1;

    for (let i = 0; i < records.length; i++) {
      if (records[i].name == nameUser && records[i].level > maxLevelPlayer) {
        maxLevelPlayer = records[i].level + 1;
      }
    }
    if (level <= maxLevelPlayer) {
      bot.sendMessage(chatId, `рівень ${level} встановлено`);
    } else {
      bot.sendMessage(
        chatId,
        `Вам треба пройти рівень для того щоб його вибрати, ви можете вибрати рівень до ${maxLevelPlayer}`
      );
    }
    //  bot.sendMessage(chatId, `рівень ${level} встановлено`);
  }
  if (message.data.startsWith("records-num")) {
    let n = message.data.slice(12);
    let text = "";

    for (let i = 0; i < records.length; i++) {
      if (records[i].level == n) {
        text += `
<b>🧑 ${records[i].name} ${records[i].record}s </b> 
     <code>${records[i].date}</code>
      `;
      }
    }

    if (text == "") {
      text = "рекордів не знайдено";
    }

    bot.editMessageText(`${text}`, {
      ...recordsKeyboard(+n),
      chat_id: chatId,
      message_id: message.message.message_id,
      parse_mode: "HTML",
    });
  }
  if (message.data.startsWith("records-right")) {
    let n = message.data.slice(14);

    if (n >= 25) {
      bot.answerCallbackQuery(message.id, {
        text: "error",
        show_alert: false,
      });
    } else {
      // bot.sendMessage(chatId, "text", recordsKeyboard(+n));

      let text = "";

      for (let i = 0; i < records.length; i++) {
        if (records[i].level == n) {
          text += `
<b>🧑 ${records[i].name} ${records[i].record}s </b> 
     <code>${records[i].date}</code>
      `;
        }
      }

      if (text == "") {
        text = "рекордів не знайдено";
      }

      bot.editMessageText(text, {
        ...recordsKeyboard(+n),
        chat_id: chatId,
        message_id: message.message.message_id,
        parse_mode: "HTML",
      });
    }
  }
  if (message.data.startsWith("records-left")) {
    let n = message.data.slice(13);
    console.log("n", n);
    if (n <= 3) {
      n = 1;
    } else {
      n = n - 3;
    }
    if (n == 0) {
      bot.answerCallbackQuery(message.id, { text: "error", show_alert: false });
    } else {
      let text = "";

      for (let i = 0; i < records.length; i++) {
        if (records[i].level == n) {
          text += `
<b>🧑 ${records[i].name} ${records[i].record}s </b> 
     <code>${records[i].date}</code>
      `;
        }
      }

      if (text == "") {
        text = "рекордів не знайдено";
      }

      bot.editMessageText(text, {
        ...recordsKeyboard(+n),
        chat_id: chatId,
        message_id: message.message.message_id,
        parse_mode: "HTML",
      });
    }
  }

  if (message.data == "firstBtn") {
    bot.sendMessage(chatId, "hello 1");
  } else if (message.data == "thirdBtn") {
    bot.sendMessage(chatId, "hello 3");
  } else if (message.data.startsWith("emoji-")) {
    // emoji-12-:)     !60letter
    let emoji = message.data.slice(message.data.length - 2);
    console.log("emoji", emoji);
    let indexClickedBtn = message.data.split("-")[1];
    console.log("indexClickedBtn ", indexClickedBtn);
    // let newkeyboard = {
    //   reply_markup: {
    //     inline_keyboard: [[{ text: "my btn", callback_data: "click" }]],
    //   },
    // };
    if (numMessage >= 0) {
      //  await bot.answerCallbackQuery({
      //    callback_query_id: numMessage,
      //  });
    }
    bot.editMessageReplyMarkup(
      randomKeyboard(indexClickedBtn, emoji).reply_markup,
      {
        chat_id: message.message.chat.id,
        message_id: message.message.message_id,
      }
    );
    //bot.sendMessage(chatId, "emoji: " + emoji);
  }
});
