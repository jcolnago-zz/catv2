//Susbscribe to desired collection
messagesSubscription = Meteor.subscribe("messages");
dataSubscription = Meteor.subscribe("data");

//Set session variable carouselReady that flags the rendering of the carousel's DOM
Session.set("carouselReady", false);

//Carousel hack
var first = true;

/*---------------CAROUSEL---------------*/

//When carousel rendered, set options and flag
Template.carousel.rendered = function(){
	$('#message-area').slick({
		autoplaySpeed: 6000,
    infinite: true,
    slidesToShow: 1,
    adaptiveHeight: true,
    arrows: false,
    useCSS: false
	});
  Session.set("carouselReady", true);
}

//Helper functions used inside the carousel template
Template.carousel.helpers({
  // Returns all messages from database
	messages: function() {
    return Messages.find({});
  },
  // Adds or removes messages from the carousel according to database changes
  updateCarousel: function() {
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
        if (!first) {
          $('#message-area').slickAdd('<div name="' + this._id + '">' + this.text + ' - ' + this.author + '</div>', parseFloat(current), true);
        } 
        else {
          $('#message-area').slickAdd('<div name="' + this._id + '">' + this.text + ' - ' + this.author + '</div>');
          first = false;
        }
        current++;
      }
    }
  },
  // Starts the caousel animation
  startCarousel: function() {
    if (Session.get("carouselReady")){
      $('#message-area').slickPlay();
    }
  }
});

/*--------------MAP-------------*/

// When the map DOM is rendered, initialize google maps
Template.map.rendered = function() {
    if (! Session.get('map'))
        gmaps.initialize();
}

// Avoids reloading of map on every meteor update
Template.map.destroyed = function() {
    Session.set('map', false);
}

//Helper functions for the map template
Template.map.helpers({
  data: function () {
    return Data.find();
  },
  addMapMarker: function () {
    var icon_type = 'images/gps.svg';
    if (Session.get('map')) {
      switch(this.extra.type) {
        case 0:
          break;
        case 1:
          icon_type = 'images/photo.svg';
          break;
        case 2:
          icon_type = 'images/msg.svg';
          break;
        case 3:
          icon_type = 'images/msg_photo.svg';
          break;
        default:
          throw('[ERROR] not a valid data type');          
      }

      var marker = {
        createdAt: this.createdAt,
        lat: this.geo_lat,
        lng: this.geo_lng,
        icon: icon_type,
        data: this.extra,
      }
      gmaps.addMarker(marker);
    }
  }
});

/*--------------BODY--------------*/

// Helper functions used inside body
Template.body.helpers({
  // Check if messages have been loaded
  messagesReady: function() {
    return messagesSubscription.ready();
  },
  dataReady: function() {
    return dataSubscription.ready();
  }
});

Template.body.events({
  "click .button-sms": function(event) {
    bootbox.dialog({
      backdrop: false,
      title: "Send your message",
      message:  '<div class="row">  ' +
                  '<div class="col-md-12"> ' +
                    '<form class="form-horizontal"> ' +
                      '<div class="form-group"> ' +
                        '<label class="col-md-4 control-label" for="name">Name</label> ' +
                        '<div class="col-md-4 input"> ' +
                          '<input id="name" name="name" type="text" placeholder="Your name" class="form-control input-md"' + 
                            ' onKeyUp="$(\'#charsLeft\').text(75-$(\'#name\').val().length-$(\'#message\').val().length)"> ' +
                        '</div> ' +
                      '</div> ' +
                      '<div class="form-group"> ' +
                        '<label class="col-md-4 control-label" for="message">Message</label> ' +
                        '<div class="col-md-4 input"> ' +
                          '<textarea id="message" name="message" placeholder="Your message" class="form-control input-md"' +
                              'onKeyUp="$(\'#charsLeft\').text(75-$(\'#name\').val().length-$(\'#message\').val().length)"></textarea>'+
                        '</div>' +
                      '</div>' +
                      '<span>You still have: <span id="charsLeft">75</span> letters left.</span>' +
                    '</form>' + 
                  '</div>' + 
                '</div>',

      buttons: {
        success: {
          label: "Send",
          className: "btn-success",
          callback: function () {
            var name = $('#name').val();
            var message = $("#message").val()
            HTTP.post('addMessage', {data:{text:message, author:name}},
                     function(err, result){ if(err) alert('Your message is too long.'); });
          }
        }
      }
    });
  }
});
