/*
  Messages collection
  message = {
    _id: unique identifier
    createdAt: date the message was created
    text: message's text
    author: message's author
    display: if message should be displayed
  }
*/
Messages = new Mongo.Collection("messages");  
