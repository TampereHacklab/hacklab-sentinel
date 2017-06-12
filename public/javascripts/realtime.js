var clients = {};
var client = mqtt.connect(mqttAddress);
client.on("connect", function() {
    client.subscribe("hacklab/tampere/realtime/status/+");
    client.publish("hacklab/tampere/realtime/request/DC1");
});

client.on("message", function(topic, message) {
    var msg = message.toString();
    if(topic.indexOf("realtime") > 0) {
        parseClientMessages(topic, msg);
    }
});

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

        var c = $("<div></div>").addClass("underling");
        var hw = $("<div></div>").addClass("header-wrapper").css("background-color", jsonMessage.color);
        var h = $("<h1></h1>").html(clients[client].name).addClass("header").css("color", isColorLight(jsonMessage.color) ? "black" : "white");
        var cw = $("<div></div>").addClass("content-wrapper");
        var m = $("<span></span>").addClass("message");
        var t = $("<span></span>").addClass("timestamp");
        var d = $("<span></span>").addClass("duration");
        $(m).html(clients[client].message);
        $(t).html(clients[client].seen.format("HH:mm:ss DD.MM.YYYY"));
        $(hw).append(h);
        $(c).append(hw);

        $(cw).append(m);
        $(cw).append(t);
        $(cw).append(d);
        $(c).append(cw);
        clients[client].container = c;
        var duration = moment().diff(clients[client].seen);
        $(clients[client].container).find(".duration").html(moment.duration(duration).humanize());
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
        $(clients[client].container).find(".header-wrapper").css("background-color", jsonMessage.color);
        $(clients[client].container).find(".header").html(clients[client].name).css("color", isColorLight(jsonMessage.color) ? "black" : "white");
        $(clients[client].container).find(".message").html(clients[client].message);
        $(clients[client].container).find(".timestamp").html(clients[client].seen.format("HH:mm:ss DD.MM.YYYY"));
        $(clients[client].container).find(".state").css("background-color", jsonMessage.color);
    }
}

//https://codepen.io/anon/pen/vZLReL
function isColorLight(hex) {
    var rgb = hexToRgb(hex);
    var a = 1 - (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return (a < 0.5);
}

//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
