import paho.mqtt.client as mqtt
from datetime import datetime
import sys
import json
import hashlib
import configparser
#import pifacedigitalio

config = configparser.ConfigParser()
config.read("config.ini")
def input_change(event):
	print(event)
	state = "low"
	if event.direction == 1:
		state = "high"
	topic = config["mqtt"]["baseTopic"] + "/tampere/datagate/" + config["messages"]["identifier"] + "/" + str(event.pin_num)
	timestamp = datetime.now().isoform
	checksum = hashlib.md5(state.encode("utf-8") + timestamp.encode("utf-8") + config["messages"]["salt"].encode("utf-8"))
	message = json.dumps({"state": state, "timestamp": timestamp, "checksum": checksum.hexdigest()})
	client.publish(topic, message)

def on_connect(client, userdata, flags, rc):
	print("Connected with result code "+str(rc))
	hwindex = sys.argv[1]
	state = str(sys.argv[2])
	timestamp = datetime.now().isoformat()
	topic = config["mqtt"]["baseTopic"] + "/tampere/datagate/" + config["messages"]["identifier"] + "/" + str(hwindex)

	print(topic)

	checksum = hashlib.md5(state.encode("utf-8") + timestamp.encode("utf-8") + config["messages"]["salt"].encode("utf-8"))
	message = json.dumps({"state": state, "timestamp": timestamp, "checksum": checksum.hexdigest()})
	print(message)
	client.publish(topic, message)
	client.disconnect()

client = mqtt.Client()
client.on_connect = on_connect

print("Starting")
print(config["mqtt"]["broker"])
client.connect(config["mqtt"]["broker"], int(config["mqtt"]["port"]), int(config["mqtt"]["timeout"]))

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.


'''
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
'''
client.loop_forever()
