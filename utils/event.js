
class Event {

  constructor() {
    if (!Event.instance) {
      Event.events = {};
      Event.instance = this;
    }
    return Event.instance; 
  }

  static getInstance(){
    return new Event();
  }

  addListener(name, self, callback) {
    let tuple = [self, callback];
    let callbacks = Event.events[name];
    if (Array.isArray(callbacks)) {
      callbacks.push(tuple);
    } else {
      Event.events[name] = [tuple];
    }
  }

  removeListener(name, self) {
    var callbacks = events[name];
    if (Array.isArray(callbacks)) {
      Event.events[name] = callbacks.filter((tuple) => {
        return tuple[0] != self;
      })
    }
  }

  emit(name, data) {
    var callbacks = Event.events[name];
    if (Array.isArray(callbacks)) {
      callbacks.map((tuple) => {
        var self = tuple[0];
        var callback = tuple[1];
        callback.call(self, data);
      })
    }
  }

}

module.exports = Event;