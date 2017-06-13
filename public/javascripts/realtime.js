var clients = {};
var client = mqtt.connect(mqttAddress);
client.on("connect", function() {
    client.subscribe("hacklab/tampere/realtime/status/+");
    client.publish("hacklab/tampere/realtime/request/DC1");
});

$(window).focus(function() {
    client.publish("hacklab/tampere/realtime/request/DC1");
});

$(window).on("unload", function() {
    client.end();
});
client.on("message", function(topic, message) {
    var msg = message.toString();
    if(topic.indexOf("realtime") > 0) {
        parseClientMessages(topic, msg);
    }
});

function parseClientMessages(topic, message) {
    var identifier = topic.split("/")[4];
	var jsonMessage = JSON.parse(message.toString())
    if(typeof clients[identifier] == "undefined") {
        clients[identifier] = new Underling({
            container: ".underling-container",
            seen: jsonMessage.timestamp,
            name: jsonMessage.device,
            state: jsonMessage.state,
            identifier: identifier,
            color: jsonMessage.color
        });

    }
    else {
        clients[identifier].refresh({
            seen: jsonMessage.timestamp,
            name: jsonMessage.device,
            state: jsonMessage.state,
            color: jsonMessage.color
        });
        clients[identifier].update();
    }
}
