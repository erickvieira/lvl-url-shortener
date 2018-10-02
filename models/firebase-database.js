'use strict';
module.exports = class FirebaseDatabase {
    constructor(shortenedCollection, updateCollection) {
        this.updateCollection = updateCollection;
        this.shortenedCollection = shortenedCollection;
        this.init();
    }

    init() {
        this.admin = require('firebase-admin');
        this.serviceAccount = require("./../keys/firebase-auth/lvl5-url-shortener-firebase-adminsdk-g0qzp-56a64758ac.json");
        this.admin.initializeApp({
            credential: this.admin.credential.cert(this.serviceAccount),
            databaseURL: "https://lvl5-url-shortener.firebaseio.com",
            apiKey: "AIzaSyCrVmBqEksZPwn9h-td9sKE9PZXLZiIR80",
            authDomain: "lvl5-url-shortener.firebaseapp.com",
            projectId: "lvl5-url-shortener",
            storageBucket: "lvl5-url-shortener.appspot.com",
            messagingSenderId: "762397459089"
        });
        this.db = this.admin.database();
        this.ref = this.db.ref("url_storage");
        this.ref.on('value', (snapshot) => {
            const storage = snapshot.val();
            console.log('[>] STORAGE', storage);
            this.updateCollection(storage);
        });
    }

    getCollection() {
        return this.shortenedCollection;
    }

    updateStorage(shortenedCollection) {
        this.ref.set(shortenedCollection).then(
            console.log(`[<] Sincronizado!`)
        ).catch(error => console.log(`[<] ERROR: ${error}`));
    }
}