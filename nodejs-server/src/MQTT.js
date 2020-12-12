var mqtt = require('mqtt')

/**
 * Manage storing files.
 */
module.exports = class FileStoreManager {
  #client;
  #subscriptions = {};
  #pendingMessages = [];

  constructor(host) {
    this.host = host
    this.#client = mqtt.connect(`mqtt:${host}`)
  
    const self = this;
    this.#client.on('connect', function () {
        console.log("did connect")
        self.publishPendingMessages();
    });
    this.#client.on('message', function (topic, message) {
        console.log("did get message")
        self.handleMessage(topic, message)
    })
  }

  publish(message, topic) {
    if (this.#client.connected == false) {
      console.log("pending message")
      this.#pendingMessages.push({ message: message, topic: topic })
      return
    }

    console.log(`message sent: ${topic}, ${message}`)
    this.#client.publish(topic, message)
  }

  subscribe(topic, callback) {
    const self = this
    this.#client.subscribe(topic, function (err) {
      if (err) {
        console.log("failed to subscribe")
        return
      }

      if (self.#subscriptions[topic] === undefined) {
        self.#subscriptions[topic] = [callback]
      } else {
        self.#subscriptions[topic].push(callback)
      }
    })
  }

  publishPendingMessages() {
    const messages = this.#pendingMessages
    if (messages === []) {
      return
    }

    var message;
    for (message of messages) {
      this.publish(message.message, message.topic)
    }

    this.#pendingMessages = []
  }

  handleMessage(topic, message) {
    const subscriptions = this.#subscriptions[topic]
    if (subscriptions === undefined) {
      return;
    }

    if (!Array.isArray(subscriptions)) {
      delete this.#subscriptions[topic]
      return;
    }

    var subscription;
    for (subscription of subscriptions) {
      subscription(message)
    }
  }
}