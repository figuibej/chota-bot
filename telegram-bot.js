'use strict';

let TelegramBot = require('node-telegram-bot-api');
let movieFetcher = require("./movie-fetcher");
let utils = require('./utils');
let rateOptions = [ ['Esta bien!!!!'], ['Maso'], ['Buuuuuuuuu'] ];

let bot = new TelegramBot('311477110:AAEPYL1lz75Gh52NgJfVbhwYbNnR56rqtIM', { polling: true });
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
	console.log(`Responding 'Tu hermana!!! 'to ${msg.chat.id}`);
	bot.sendMessage(msg.chat.id, "Tu hermana!!!");
});

bot.onText(/\/quien (.+)/, function (msg) {
	console.log(`Responding 'Tu hermana!!! 'to ${msg.chat.id}`);
	bot.sendMessage(msg.chat.id, "Tu hermana!!!");
});

bot.onText(/\/echo (.+)/, function (msg, match) {
	console.log(`Echo ${match[1]} to ${msg.chat.id}`);
	bot.sendMessage(msg.chat.id, match[1]);
});

bot.on('message', (msg) => {
	if(/chota/.test(msg.text))  {
		movieFetcher.getTitle(errorHanler, (titleResult) => {
			console.log(`Responding on 'message' to ${msg.chat.id} with : ${titleResult}`);
			bot.sendMessage(msg.chat.id, titleResult);
		})
	}
		
})

console.log("Bot in running...");
