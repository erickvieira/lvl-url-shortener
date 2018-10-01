'use strict';
module.exports = class ShortenedURLElement {
    constructor(url, short_id, has_security) {
        this.original_url = '';
        this.short_id = '';
        this.type = has_security ? 'https' : 'http';
        if (url && typeof url == typeof this.original_url) {
            this.original_url = url;
        }
        if (short_id && typeof short_id == typeof this.short_id) {
            this.short_id = short_id;
        }
        this.check_in = Date.now();
    }
}
