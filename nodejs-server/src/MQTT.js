var mqtt = require('mqtt')

/**
 * Manage storing files.
 */
module.exports = class FileStoreManager {
  #client;
  #subscriptions = {};

  constructor(host) {
    this.host = host
    this.#client = mqtt.connect(`mqtt:${host}`)
  
    this.#client.on('connect', function () {
        console.log("did connect")
        client.publish(mqttTopic, 'New images stored!')
    });

    const self = this
    this.#client.on('message', function (topic, message) {
        console.log("did get message")
        self.handleMessage(topic, message)
    })
  }

  publish(message, topic) {
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

  handleMessage(topic, message) {
    const subscriptions = this.#subscriptions[topic]
    if (subscriptions === undefined) {
      return;
    }

    if (!Array.isArray(subscriptions)) {
      delete this.#subscriptions[topic]
      return;
    }

    for (subscription in subscriptions) {
      subscription(message)
    }
  }
}