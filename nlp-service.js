const fetch = require('node-fetch');
const { isArticle, isStopWord, validWordRegExp, MALE, FEMALE, PLURAL, SINGULAR, random, findChotoGender } = require('./utils');
const SPACY_HOST = process.env.SPACY_HOST || 'http://localhost:3000';

async function getNouns(text) {
    const textLower = text.toLowerCase();
    const textLowerSplit = textLower.split(' ');
    const textSplit = text.split(' ')
    try {
        const response = await fetch(`${SPACY_HOST}/dep`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"text":textLower,"model":"es","collapse_punctuation":true,"collapse_phrases":true})
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Spacy service');
        }

        const data = await response.json();
        
        let result = []
        data?.words
            ?.filter((word) => /^NOUN/.test(word?.tag))
            ?.forEach((word) => {
                word?.text
                    ?.split(" ")
                    ?.filter((w) => !isArticle(w))
                    ?.forEach((w) => {
                        const gender = (/Gender\=Masc/.test(word?.tag) ? MALE : FEMALE);
                        const number = (/Number=Plur/.test(word?.tag) ? PLURAL : SINGULAR);
                        const titleLowerIndex = textLowerSplit.indexOf(w);
                        let item = {
                            word: textSplit[titleLowerIndex],
                            gender: gender,
                            number: number,
                            replacement: `chot${gender === MALE ? 'o' : 'a'}${number === PLURAL ? 's' : ''}`
                        };
                        result.push(item);
                    })
            });
        
        // if spacy does not found any nouns, use a fallback implementation
        if (result.length === 0) {
            const words = textSplit.filter((w) => !isStopWord(w) && validWordRegExp.test(w))

            if (words.length > 0) {
                const wordIndex = random(0, words.length - 1);
                const item = findChotoGender(words, wordIndex - 1);

                result.push({
                    word: words[wordIndex],
                    gender: item.gender,
                    number: item.number,
                    replacement: item.replace
                });

            } else {
                result.push({
                    word: textSplit[0],
                    gender: FEMALE,
                    number: SINGULAR,
                    replacement: 'Chota'
                });
            }
        }
        return result;

    } catch (error) {
        console.error('Error fetching Spacy service:', error);
        throw error;
    }
}

module.exports = getNouns;