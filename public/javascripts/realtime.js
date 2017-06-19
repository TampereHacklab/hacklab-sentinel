loader.show();
var clients = {};
var client = mqtt.connect(config.broker, {
    clientId: "sentinel_js_mqqt_client"
});
client.on("connect", function(connack) {
    if(connack.sessionPresent == false) {
        client.subscribe(config.baseTopic + "/tampere/realtime/status/+");
        client.publish(config.baseTopic + "/tampere/realtime/request/DC1");
    }
    loader.hide();

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
	var jsonMessage = JSON.parse(message.toString());
    if(typeof clients[identifier] == "undefined") {
        clients[identifier] = new Underling({
            container: ".underling-container",
            seen: jsonMessage.timestamp,
            name: jsonMessage.device,
            state: jsonMessage.state,
            identifier: identifier,
            color: jsonMessage.color,
            image: jsonMessage.image,
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
