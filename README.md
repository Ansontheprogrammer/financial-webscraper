<b> Finviz Application Server </b>

This finviz application server allows for the saving of stock lists for retrieval later. The stock data is retrieved using the finviz npm package and
then saved to a database using mongo / mongoose.

The application currently has 3 endpoints:

  /api/getUser/:email
  
    This route is to obtain a user's information via the user's email. The route will respond with an user object containing the information
    If an user is not found the route will return a 404 error
    
  /api/getStockList/:email/:name
  
    This route is to obtain a specific stock list via the user's email, and name. The route will respond with an array containing stock data
    If an user is not found the route will return a 404 error
    
  /api/startUserFlow
  
    This route requires an email and name of the portfolio included in the body of the request.
    Then the route will create a new user if an user is not found within the database.
    Finally add the stock list to the user's record
