exports.getNameById = function (req, res) {
    const userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }
    userData.name = "Neo";
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(userData));
};
