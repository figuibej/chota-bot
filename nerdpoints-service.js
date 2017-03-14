'use strict';

let firebase = require('firebase');

let app = firebase.initializeApp({
    apiKey: "AIzaSyBtNChDxncrZCqAfN2kl6YtSEjrgSO8mh8",
    authDomain: "nerdpoint-ef650.firebaseapp.com",
    databaseURL: "https://nerdpoint-ef650.firebaseio.com",
    storageBucket: "nerdpoint-ef650.appspot.com",
    messagingSenderId: "638962803741"
});

let ref = app.database().ref("users");

var get = (prettyPrint) => {
    return ref.once("value").then((data) => { return prettyPrint ? pretty(data) : null });
};

let add = (user, points, isAddition) => {
    return ref.child(user).once("value")
        .then((data) => {
            let userData = data.val();
            userData.points = isAddition ? parseInt(userData.points + points) : parseInt(userData.points - points);
            ref.child(user).update(userData);
            return get(true)
        })
};

var pretty = (persons) => {
    let users = [];
    persons.forEach((child) => { users.push(child.val()) })
    users.sort((a,b) => { return a["points"] > b["points"] ? -1 : (a["points"] < b["points"] ? 1 : 0) })
    let result = "";
    for(let user in users) {
        result += `${users[user].name} : *${users[user].points}*\n`;
    }
    return result;
};

module.exports = {
    add : add,
    get : get
};
