Template.body.helpers({
  selectedRoom: function() {
    if (Session.get("currentRoom") != null) {
      return true;
    }
    return false;
  },
  currentRoom: function() {
    return Session.get("currentRoom");
  }
})

Template.body.events = {
  "click .leaveRoom": function() {
    Session.set("currentRoom", null);
  }
}

Template.messages.helpers({
  parentMessages: function() {
    return Messages.find({room: Session.get("currentRoom"), topLevel: true}, { sort: { time: 1}});
  }
})

Template.msg.helpers({
  children: function() {
    var ids = Messages.findOne({_id:this._id}).children;
    return Messages.find({_id: {$in: ids}});
  },
  hasChildren: function() {
    if (this.hideChildren) return false;
    return Messages.findOne({_id:this._id}).children.length > 0;
  },
  hasResponse: function() {
    return Session.get("responseID") == this._id;
  }
})

Template.msg.events({
  "click .response": function() {
    //console.log(this._id + " " + this.message);
    Session.set("responseID", this._id);
  },
  'keydown #ResponseMessage' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      var message = document.getElementById('ResponseMessage');
      if (message.value != '') {
        var name = "Squirrel";
        if (Meteor.user()) {
          name = Meteor.user().profile.name;
        }

        var id = Messages.insert({
          name: name,
          message: message.value,
          time: Date.now(),
          room: Session.get("currentRoom"),
          topLevel: false,
          children: [],
          hideChildren: false
        });

        if (Session.get("responseID")) {
          Messages.update({_id:this._id}, {$push: {"children": id}});
          Messages.update({_id:this._id}, {$set: {hideChildren: false}});
        }
        Session.set("responseID", null);
      }
    }
  },
  "click #ResponseButton": function() {
    var message = document.getElementById('ResponseMessage');
    if (message.value != '') {
      var name = "Squirrel";
      if (Meteor.user()) {
        name = Meteor.user().profile.name;
      }

      var id = Messages.insert({
        name: name,
        message: message.value,
        time: Date.now(),
        room: Session.get("currentRoom"),
        topLevel: false,
        children: [],
        hideChildren: false
      });

      if (Session.get("responseID")) {
        Messages.update({_id:this._id}, {$push: {"children": id}});
        Messages.update({_id:this._id}, {$set: {hideChildren: false}});
      }
      Session.set("responseID", null);
    }
  },
  "click .toggle": function() {
    if (Session.get("ToggleID") == this._id) return;

    Messages.update({_id:this._id}, {$set:{hideChildren:!this.hideChildren}});
    Session.set("responseID", null);
    Session.set("ToggleID", this._id);
    Meteor.setTimeout(function(){Session.set("ToggleID", null);}, 500);
  }
})

Template.rooms.helpers({
  chatrooms: function() {
    return Rooms.find({}, {sort: {name: 1}});
  }
})

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      var name = "Squirrel";
      if (Meteor.user()) {
        name = Meteor.user().profile.name;
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
    Messages.update({room: Session.get("currentRoom")}, {$set: {hideChildren: true}});
  },
  "click .openAll": function() {
    Messages.update({room: Session.get("currentRoom")}, {$set: {hideChildren: false}});
  }
}

Template.createRoom.events = {
  "click .createRoomButton": function() {
    var newRoomName = prompt("Enter name of new chat room");
    while (newRoomName == "") {
      newRoomName = prompt("Room name must have at least 1 character. Enter name of new chat room");
    }

    Rooms.insert({
      name: newRoomName
    });
  }
}

Template.room.events = {
  "click .selectRoom": function() {
    var name = this.name;
    Session.set("currentRoom", name);
  }
}
