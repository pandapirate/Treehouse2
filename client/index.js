Template.body.helpers({
  selectedRoom: function() {
    if (Session.get("currentRoom") != null) {
      return true;
    }
    return false;
  },
  currentRoom: function() {
    return Session.get("currentRoom");
  },
  currentUser: function() {
    return Meteor.user() != null;
  }
})

Template.body.events = {
  "click .leaveRoom": function() {
    Session.set("currentRoom", null);
  }
}
