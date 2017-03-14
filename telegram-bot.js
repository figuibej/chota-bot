'use strict';

let TelegramBot = require('node-telegram-bot-api');
let movieFetcher = require("./movie-fetcher");
let nerdpoints = require("./nerdpoints-service");
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

bot.onText(/\/nerdpoint (\@)*[\w\s]+ [\+\-]?\d+/, function (msg, match) {
    if(msg.entities.length > 0 && msg.entities.find( (entity ) => { return entity.type == "text_mention" || entity.type == "mention" }) != undefined) {
        let user = msg.entities.find( (entity ) => { return entity.type == "text_mention" || entity.type == "mention" });
        user = user.user ? `${user.user.first_name} ${user.user.last_name}` : msg.text.substr(user.offset, user.length);
        let pointsRaw = /[\+\-]?\d+/.exec(msg.text);
        if(pointsRaw) {
            let sign = /[\+\-]?/.exec(pointsRaw[0])[0];
            let points = parseInt(/\d+/.exec(pointsRaw[0])[0]) | 0;
            bot.sendMessage(msg.chat.id, nerdpoints.add(user, points, sign == "+" || sign == 0));
        }
    } else {
        bot.sendMessage(msg.chat.id, "Nope!");
    }
});

bot.onText(/\/nerdpoints/, function (msg, match) {
    let result = JSON.stringify(nerdpoints.get(true));
    bot.sendMessage(msg.chat.id, result, { parse_mode : "HTML" });
});

/*bot.on('message', (msg) => {
	console.log(/chota/.test(msg.text.toLowerCase()));
	if(/chota/.test(msg.text.toLowerCase()) && !/\/chota/.test(msg.text.toLowerCase())) {
		movieFetcher.getTitle(errorHanler, (titleResult) => {
			console.log(`Responding on 'message' to ${msg.chat.id} with : ${titleResult}`);
			bot.sendMessage(msg.chat.id, titleResult);
		})
	}
});*/

console.log("Bot in running...");
