exports.indexPage = async (req, res) => {
    res.locals.title = 'Home';
    res.render('index');
};
