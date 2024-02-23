let fetch = require('node-fetch');
let utils = require('./utils');

const baseUrl = `https://api.themoviedb.org/3/search/movie?api_key=a7dc625117e31b1b8294e494696b4de7&language=es-ES&include_adult=true`;
const queryOptions = [
    "la",
    "las",
    "el",
    "los",
    "le",
    "de",
    "que",
    "un",
    "del",
    "con"
];

const getTitle = async (err, success, retries = 5) => {
    const url = `${baseUrl}&page=${utils.random(1, 10)}&query=${queryOptions[utils.random(0, queryOptions.length - 1)]}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const { title } = data.results[utils.random(0, data.results.length - 1)];
        const titleWords = title.split(" ");

        const validWords = titleWords.filter(word => !utils.isStopWord(word) && utils.validWordRegExp.test(word));

        if (validWords.length > 0) {
            const randomValidWord = validWords[utils.random(0, validWords.length - 1)];
            const replacedWordIndex = titleWords.indexOf(randomValidWord);

            titleWords[replacedWordIndex] = utils.replace(
                titleWords[replacedWordIndex],
                utils.findChotoGender(titleWords, replacedWordIndex - 1)
            );
            
            if (replacedWordIndex === 0) {
                titleWords[replacedWordIndex] = titleWords[replacedWordIndex][0].toUpperCase() + titleWords[replacedWordIndex].slice(1);
            }
        } else {
            titleWords[0] = "Chota";
        }

        if(/^(el|la|lo|los|las|se|le|les|un|de)\s(chota|choto|chotos|chotas)$/.test(titleWords.join(" ").toLowerCase()) && retries > 0) {
            getTitle(err, success, retries - 1)
        } else {
            success(titleWords.join(" ") + ` - (${title})`);
        }
    } catch (e) {
        err(e);
    }
}

module.exports = {
    getTitle: getTitle
};