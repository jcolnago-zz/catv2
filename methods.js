Meteor.methods({
  addMessage: function (text, date) {
    Messages.insert({
      createdAt: date,
      text: text,
      display: true
    });
  },
  deleteText: function (id) {
    Messages.update({_id: id}, {$set: {display: false}});
  },
  cleanMessages: function () {
    // clean items
    Messages.find().fetch().forEach(function(item){
      Messages.remove({_id: item._id});
    });
  }
/* addTask: function (text) {
    //Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),  //current time
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
		var task = Tasks.findOne(taskId);
		if (task.private && task.owner !== Meteor.userId()) {
			// If the task is private, make sure only the owner can delete it
			throw new Meteor.Error("not-authorized");
		}
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
		var task = Tasks.findOne(taskId);
		if (task.private && task.owner !== Meteor.userId()) {
			// If the task is private, make sure only the owner can check it off
			throw new Meteor.Error("not-authorized");
		}
    Tasks.update(taskId, { $set: { checked: setChecked }});
  },
  setPrivate: function (taskId, setToPrivate) {
		var task = Tasks.findOne(taskId);

		//Make sure only the task owner can make a task private
		if (task.owner !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Tasks.update(taskId, { $set: { private: setToPrivate } });
	}*/
})

