const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js')
const token = '7731585181:AAEeNVb0NGaspsrl5sjvv7xSCODjJB23Dvg';

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать.');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадайте число!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Приветствие' },
    { command: '/info', description: 'Информация' },
    { command: '/game', description: 'Игра "Угадай число"' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://cdn.tlgrm.ru/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/1.webp');
      return bot.sendMessage(chatId, 'Добро пожаловать!');
    }

    if (!msg.from.last_name) {
      msg.from.last_name = '';
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я вас не понимаю. Попробуйте использовать команды /start, /info или /game.');
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === String(chats[chatId])) {
      return bot.sendMessage(chatId, `Ты отгадал верно! Это действительно ${chats[chatId]}.`, againOptions);
    } else {
      return bot.sendMessage(chatId, `Ты не угадал. Загаданное число было: ${chats[chatId]}.`, againOptions);
    }
  });
};

start();