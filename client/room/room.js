Template.rooms.helpers({
  chatrooms: function() {
    return Rooms.find({}, {sort: {name: 1}});
  }
})


Template.createRoom.events = {
  "click .createRoomButton": function() {
    var newRoomName = prompt("Enter name of new chat room");
    while (newRoomName == "" || newRoomName == null) {
      newRoomName = prompt("Room name must have at least 1 character. Enter name of new chat room");
    }

    Rooms.insert({
      name: newRoomName,
      owner: Meteor.user()._id
    });
  }
}

Template.room.helpers({
  canDelete: function() {
    if (Meteor.user() != null) {
      return this.owner == Meteor.user()._id;
    }
    return false;
  }
})

Template.room.events = {
  "click .selectRoom": function() {
    var name = this.name;
    Session.set("currentRoom", name);
    UserRoom.insert({
      userID: Meteor.user()._id,
      roomID: this._id
    });
  },
  "click .deleteRoom": function() {
    Rooms.remove({_id: this._id});
    Messages.find({room: this.name})
    .forEach(function(msg){
      //console.log(msg._id);
      Messages.remove({_id:msg._id});
    });

    UserRoom.find({roomID: this._id})
    .forEach(function(usrRm) {
      UserRoom.remove({_id:usrRm._id});
    });
  }
}

Template.roomDisplay.helpers({
  currentRoom: function() {
    return Session.get("currentRoom");
  },
  usersInRoom: function() {
    if (Session.get("currentRoom") == null) return [];
    var room = Rooms.findOne({name: Session.get("currentRoom")});
    var idList = [];
    UserRoom.find({roomID: room._id})
    .forEach(function(rm) {
      idList.push(rm.userID)
    });
    return Meteor.users.find({_id: {$in: idList}});
  }
})

Template.roomDisplay.events = {
  "click .leaveRoom": function() {
    var room = Rooms.findOne({name: Session.get("currentRoom")})
    var usrRm = UserRoom.findOne({roomID: room._id});
    UserRoom.remove({_id: usrRm._id})
    Session.set("currentRoom", null);
  }
}

Template.userRoomDisplay.helpers({
  userName: function() {
    if (this.hasOwnProperty('username')) {
      return this.username;
    } else {
      return this.profile.name;
    }
  },
  canKick: function() {
    return this._id != Meteor.user()._id;
  }
})
