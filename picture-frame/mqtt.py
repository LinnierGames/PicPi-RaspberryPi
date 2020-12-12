import paho.mqtt.client as mqtt
 
MQTT_SERVER = "localhost"
 
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("file-system/photos/did-update")
 
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
 
client.connect(MQTT_SERVER, 1883, 60)
# def start():
#   client.connect(MQTT_SERVER, 1883, 60)
#   client.loop_start()

# If script mode, run the client here.
if __name__ == "__main__":
    client.loop_forever()

