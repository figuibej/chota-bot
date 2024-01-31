'use strict';

const restify = require('restify');
const movieFetcher = require("./movie-fetcher");
const utils = require("./utils")
require('./telegram-bot');


const server = restify.createServer({
    name: 'chota-bot',
    version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get("/", (req, res, next) => {
    res.redirect(302, "/movie", next);
});

server.get("/movie", (req, res, next) => {
    movieFetcher.getTitle((err)=> {res.send(500, err)}, (titleResult) => { res.send(200, {title : titleResult }) });
});

server.get("/movie/:title", (req, res, next) => {
    let titleResult = utils.changeRandom(req.params.title)
    titleResult ? res.send(200, { title : titleResult }) : res.send(500, "Something is wrong, title cannot be chotaized")
});

server.listen(process.env.PORT || 8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});

