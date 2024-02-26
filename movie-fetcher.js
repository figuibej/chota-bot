let fetch = require('node-fetch');
let utils = require('./utils');
const getNouns = require('./nlp-service');
const { LOGGER } = require('./logger');

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
        const nouns = await getNouns(title);
        const titleWords = title.split(" ");

        // const validWords = titleWords.filter(word => !utils.isStopWord(word) && utils.validWordRegExp.test(word));

        if (nouns.length > 0) {
            const nounIndex = utils.random(0, nouns.length - 1);
            const randomValidWord = nouns[nounIndex].word;
            const replacedWordIndex = titleWords.indexOf(randomValidWord);
            const replacement = nouns[nounIndex].replacement;
            
            console.log(nouns, randomValidWord, replacedWordIndex, title)

            if (replacedWordIndex === 0) {
                titleWords[replacedWordIndex] = replacement[0].toUpperCase() + replacement.slice(1);
            } else {
                titleWords[replacedWordIndex] = utils.replace(
                    titleWords[replacedWordIndex],
                    replacement
                );
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

// call getTitle with a callback function
// getTitle((err) => {
//     console.error(err);
// }, (title) => {
//     console.log(title);
// });

module.exports = {
    getTitle: getTitle
};