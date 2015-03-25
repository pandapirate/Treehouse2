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
    return this.owner == Meteor.user()._id;
  }
})

Template.room.events = {
  "click .selectRoom": function() {
    var name = this.name;
    Session.set("currentRoom", name);
  },
  "click .deleteRoom": function() {
    Rooms.remove({_id: this._id});
    var msgCursor = Messages.find({room: this.name})
    .forEach(function(msg){
      //console.log(msg._id);
      Messages.remove({_id:msg._id});
    });
  }
}
