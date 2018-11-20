const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
 
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
 
// Add custom routes before JSON Server router
server.get('/api', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
let thisList = {list: []};
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
    thisList.list.push(req.body);
    res.status("===Returning from Json server").jsonp(thisList.list);
  }
  // Continue to JSON Server router
  next()
})

server.post('/api', (req, res) => {
    console.log(req.body)
})
 
// Use default router

server.listen(3004, () => {
  console.log('JSON Server is running')
})