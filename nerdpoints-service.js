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

let add = (user, points, isAddition) => {
    return ref.child(user).once("value")
        .then((data) => {
            let userData = data.val();
            userData.points = isAddition ? parseInt(userData.points + points) : parseInt(userData.points - points);
            ref.child(user).update(userData);
            return ref.once("value")
        })
};

var pretty = (persons) => {
    let result = "";
    for(let person in persons) {
        result += `${persons[person].name} : <b>${persons[person].points}</b> `;
    }
    return result;
};
//
let get = (prettyPrint) => {
    return ref.once("value").then((data) => { return prettyPrint ? pretty(data.val()) : null });
};

module.exports = {
    add : add,
    get : get
};

// get(true).then((data) => { console.log(data) })
// add("@belruibal", 10, false).then((data) => { console.log(data.val()) });
