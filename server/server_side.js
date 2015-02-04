Meteor.publish("messages", function (){
  return Messages.find({});
});

Meteor.publish("data", function () {
  return Data.find({});
});

//Message queue
var mq = [];

var auth = '436174696e7468654d61704c49414a43';

HTTP.methods({
  //No authentication: called from client side
  'addMessage': function(data) {
    message = data.text + ' - ' + data.author;
    if (message.length <= 78){
      mq.push(message);
      Messages.insert({
        createdAt: new Date(),
        text: data.text,
        author: data.author,
        display: true
      });
    }
    this.setStatusCode(400);
  },
  'deleteText': function(data) {
    if (auth == data.auth) {
      Messages.update({_id: id}, {$set: {display: false}});    
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
  },
  'addDatum': function(data) {
    if (auth == data.auth) {
      if(mq.length > 0) {
        data.extra.messages = mq;
        mq = [];
        switch(data.extra.type) {
          case 0:
            data.extra.type = 2;
            break;
          case 1:
            data.extra.type = 3;
            break;
          default:
            this.setStatusCode(400);
            return 'Invalid data type';
        }
      }
    
      Data.insert({
        createdAt: new Date(),
        geo_lat: data.lat,
        geo_lng: data.lng,
        extra: data.extra
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
  },
  // Clean DB functions
  'cleanData': function(data) {
    if (auth == data.auth) {
      Data.find().fetch().forEach(function(item){
        Data.remove({_id: item._id});
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
    
  },
  'cleanMessages': function(data) {
    if (auth == data.auth) {
      Messages.find().fetch().forEach(function(item){
        Messages.remove({_id: item._id});
      });
    } else {
      this.setStatusCode(401);
      return 'Unauthorized';
    }
  } 
});

