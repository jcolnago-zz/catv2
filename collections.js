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

/*
  Data collection
  datum = {
    _id: unique identifier
    createdAt: date the data was created
    geo_lat: latitute
    geo_lng: longitude
    extra: {
      type: type of data [0: only gps, 1: photo]
      path: path to the extra data file
    }
  }
*/
Data = new Mongo.Collection("data");
