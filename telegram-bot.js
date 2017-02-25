'use strict';

let TelegramBot = require('node-telegram-bot-api');
let movieFetcher = require("./movie-fetcher");
let utils = require('./utils');

let bot = new TelegramBot(process.env.TELEGRAM_KEY, { polling: true });
let errorHanler = (err) => { bot.sendMessage(msg.chat.id, "Me siento mal, te contesto cuando me recupere");}

bot.onText(/^\/movie$/, function (msg) {
	movieFetcher.getTitle(errorHanler, (titleResult) => {
		console.log(`Responding /movie to ${msg.chat.id} with : ${titleResult}`);
		bot.sendMessage(msg.chat.id, titleResult);
	});
});

bot.onText(/^\/chota$/, function (msg) {
	movieFetcher.getTitle(errorHanler, (titleResult) => {
		console.log(`Responding /chota to ${msg.chat.id} with : ${titleResult}`);
		bot.sendMessage(msg.chat.id, titleResult);
	})
});

bot.onText(/^\/chota (.*)/, function (msg, match) {
	let titleResult = utils.changeRandom(match[1])
	console.log(`Responding /chota ${match[1]} to ${msg.chat.id} with : ${titleResult}`);
	bot.sendMessage(msg.chat.id, titleResult);
});

bot.onText(/\/ask (.+)/, function (msg) {
	console.log(`Responding 'A tu hermana!!! 'to ${msg.chat.id}`);
	bot.sendMessage(msg.chat.id, "A tu hermana!!!");
});

bot.onText(/\/quien (.+)/, function (msg) {
	console.log(`Responding 'A tu hermana!!! 'to ${msg.chat.id}`);
	bot.sendMessage(msg.chat.id, "A tu hermana!!!");
});

bot.onText(/\/echo (.+)/, function (msg, match) {
	console.log(`Echo ${match[1]} to ${msg.chat.id}`);
	bot.sendMessage(msg.chat.id, match[1]);
});

bot.on('message', (msg) => {
	console.log(/chota/.test(msg.text.toLowerCase()));
	if(/chota/.test(msg.text.toLowerCase()) && !/\/chota/.test(msg.text.toLowerCase())) {
		movieFetcher.getTitle(errorHanler, (titleResult) => {
			console.log(`Responding on 'message' to ${msg.chat.id} with : ${titleResult}`);
			bot.sendMessage(msg.chat.id, titleResult);
		})
	}
});

console.log("Bot in running...");
