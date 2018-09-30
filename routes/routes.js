var appRouter = (app, urlTools) => {

    app.get("/short", (req, res) => {
        let url = req.query.url;
        if (url) {
            if(url.substr(0, 7) == 'http://') {
                url = url.substr(7, url.length);
                let encoded = urlTools.encode(url, false);
                res.status(encoded.error ? 500 : 200).send(
                    JSON.stringify(encoded)
                );
            } else if (url.substr(0, 8) == 'https://') {
                url = url.substr(8, url.length);
                let encoded = urlTools.encode(url, true);
                res.status(encoded.error ? 500 : 200).send(
                    JSON.stringify(encoded)
                );
            } else {
                let encoded = urlTools.encode(url, false);
                res.status(encoded.error ? 500 : 200).send(
                    JSON.stringify(encoded)
                );
            }
        } else {
            res.status(404).send(
                JSON.stringify({ error: 'A URL não foi informada!', code: 0 })
            );
        }
    });

    app.get("/:shortId", (req, res) => {
        let shortId = req.params.shortId;
        let decoded = urlTools.decode(shortId);
        if (decoded.error) {
            res.status(404).send(
                JSON.stringify(decoded)
            );
        } else res.redirect(`${decoded.type}://${decoded.originalUrl}`);
    });

    app.get("/", (_, res) => {
        let urls = urlTools.all();
        if (urls.error) {
            res.status(404).send(
                JSON.stringify(urls)
            );
        } else {
            res.status(200).send(
                JSON.stringify({ urls: urls })
            );
        }
    });

}

module.exports = appRouter;