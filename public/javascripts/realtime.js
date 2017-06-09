var clients = {};
var client = mqtt.connect("mqtt://nyarlathotep.dy.fi:1884");
client.on("connect", function() {
    client.subscribe("hacklab/tampere/realtime/status/+");
    client.subscribe("$SYS/broker/bytes/received");
    client.subscribe("$SYS/broker/bytes/sent");
    client.subscribe("$SYS/broker/clients/connected");
    client.subscribe("$SYS/broker/uptime");
    client.subscribe("$SYS/broker/messages/sent");
    client.subscribe("$SYS/broker/messages/received");

    client.publish("hacklab/tampere/realtime/request/DC1");
});

client.on("message", function(topic, message) {
    var msg = message.toString();
    if(topic.indexOf("/broker") > 0) {
        parseBrokerMessages(topic, msg);
    }

    else if(topic.indexOf("realtime") > 0) {
        parseClientMessages(topic, msg);

    }

});

function parseBrokerMessages(topic, message) {
    if(topic.indexOf("bytes/received") > 0) {
        var bytes = parseInt(message);
        var receivedBytes = $(".statistics #received-bytes span.value");
        if(bytes < 1024) {
            $(receivedBytes).html(parseInt(bytes) + "B");
        } else if (bytes > 1024 && bytes < 1024 * 1024) {
            $(receivedBytes).html(Math.round(parseInt(bytes) / 1024) + "kB");
        }
        else {
            $(receivedBytes).html(Math.round(parseInt(bytes) / 1024) + "MB");
        }
    }
    else if(topic.indexOf("bytes/sent") > 0) {
        var bytes = parseInt(message);
        var receivedBytes = $(".statistics #sent-bytes span.value");
        if(bytes < 1024) {
            $(receivedBytes).html(parseInt(bytes) + "B");
        } else if (bytes > 1024 && bytes < 1024 * 1024) {
            $(receivedBytes).html(Math.round(parseInt(bytes) / 1024) + "kB");
        }
        else {
            $(receivedBytes).html(Math.round(parseInt(bytes) / 1024) + "MB");
        }
    }
    else if(topic.indexOf("uptime") > 0) {
        $(".statistics #uptime span.value").html(moment.duration(parseInt(message) * 1000).humanize());
    }
    else if(topic.indexOf("clients/connected") > 0) {
        $(".statistics #clients-connected span.value").html(parseInt(message));
    }
    else if(topic.indexOf("messages/sent") > 0) {
        $(".statistics #messages-sent span.value").html(parseInt(message));
    }
    else if(topic.indexOf("messages/received") > 0) {
        $(".statistics #messages-received span.value").html(parseInt(message));
    }
}

function parseClientMessages(topic, message) {
    var client = topic.split("/")[4];
	var jsonMessage = JSON.parse(message.toString())
    if(typeof clients[client] == "undefined") {
        clients[client] = {
            name: jsonMessage.device,
            seen: moment(jsonMessage.timestamp, "YYYY-MM-DD[T]HH:mm:ss.sss"),
            status: "OK",
            message: jsonMessage.state,
            container: null,
            durationInterval: null,
        };
        console.log(jsonMessage.timestamp);
        console.log(clients[client].seen);
        var c = $("<div></div>").addClass("underling");
        var h = $("<h1></h1>").html(clients[client].name).addClass("header");
        var m = $("<span></span>").addClass("message");
        var t = $("<span></span>").addClass("timestamp");
        var d = $("<span></span>").addClass("duration");
        var s = $("<div></div>").addClass("state").css("background-color", jsonMessage.color);
        $(m).html(clients[client].message);
        $(t).html(clients[client].seen.format("HH:mm:ss DD.MM.YYYY"));
        $(c).append(h);
        $(c).append(m);
        $(c).append(t);
        $(c).append(d);
        $(c).append(s);
        clients[client].container = c;
        clients[client].durationInterval = setInterval(function() {
            var duration = moment().diff(clients[client].seen);
            $(clients[client].container).find(".duration").html(moment.duration(duration).humanize());
        }, 1000);

        $(".underling-container").append(c);
    }
    else {
		clients[client].name = jsonMessage.device;
        clients[client].seen =  moment(jsonMessage.timestamp, "YYYY-MM-DD[T]HH:mm:ss.sss"),
        clients[client].status = "OK";
        clients[client].message = jsonMessage.state,
        $(clients[client].container).find(".header").html(clients[client].name);
        $(clients[client].container).find(".message").html(clients[client].message);
        $(clients[client].container).find(".timestamp").html(clients[client].seen.format("HH:mm:ss DD.MM.YYYY"));
        $(clients[client].container).find(".state").css("background-color", jsonMessage.color);
    }
}
