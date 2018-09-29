var appRouter = (app, urlTools) => {

    app.get("/s", (req, res) => {
        let url = req.query.u;
        let encoded = urlTools.encode(url);
        res.status(encoded.error ? 500 : 200).send(
            JSON.stringify(encoded)
        );
    });

    app.get("/e/:encoded", (req, res) => {
        let encoded = req.params.encoded;
        let decoded = urlTools.decode(encoded);
        if (decoded.error) {
            res.status(404).send(
                JSON.stringify(decoded)
            );
        } else {
            res.redirect(`http://${decoded.url}`);
        }
    });

    app.get("/u", (_, res) => {
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