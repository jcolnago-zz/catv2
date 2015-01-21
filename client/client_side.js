//Susbscribe to desired collection
messagesSubscription = Meteor.subscribe("messages");

//Set session variable carouselReady that flags the rendering of the carousel's DOM
Session.set("carouselReady", false);

//When carousel rendered, set options and flag
Template.carousel.rendered = function(){
  console.log('[+] Carousel rendered');
	$('#message-area').slick({
		autoplay: true,
		autoplaySpeed: 6000,
    vertical: true,
    slidesToShow: 1,
    slidesToScroll: 1
	});
  Session.set("carouselReady", true);
}

//Helper functions used inside the carousel template
Template.carousel.helpers({
  // Returns all messages from database
	messages: function() {
    console.log('[+] messages was called');
    return Messages.find({});
  },
  // Adds or removes messages from the carousel according to database changes
  updateCarousel: function() {
    console.log('[+] updateCarousel was called')
    if (Session.get("carouselReady")){
      // Checks if message is to be displayed
      if (!this.display) {
        var dbData = this;
        // Find a div that contains the message not to be presented
        $('div:contains("' + dbData.text + '")').each(function() {
          var index = this.getAttribute('index');
          if (index) {
            // Check if carousel message is not the cloned div
            // and if it matches the message to be removed
            if(this.getAttribute('class').indexOf('cloned') < 0 && 
                this.getAttribute('name') == dbData._id) {
              console.log('[dbug] Removing index ' + index);
              $('#message-area').slickRemove(index);
            }
          }
        });
      }
      else {
        // If message is available, add before current slide
        // so that if the message had just appear, it will show again
        var current = $('#message-area').slickCurrentSlide();
        if (current != 0) {
          //console.log('[dbug] (not first) Adding message (' + parseInt(current-1) + ')');
          $('#message-area').slickAdd('<div name="' + this._id + '">' + this.text + 
            '</div>', parseFloat(current-1));
          current++;
        }
        else {
          //console.log('[dbug] (first) Adding message');
          $('#message-area').slickAdd('<div name="' + this._id + '">'+this.text+'</div>');
          current++;
        }
      }
    }
  },
  // Starts the caousel animation
  startCarousel: function() {
    console.log('[+] startCarousel was called');
    if (Session.get("carouselReady")){
      $('#message-area').slickPlay();
    }
  }
});

// When the map DOM is rendered, initialize google maps
Template.map.rendered = function() {
    if (! Session.get('map'))
        gmaps.initialize();
}

// Avoids reloading of map on every meteor update
Template.map.destroyed = function() {
    Session.set('map', false);
}

// Helper functions used inside body
Template.body.helpers({
  // Check if messages have been loaded
  messagesReady: function() {
    return messagesSubscription.ready();
  }  
});
/* Meteor.subscribe("tasks");

  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  
  Template.body.events({
    "submit .new-task": function (event) {
       // This function is called when the new task form is submitted
       
       var text = event.target.text.value;

       Meteor.call("addTask", text);

       //Clear form
       event.target.text.value = "";

       //prevent defaut form submit
       return false;
    },
    "change .hide-completed input": function (event) {
       Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      //Set the checked proerty to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
			
  });

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    } 
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });*/
