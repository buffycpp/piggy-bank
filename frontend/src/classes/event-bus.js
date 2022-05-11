//Used to define application wide events that can be broadcasted and listened to from anywhere
export default class EventBus {
  static DEBUG = true;

  static CHANNELS = {
    Debug: 'Debug',
    Global: 'Global',
  };

  static eventHandlers = {};

  static broadcast(channel, event, payload = {}) {
    if (this.CHANNELS[channel] === undefined) {
      throw new Error(`Unknown Channel for Broadcast on ${channel}/${event}`);
    }

    if (this.eventHandlers[channel] !== undefined && this.eventHandlers[channel][event] !== undefined) {
      for (let ref in this.eventHandlers[channel][event].handlers) {
        this.eventHandlers[channel][event].handlers[ref](payload);

        if (this.DEBUG) {
          console.log(`Broadcasted ${channel}/${event} to Subscriber:${ref} with payload as:`, payload);
        }
      }
    }
  }

  static subscribe(channel, event, handler) {
    if (this.eventHandlers[channel] === undefined) {
      this.eventHandlers[channel] = {};
    }

    if (this.eventHandlers[channel][event] === undefined) {
      this.eventHandlers[channel][event] = {
        nextRef: 0,
        handlers: {}
      };
    }

    const nextRef = this.eventHandlers[channel][event].nextRef;

    this.eventHandlers[channel][event].handlers[nextRef] = handler;
    this.eventHandlers[channel][event].nextRef = nextRef + 1;

    console.log(`Subscribed Subscriber:${nextRef} to ${channel}/${event}`);

    return {
      channel,
      event,
      ref: nextRef,
      unsubscribe() {
        EventBus.unsubscribe(this.channel, this.event, this.ref);
      }
    }
  }

  static unsubscribe(channel, event, ref) {
    if (this.DEBUG) {
      console.log(`Unsubscribed Subscriber:${ref} from ${channel}/${event}`);
    }

    delete this.eventHandlers[channel][event].handlers[ref];
  }
}