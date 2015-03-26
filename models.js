/**
* Models
*/
Messages = new Meteor.Collection('messages');
Rooms = new Meteor.Collection('rooms');

// Join Table between user and room
UserRoom = new Meteor.Collection('user_room');
