import paho.mqtt.client as mqtt

MQTT_SERVER = "localhost"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("file-system/photos/did-update")

client = mqtt.Client()
client.on_connect = on_connect
client.connect(MQTT_SERVER, 1883, 60)

# If script mode, run the client here.
if __name__ == "__main__":
    client.loop_forever()

