Template.body.helpers({
  selectedRoom: function() {
    if (Session.get("currentRoom") != null) {
      return true;
    }
    return false;
  },
  currentUser: function() {
    return Meteor.user() != null;
  }
})


Template.welcome.helpers({
  currentUserName: function() {
    if (Meteor.user().hasOwnProperty('username')) {
      return Meteor.user().username;
    } else {
      return Meteor.user().profile.name;
    }
  }
})

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
