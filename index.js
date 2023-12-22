import TelegramBot from "node-telegram-bot-api";
import { shuffleEmoji, getEmoji } from "./shuffle-emoji.js";

let emojiKeyboard = {}

let bot = new TelegramBot("6937853671:AAGT9Boa97ztrgOQzfv9aQOTLEfq4tjTfSs", {polling: true});
let chatId = 0;
bot.setMyCommands([
  { command: "start", description: "start game" },
  { command: "username", description: "show username" },
]);

let finishList = []

// game: 

// 🌶🍊🥕🫐🥬🍋😂
let emoji = ["🌶", "🍊", "😂", "🍋", "🥬", "🥕"];


let unblockList = []


// 6 btn: 3 fruit



function randomKeyboard(index, emoji_){




  let oldEmoji = ""
  let newEmoji = emoji_;










  if (emojiKeyboard.reply_markup != undefined) {
    let keyboardOld = emojiKeyboard.reply_markup.inline_keyboard.flat()
    for (let i = 0; i < keyboardOld.length; i++) {
      if (keyboardOld[i].text != '⬜️' && !unblockList.includes(keyboardOld[i].text)) {
        oldEmoji = keyboardOld[i].text;
        break
      }
    }
  }


  



  console.log("oldEmoji", oldEmoji);
  console.log("newEmoji", newEmoji);

  if (oldEmoji == newEmoji) {
    unblockList.push(oldEmoji);
  }




  let amountCards = 4
  if (index && emoji_) {
    console.log('wow')
  } else {
    let newListEmoji = shuffleEmoji(emoji);
    let readyList = getEmoji(newListEmoji, amountCards);
    finishList = shuffleEmoji(readyList);
  }

  console.log(finishList);

  let btns = [];
  let btns2 = [];

  

 


  for (let i = 0; i < amountCards; i++) {
    if (i  == index) {
      btns.push({
        text: emoji_,
        callback_data: "emoji-" + i + "-" + finishList[i],
      });

    } 
    
    else if (unblockList.includes(finishList[i])){
      btns.push({
        text: finishList[i],
        callback_data: "emoji-" + i + "-" + finishList[i],
      });

    }
    

    
    else {
    btns.push({
      text: "⬜️",
      callback_data: "emoji-" + i + "-" + finishList[i],
    });
  }
}







  for (let i = amountCards; i < amountCards*2; i++) {
     if (i == index) {
       btns2.push({
         text: emoji_,
         callback_data: "emoji-" + i + "-" + finishList[i],
       });
     } else if (unblockList.includes(finishList[i])) {
       btns2.push({
         text: finishList[i],
         callback_data: "emoji-" + i + "-" + finishList[i],
       });
     } else {
       btns2.push({
         text: "⬜️",
         callback_data: "emoji-" + i + "-" + finishList[i],
       });
     }
  }


  emojiKeyboard = {
    reply_markup: {
      inline_keyboard: [btns, btns2],
    },
  };
  // console.log(emojiKeyboard.reply_markup.inline_keyboard);
  
  let amountWhite = 0

  if (emojiKeyboard.reply_markup != undefined) {
    let keyboardNew = emojiKeyboard.reply_markup.inline_keyboard.flat();
    for (let i = 0; i < keyboardNew.length; i++) {
      if (
        keyboardNew[i].text == "⬜️")
       {
        amountWhite++
      }
    }
  }
  
  if (amountWhite == 0){
    bot.sendMessage (chatId, 'You Win')
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


bot.on('message', function (message) {
    let text = message.text;
    chatId = message.chat.id; // 957345345
    let name = message.chat.first_name;
    let lastname = message.chat.last_name;
    let username = message.chat.username;
    if (text == "/start"){
       emojiKeyboard = {};
       finishList = [];
       unblockList = [];
      bot.sendMessage(
        chatId,
        "<b> start game</b>",
        {
          parse_mode: "HTML",
          ...randomKeyboard(),
        }
      );
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
    if (text == "hello"){
      bot.sendMessage(chatId, "hi")
    }

     if (text == "/username"){
        bot.sendMessage(
          chatId,
          "<i> " + username +"</i>",
          {
            parse_mode: "HTML",
          }
        );
     }

    if (text == 2){
        bot.sendMessage(
            chatId,
        "<b>4</b>", {
            parse_mode: "HTML",
        }
        );

    }
})


bot.on('callback_query', function (message) {
  chatId = message.message.chat.id; // 957345345
  if (message.data == "firstBtn") {
    bot.sendMessage(chatId, "hello 1");

  } else if (message.data == "thirdBtn") {
    bot.sendMessage(chatId, "hello 3");

  } else if (message.data.startsWith("emoji-")) {
    let emoji = message.data.slice(8)
    let indexClickedBtn = message.data.slice(6, 7);
    console.log("indexClickedBtn ", indexClickedBtn);
    
    
    // let newkeyboard = {
    //   reply_markup: {
    //     inline_keyboard: [[{ text: "my btn", callback_data: "click" }]],
    //   },
    // };
    bot.editMessageReplyMarkup(randomKeyboard(indexClickedBtn, emoji).reply_markup, {
      chat_id: message.message.chat.id,
      message_id: message.message.message_id,
    });
    //bot.sendMessage(chatId, "emoji: " + emoji);
  }
  
})

