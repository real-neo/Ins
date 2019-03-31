exports.index = function (req, res) {
    res.render('stories/index');
};

exports.new = function (req, res) {
    res.render('stories/new');
};

exports.getStoriesById = function (req, res) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    let stories = [
        {id: 0, user_id: 'neo', date: 1553803879301, text: 'This is a test blog.'},
        {id: 1, user_id: 'neo', date: 1553803899301, text: 'This is another test blog.'}
    ];
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(stories));
};
