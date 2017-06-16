import paho.mqtt.client as mqtt
from datetime import datetime
import sys
import json
import hashlib
import configparser
import pifacedigitalio
from threading import Timer

NUMBER_OF_INPUTS = 8
DELAY_BETWEEN_READS = 1

config = configparser.ConfigParser()
config.read("config.ini")
inputs = [None] * NUMBER_OF_INPUTS



class Input:
	resolution = 0
	lastValue = None
	lastTime = None
	
	def isNew(self, currentValue, currentTime):
		if self.lastValue == None:
			self.lastValue = currentValue
			self.lastTime = currentTime
			return True
		elif self.lastValue != currentValue:
			self.lastValue = currentValue
			self.lastTime = currentTime
			return True
		else:
			return False

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
	print("Connected to broker with result code "+str(rc))
	#hwindex = sys.argv[1]
	#state = str(sys.argv[2])
	#timestamp = datetime.now().isoformat()

	#print(topic)

	#checksum = hashlib.md5(state.encode("utf-8") + timestamp.encode("utf-8") + config["messages"]["salt"].encode("utf-8"))
	#message = json.dumps({"state": state, "timestamp": timestamp, "checksum": checksum.hexdigest()})
	#print(message)
	#client.publish(topic, message)
	#client.disconnect()

def readInputs():
	#print("Read inputs")   
	current = datetime.now()
	for i in range(0, NUMBER_OF_INPUTS - 1):
		v = pfd.input_pins[i].value             
		if(inputs[i].isNew(v, current)):
			print("Iput change: " + current.isoformat())
			print(str(i) + ": " +  str(v))
			sendData(i, v, current)
	Timer(DELAY_BETWEEN_READS, readInputs).start()


def sendData(input, dir, time):
	state = "low"
	if dir == 1:
		state = "high"
	
	timestamp = time.isoformat()
	topic = config["mqtt"]["baseTopic"] + "/tampere/datagate/" + config["messages"]["identifier"] + "/" + str(input)
	checksum = hashlib.md5(state.encode("utf-8") + timestamp.encode("utf-8") + config["messages"]["salt"].encode("utf-8"))
	message = json.dumps({"state": state, "timestamp": timestamp, "checksum": checksum.hexdigest()})
	client.publish(topic, message)


client = mqtt.Client()
client.on_connect = on_connect

print("Starting")
for i in range(0, NUMBER_OF_INPUTS - 1):
	inputs[i] = Input()


print("Connecting to broker")
client.connect(config["mqtt"]["broker"], int(config["mqtt"]["port"]), int(config["mqtt"]["timeout"]))

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.

print("Starting piface")

pfd = pifacedigitalio.PiFaceDigital()
print("piface created")

Timer(DELAY_BETWEEN_READS, readInputs).start()

client.loop_forever()

