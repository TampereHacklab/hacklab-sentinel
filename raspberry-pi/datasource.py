import paho.mqtt.client as mqtt
from datetime import datetime
import sys
import json
import hashlib

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    datacollector = sys.argv[1]
    hwindex = sys.argv[2]
    state = str(sys.argv[3])
    timestamp = datetime.now().isoformat()

    checksum = hashlib.md5(state.encode("utf-8") + timestamp.encode("utf-8") + "hacklab tampere".encode("utf-8")).hexdigest()
    topic = "hacklab/tampere/datagate/" + datacollector + "/" + hwindex
    message = json.dumps({"state": state, "timestamp": timestamp, "checksum": checksum})
    print(topic)
    print(message)
    client.publish(topic, message)
    client.disconnect()

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

client = mqtt.Client()
client.on_connect = on_connect


client.connect("nyarlathotep.dy.fi", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
