import paho.mqtt.publish as publish
 
MQTT_SERVER = "localhost"
MQTT_PATH = "test_channel"
 
publish.single(MQTT_PATH, "This is a response from Raspberry Pi", hostname=MQTT_SERVER)

