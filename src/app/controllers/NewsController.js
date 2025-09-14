class NewsController {
    //[GET] News
    index(req, res) {
        res.render('news');
    }

    search(req, res) {
        res.render('search');
    }
}

module.exports = new NewsController();
