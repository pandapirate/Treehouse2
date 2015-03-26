Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      var name = "Squirrel";
      if (Meteor.user()) {
        if (Meteor.user().hasOwnProperty('username')) {
          name = Meteor.user().username;
        } else {
          name = Meteor.user().profile.name;
        }
      }
      var message = document.getElementById('message');

      if (message.value != '') {
        var id = Messages.insert({
          name: name,
          message: message.value,
          time: Date.now(),
          room: Session.get("currentRoom"),
          topLevel: Session.get("responseID") == null,
          children: []
        });

        if (Session.get("responseID")) {
          Messages.update({_id:Session.get("responseID")}, {$push: {"children": id}});
        }

        document.getElementById('message').value = '';
        message.value = '';
      }
    }
  },
  "click .hideAll": function() {
    var msgs = Messages.find({room: Session.get("currentRoom")}).forEach(function(msg) {
      Messages.update({_id:msg._id}, {$set: {hideChildren: true}});
    })
  },
  "click .openAll": function() {
    var msgs = Messages.find({room: Session.get("currentRoom")}).forEach(function(msg) {
      Messages.update({_id:msg._id}, {$set: {hideChildren: false}});
    })
  }
}
