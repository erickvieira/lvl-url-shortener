var appRouter = (app, urlTools) => {

    app.get("/short", (req, res) => {
        let url = req.query.url;
        if (url) {
            if(url.substr(0, 7) == 'http://') {
                url = url.substr(7, url.length);
                let encoded = urlTools.encode(url, false);
                res.status(encoded.error ? 500 : 200).send(encoded);
            } else if (url.substr(0, 8) == 'https://') {
                url = url.substr(8, url.length);
                let encoded = urlTools.encode(url, true);
                res.status(encoded.error ? 500 : 200).send(encoded);
            } else {
                let encoded = urlTools.encode(url, false);
                res.status(encoded.error ? 500 : 200).send(encoded);
            }
        } else {
            res.status(404).send(
                { error: 'A URL não foi informada!', code: 0 }
            );
        }
    });

    app.get("/:short_id", (req, res) => {
        let short_id = req.params.short_id;
        let decoded = urlTools.decode(short_id);
        if (decoded.error) {
            res.status(404).send(decoded);
        } else res.redirect(`${decoded.type}://${decoded.original_url}`);
    });

    app.get("/", (_, res) => {
        let urls = urlTools.all();
        if (urls.error) {
            res.status(404).send(urls);
        } else {
            res.status(200).send({ urls: urls });
        }
    });

}

module.exports = appRouter;