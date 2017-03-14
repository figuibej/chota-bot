'use strict';

let firebase = require('firebase');

let app = firebase.initializeApp({
    apiKey: "AIzaSyBtNChDxncrZCqAfN2kl6YtSEjrgSO8mh8",
    authDomain: "nerdpoint-ef650.firebaseapp.com",
    databaseURL: "https://nerdpoint-ef650.firebaseio.com",
    storageBucket: "nerdpoint-ef650.appspot.com",
    messagingSenderId: "638962803741"
});

let fs = require("fs");
let fileName = "nerdpoints.json";

let add = (user, points, isAddition) => {
    let content = JSON.parse(fs.readFileSync(fileName));
    if(content[user]) {
        content[user].points = isAddition ? parseInt(content[user].points + points) : parseInt(content[user].points - points);
        fs.writeFile(fileName, JSON.stringify(content, null, 4));
    }
    return pretty(content);
};

var pretty = (persons) => {
    let result = "";
    for(let person in persons) {
        result += `${persons[person].name} : <b>${persons[person].points}</b> `;
    }
    return result;
};

let get = (prettyPrint) => {
    let result = JSON.parse(fs.readFileSync(fileName));
    return prettyPrint ? pretty(result) : result;
};



module.exports = {
    add : add,
    get : get
};
