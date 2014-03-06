if (Meteor.isServer) {
  publishCount = function(self, name, cursor, options) {
    var count = 0;
    var initializing = true;
    options = options || {}

    var handle = cursor.observeChanges({
      added: function(id) {
        count += 1;
        if (! initializing)
          self.changed('counts', name, { count: count });
      },
      removed: function(id) {
        count -= 1;
        self.changed('counts', name, { count: count });
      }
    });

    initializing = false;
    self.added('counts', name, { count: count });
    if (! options.noReady) self.ready();

    self.onStop(function() {
      handle.stop();
    });
  };
}

if (Meteor.isClient) {
  Counts = new Meteor.Collection('counts');

  Counts.get = function(name) {
    var count = Counts.findOne(name);
    return count && count.count;
  };
}