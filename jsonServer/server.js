var jsonServer = require('json-server');
var server = jsonServer.create();
var middlewares = jsonServer.defaults();
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
// Add custom routes before JSON Server router
server.get('/api', function (req, res) {
    res.jsonp(req.query);
});
// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
var thisList = { list: [] };
server.use(jsonServer.bodyParser);
server.use(function (req, res, next) {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now();
        thisList.list.push(req.body);
        res.jsonp("===Returning from Json server", thisList.list);
    }
    // Continue to JSON Server router
    next();
});
server.post('/api', function (req, res) {
    console.log(req.body);
});
// Use default router
server.listen(3004, function () {
    console.log('JSON Server is running');
});
