// obtendo pacotes principais
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");
const app = express();
// definindo classes:
const FirebaseDatabase = require("./models/firebase-database");
const ShortenedURLElement = require("./models/shortened-url-element");
// atualizando base
var shortenedCollection = [];
// inicializando serviços do firebase
const database = new FirebaseDatabase(
    shortenedCollection,
    (storage) => {
        shortenedCollection = storage ? storage['shortUrls'] : []
    }
);

const encodeUrl = (url, hasSecurity) => {
    serialize = Math.floor((Math.random() * 1000000) + 9999999);
    shortened = serialize.toString(16);
    if (shortenedCollection.length > 0) {
        let isDuplicate = shortenedCollection.find(el => el.short_id == shortened);
        if (isDuplicate) {
            encodeUrl(url);
        }
    }
    let sce = new ShortenedURLElement(url, shortened, hasSecurity);
    if (shortenedCollection.length <= 9999999) {
        shortenedCollection.push(sce);
        database.updateStorage(shortenedCollection);
        return sce;
    } else return { error: "Infelizmente atingimos o limite de URLs encurtadas!", code: 3 }
};
const decodeUrl = (shortened) => {
    let notFound = { error: "A url não foi encontrada ou está expirada!", code: 2 };
    let url = shortenedCollection.find(sce => sce.short_id == shortened);
    if (url) {
        let encodeDate = new Date(url.check_in);
        let expireLimit = new Date();
        expireLimit.setDate(expireLimit.getDate() + 5);
        if (encodeDate >= expireLimit) {
            shortenedCollection = shortenedCollection.slice(url, 1);
            database.updateStorage(shortenedCollection);
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
        urls.push({ short_id: sce.short_id, url: sce.original_url });
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