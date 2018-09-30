const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const ShortenedURLElement = require("./models/shortened-url-element");
const app = express();

const firebase = require('firebase');
firebase.initializeApp({
    apiKey: "AIzaSyDw9P5YtxruftU2CljM7cAmn5z6MzaULIU",
    authDomain: "url-shortener-7442a.firebaseapp.com",
    databaseURL: "https://url-shortener-7442a.firebaseio.com",
    projectId: "url-shortener-7442a",
    storageBucket: "url-shortener-7442a.appspot.com",
    messagingSenderId: "21104939841"
});

var shortenedCollection = [];

const reader = firebase.database().ref("encodeList");
reader.on('value', (snapshot) => {
    const storage = snapshot.val();
    console.log(storage);
    shortenedCollection = storage['list'];
});

const encodeUrl = (url, hasSecurity) => {
    serialize = Math.floor((Math.random() * 1000000) + 9999999);
    shortened = serialize.toString(16);
    if (shortenedCollection.length > 0) {
        let isDuplicate = shortenedCollection.find(el => el.shortId == shortened) !== undefined;
        if (isDuplicate) {
            encodeUrl(url);
        }
    }
    let sce = new ShortenedURLElement(url, shortened, hasSecurity);
    if (shortenedCollection.length <= 9999999) {
        shortenedCollection.push(sce);
        firebase.database().ref('encodeList').push({ list: shortenedCollection }).then(
            console.log('salvo com sucesso!')
        );
        return sce;
    } else return { error: "Infelizmente atingimos o limite de URLs encurtadas!", code: 3 }
};
const decodeUrl = (shortened) => {
    let notFound = { error: "A url não foi encontrada ou está expirada!", code: 2 };
    let url = shortenedCollection.find(sce => sce.shortId == shortened);
    if (url) {
        let encodeDate = new Date(url.checkIn);
        let expireLimit = new Date();
        expireLimit.setDate(expireLimit.getDate() + 5);
        if (encodeDate >= expireLimit) {
            shortenedCollection = shortenedCollection.slice(url, 1);
            return notFound;
        } else return url;
    } else {
        return notFound;
    }
};
const getAll = () => {
    let urls = [];
    if (shortenedCollection == 0) {
        return { error: "Nenhuma URL foi encurtada ainda!", code: 1 };
    }
    shortenedCollection.forEach((sce) => {
        urls.push({ shortId: sce.shortId, url: sce.originalUrl });
    }); return urls;
};
const urlTools = { 
    encode: encodeUrl, 
    decode: decodeUrl,
    all: getAll,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

routes(app, urlTools);

const server = app.listen(3000, () => {
    console.log("[>] LVL URL SHORTENER is running! \n[!] Details:", JSON.stringify(server.address()));
});