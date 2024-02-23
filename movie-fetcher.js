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

const getTitle = async (err, success) => {
    const url = `${baseUrl}&page=${utils.random(1, 10)}&query=${queryOptions[utils.random(0, queryOptions.length - 1)]}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const { title } = data.results[utils.random(0, data.results.length - 1)];
        const titleWords = title.split(" ");

        const replacedWordIndex = titleWords.findIndex((word, index) => {
            const lowerCaseWord = word.toLowerCase();
            return !utils.isStopWord(lowerCaseWord) && utils.validWordRegExp.test(lowerCaseWord);
        });

        if (replacedWordIndex !== -1) {
            titleWords[replacedWordIndex] = utils.replace(
                titleWords[replacedWordIndex],
                utils.findChotoGender(titleWords, replacedWordIndex - 1)
            );
            if (replacedWordIndex === 0) {
                titleWords[replacedWordIndex] = titleWords[replacedWordIndex][0].toUpperCase() + titleWords[replacedWordIndex].slice(1);
            }
        } else if (titleWords.length === 1) {
            titleWords[0] = "Chota";
        }

        success(`${titleWords.join(" ")} - (${title})`);
    } catch (e) {
        err(e);
    }
}

module.exports = {
    getTitle: getTitle
};