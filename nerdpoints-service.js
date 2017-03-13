'use strict';

let fs = require("fs");
let fileName = "nerdpoints.json";

let add = (user, points, isAddition) => {
    let content = JSON.parse(fs.readFileSync(fileName));
    if(content[user]) {
        content[user] = isAddition ? content[user] + points : content[user] - points;
    } else {
        content[user] = points * isAddition ? 1 : -1
    }
    fs.writeFileSync(fileName, JSON.stringify(content));
    return pretty(content);
};

var pretty = (persons) => {
    let result = "";
    for(let person in persons) {
        result += `${person} : <b>${persons[person]}</b> `;
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
