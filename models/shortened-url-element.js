var ShortenedURLElement = class {
    constructor(url, shortId, hasSecurity) {
        this.originalUrl = '';
        this.shortId = '';
        this.type = hasSecurity ? 'https' : 'http';
        if (url && typeof url == typeof this.originalUrl) {
            this.originalUrl = url;
        }
        if (shortId && typeof shortId == typeof this.shortId) {
            this.shortId = shortId;
        }
        this.checkIn = Date.now();
    }
}

module.exports.ShortenedURLElement = ShortenedURLElement;