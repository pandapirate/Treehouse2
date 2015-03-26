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
    return this.children.length > 0;
  },
  hasResponse: function() {
    return Session.get("responseID") == this._id;
  },
  showChildren: function() {
    return !this.hideChildren;
  },
  listClass: function() {
    if (this.children.length == 0) return "fa-plus hidden"
    else {
      if (this.hideChildren) return "fa-plus";
      else return "fa-minus";
    }
  }
})

Template.msg.events({
  "click .response": function() {
    //console.log(this._id + " " + this.message);
    Session.set("responseID", this._id);
    Meteor.setTimeout(function(){document.getElementById('ResponseMessage').focus();}, 200);
  },
  'keydown #ResponseMessage' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      var message = document.getElementById('ResponseMessage');
      if (message.value != '') {
        var name = "Squirrel";
        if (Meteor.user()) {
          if (Meteor.user().hasOwnProperty('username')) {
            name = Meteor.user().username;
          } else {
            name = Meteor.user().profile.name;
          }
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
        if (Meteor.user().hasOwnProperty('username')) {
          name = Meteor.user().username;
        } else {
          name = Meteor.user().profile.name;
        }
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
