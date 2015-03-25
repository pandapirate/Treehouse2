Template.rooms.helpers({
  chatrooms: function() {
    return Rooms.find({}, {sort: {name: 1}});
  }
})


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
