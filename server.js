const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json())

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

// app.get("/", function (request, response) {
//   response.sendFile(__dirname + "/index.html");
// });

app.get('/messages', function (request, response) {
  response.send(messages)
})

// finds and returns messages containing the search term from query params
app.get('/messages/search', function (request, response) {
  // get search term from query params
  const searchTerm = request.query.text.toLowerCase()
  // find messages containing that term
  const results = messages.filter(m => m.text.toLocaleLowerCase().includes(searchTerm))
  // return them
  response.send(results)
})

// returns the most recent 10 messages
app.get('/messages/latest', function (request, response) {
  // get the last 10 messages
  const results = messages.slice(-10)
  // return them
  response.send(results)
})

// get a single message from the data store (if it exists)
// otherwise return 404 not found
app.get('/messages/:id', function (request, response) {
  // get the message id from the request object
  const id = request.params.id
  // find an existing message with that id
  const message = messages.find(m => m.id == id)
  // if not found return status 404
  if (!message) {
    response.status(404).send()
    return
  }
  // otherwise return the message object
  response.send(message)
})

// adds a new message the data store
app.post('/messages', function (request, response) {
  // get the message content from the request
  const message = {
    from: request.body.from,
    text: request.body.text,
  }


  // if message is invalid, return status 400
  if (!isValidMessage(message)) {
    response.status(400).send()
    return
  }

  // assign it a new id
  message.id = getNextId()
  // add it to the data store array
  messages.push(message)
  // return a 201 status code and the message content
  response.status(201).send(message)
})

// removes a specific message from the data store
app.delete('/messages/:id', function (request, response) {
  // get the id from the request object
  const id = request.params.id
  // find the index of the message with the specified ID
  const index = messages.findIndex(m => m.id == id)
  // if that message is not found, return 404
  if (index == -1) {
    response.status(404).send()
    return
  }
  // otherwise remove the object at that index from the datastore
  messages.splice(index, 1)
  // return status 204
  response.status(204).send()
})

app.listen(3000, () => {
   console.log("Listening on port 3000")
  });

// doesnt take any params.
// calculates the next ID in sequence and returns it
function getNextId() {
  // get the highest ID in the datastore
  const lastMessage = messages[messages.length - 1]
  // add 1 to it and return
  return lastMessage ? lastMessage.id + 1 : 0
}

// takes a message object the param
// if the from or text properties are missing or empty, return false
// otherwise return true
function isValidMessage(message) {
  if (message.text && message.from) {
    return true
  }
  return false
}