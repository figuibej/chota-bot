let fetch = require('node-fetch');
let utils = require('./utils');
    
const baseUrl = `https://api.themoviedb.org/3/search/movie?api_key=a7dc625117e31b1b8294e494696b4de7&language=es-ES&include_adult=true`;
const queryOptions = ["la", "le", "de", "que", "un", "del", "con"];


const getTitle = (err, success) => {
    let url = baseUrl + `&page=${utils.random(1, 10)}`;
    let query = queryOptions[utils.random(0, queryOptions.length - 1)];
    url += `&query=${query}`;
    fetch(url)
        .then((res) => { return res.json() })
        .then((data) => {
            let title = data.results[utils.random(0, data.results.length - 1)].title;
            let titleWords = title.split(" ");

            let replaceDone = false;
            let i = 0;
            while(i <= titleWords.length | !replaceDone) {
                let index = utils.random(0, titleWords.length - 1);
                if(!utils.isStopWord(titleWords[index].toLowerCase()) && utils.validWordRegExp.test(titleWords[index].toLowerCase())) {
                    replaceDone = true;
                    titleWords[index] = utils.replace(titleWords[index], utils.findChotoGender(titleWords, index - 1));
                    if (index == 0) {
                        titleWords[index] = titleWords[index].charAt(0).toUpperCase() + titleWords[index].slice(1);
                    }
                    break;
                }
                i++;
            }
            if(!replaceDone || titleWords.length == 1) { titleWords[0] = "Chota" }
            if(/^(el|la|lo|los|las|se|le|les|un|de)\s(chota|choto|chotos|chotas)$/.test(titleWords.join(" ").toLowerCase())) {
                getTitle(err, success)
            } else {
                success(titleWords.join(" ") + ` - (${title})`);
            }

        })
        .catch((error) => {
            err(error)
        })
}

module.exports = {
    getTitle : getTitle
};