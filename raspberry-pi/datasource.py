import paho.mqtt.client as mqtt
from datetime import datetime
import sys
import json
import hashlib
import configparser
import pifacedigitalio

def input_change(event):
	print(event)
	state = "low"
	if event.direction == 1:
		state = "high"
	topic = "hacklab/tampere/datagate/DC1/" + str(event.pin_num)
	timestamp = datetime.now().isoformat()
	checksum = hashlib.md5(state.encode("utf-8") + timestamp.encode("utf-8") + "hacklab tampere".encode("utf-8"))
	message = json.dumps({"state": state, "timestamp": timestamp, "checksum": checksum})
	client.publish(topic, message) 

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    #datacollector = sys.argv[1]
    #hwindex = sys.argv[2]
    #state = str(sys.argv[3])
    #timestamp = datetime.now().isoformat()

    #checksum = hashlib.md5(state.encode("utf-8") + timestamp.encode("utf-8") + "hacklab tampere".encode("utf-8")).hexdigest()
    #topic = "hacklab/tampere/datagate/" + datacollector + "/" + hwindex
    #message = json.dumps({"state": state, "timestamp": timestamp, "checksum": checksum})
    #print(topic)
    #print(message)
    #client.publish(topic, message)
    


client = mqtt.Client()
client.on_connect = on_connect

print("Starting")
client.connect("nyarlathotep.dy.fi",1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.

#client.loop_forever()

pfd = pifacedigitalio.PiFaceDigital()
print("piface created")
print(pfd.input_pins[0].value)
print(pfd.input_pins[1].value)
print(pfd.input_pins[2].value)
print(pfd.input_pins[3].value)
print(pfd.input_pins[4].value)
print(pfd.input_pins[5].value)
print(pfd.input_pins[6].value)
print(pfd.input_pins[7].value)
listener = pifacedigitalio.InputEventListener(chip=pfd)
for i in range(0, 8):
	listener.register(i, pifacedigitalio.IODIR_FALLING_EDGE, input_change)
	listener.register(i, pifacedigitalio.IODIR_RISING_EDGE, input_change)

listener.activate()

client.loop_forever()
