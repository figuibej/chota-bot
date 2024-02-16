'use strict';

const TelegramBot = require('node-telegram-bot-api');
const movieFetcher = require("./movie-fetcher");
const utils = require('./utils');
const { LOGGER } = require('./logger');
const bot = new TelegramBot(process.env.TELEGRAM_KEY, {polling: true});
let errorHandler = (err) => {
    LOGGER.error(err);
}

bot.onText(/^\/movie$/, (msg) => {
    movieFetcher.getTitle(errorHandler, (titleResult) => {
		LOGGER.info(`Responding /movie to ${msg.chat.id} with : ${titleResult}`);
        bot.sendMessage(msg.chat.id, titleResult);
    });
});

bot.onText(/^\/chota$/, (msg) => {
    movieFetcher.getTitle(errorHandler, (titleResult) => {
        LOGGER.info(`Responding /chota to ${msg.chat.id} with : ${titleResult}`);
        bot.sendMessage(msg.chat.id, titleResult);
    })
});

bot.onText(/^\/chota (.*)/, (msg, match) => {
    let titleResult = utils.changeRandom(match[1])
    LOGGER.info(
        `Responding /chota ${match[1]} to ${msg.chat.id} with : ${titleResult}`
    );
    bot.sendMessage(msg.chat.id, titleResult);
});

bot.onText(/\/ask (.+)/, (msg) => {
    LOGGER.info(`Responding 'A tu hermana!!! 'to ${msg.chat.id}`);
    bot.sendMessage(msg.chat.id, "A tu hermana!!!");
});

bot.onText(/\/quien (.+)/, (msg) => {
    LOGGER.info(`Responding 'A tu hermana!!! 'to ${msg.chat.id}`);
    bot.sendMessage(msg.chat.id, "A tu hermana!!!");
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    LOGGER.info(`Echo ${match[1]} to ${msg.chat.id}`);
    bot.sendMessage(msg.chat.id, match[1]);
});

bot.on('message', (msg) => {
    LOGGER.info(/chota/.test(msg.text.toLowerCase()));
    if (/chota/.test(msg.text.toLowerCase()) && !/\/chota/.test(msg.text.toLowerCase())) {
        movieFetcher.getTitle(errorHandler, (titleResult) => {
            LOGGER.info(`Responding on 'message' to ${msg.chat.id} with : ${titleResult}`);
            bot.sendMessage(msg.chat.id, titleResult);
        })
    }

    if (/markov/.test(msg.text.toLowerCase()) && !/\/markov/.test(msg.text.toLowerCase())) {
        bot.sendMessage(221495686, "/markov@Markov_Bot");
    }
});

LOGGER.info("Bot in running...");
