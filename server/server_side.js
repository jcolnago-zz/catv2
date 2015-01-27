Meteor.publish("messages", function (){
  return Messages.find({});
});

Meteor.publish("data", function () {
  return Data.find({});
});
/*Meteor.startup(function () {
	collectionApi = new CollectionAPI({ authtoken: '436174696e7468654d61704c49414a43' });
	collectionApi.addCollection(Tasks, "tasks");
	collectionApi.start();
});

Meteor.publish("tasks", function() {
	return Tasks.find({
		$or: [
			{ private: {$ne: true} },
			{ owner: this.userId }
		]
	});
});*/
