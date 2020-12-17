import paho.mqtt.client as mqtt

MQTT_SERVER = "localhost"

client = mqtt.Client()

# If script mode, run the client here.
if __name__ == "__main__":
    def on_connect(client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        client.subscribe("test_channel")

    def on_message(client, userdata, msg):
        print("message received "+str(msg.topic))

    client.on_message = on_connect
    client.on_connect = on_message
    client.connect(MQTT_SERVER, 1883, 60)

    client.loop_forever()
else:
    client.connect(MQTT_SERVER, 1883, 60)
