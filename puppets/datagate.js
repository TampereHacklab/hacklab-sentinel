var models = require('../models');
var mqtt = require("mqtt");
var md5 = require("md5");
var moment = require("moment");

var DataGate = function() {};
DataGate.prototype.initialize = function(options) {
    var client = mqtt.connect(options.broker, {
        connectTimeout: 10 * 1000,
        keepAlive: 120,
        clientId: "sentinel_js_mqqt_server"
    });
    client.on("connect", function() {
        client.subscribe(options.baseTopic + "/tampere/datagate/#");
        client.subscribe(options.baseTopic + "/tampere/realtime/request/+");
    });

    client.on("message", function(topic, message) {
        console.log("ON MESSAGE");
        console.log(topic);

        if(topic.indexOf("datagate") > 0) {
            handleDatagate({
                topic: topic,
                message: message
            });
        }
        else if(topic.indexOf("realtime") > 0) {
            handleRealtime({
                topic: topic,
                message: message
            });
        }
    });

    function handleRealtime(data) {
        var dc = data.topic.split("/")[4];
        models.DataCollector.findOne({
            where: [
                {
                    identifier: dc,
                }
            ],
            include: [ {
                model: models.Input,
                as: "inputs",
                include: [
                    {
                        model: models.Device,
                        as: "device"
                    }
                ],
                where: {
                    enabled: true
                }
            }
            ]
        }).then(function(dataCollector) {
            for(var i = 0; i < dataCollector.inputs.length; i++) {
                var d = dataCollector.inputs[i].device;
                (function(device) {
                    models.StateData.findOne({
                        where: [
                            {
                                device_id: device.id,
                                duration: {
                                    $eq: null
                                }
                            }
                        ],
                    include: [{
                        model: models.State,
                        as: "state"
                    }]
                    }).then(function(latest) {
                        if(latest == null) {
                            transmitRealtime({
                                device: device.name,
                                machineName: device.machineName,
                                timestamp: moment().format("YYYY-MM-DD[T]HH:mm:ss.sss"),
                                state: "Poissa päältä",
                                color: "#ff0000",
                                image: device.image,
                            });
                        }
                        else {
                            transmitRealtime({
                                device: device.name,
                                machineName: device.machineName,
                                timestamp: latest.start,
                                state: latest.state.name,
                                color: latest.state.color,
                                image: device.image,
                            });
                        }

                    });
                })(d);

            }
        });
    }

    function handleDatagate(data) {
        var splitTopic = data.topic.split("/");
        var payload = JSON.parse(data.message.toString());
        if(typeof payload.checksum == "undefined" || payload.checksum != md5(payload.state + payload.timestamp + options.checksumSalt)) {
            console.log("INVALID CHECKSUM");
            return;
        }
        payload.timestamp = new Date(payload.timestamp);
        var identifier = splitTopic[3];
        var input = parseInt(splitTopic[4]);

        models.Input.findOne({
            attributes: ["id"],
            where: {
                index: input,
                enabled: true
            },
            include: [{
                model: models.Device,
                as: "device"
            },
            {
                model: models.DataCollector,
                as: "dataCollector",
                where: {
                    identifier: identifier
                }
            },
            {
                model: models.State,
                as: "highState"
            },
            {
                model: models.State,
                as: "lowState"
            }]
            }).then(function(input) {
                if(input) {
                    console.log("FOUND INPUT");
                    var s = {
                        device: input.device,
                        state: payload.state === "high" ? input.highState : input.lowState
                    };
                    models.StateData.findOne({
                        where: {
                            duration: {
                                $eq: null
                            },
                            device_id: input.device.id,
                        },
                        include: [{
                            model: models.State,
                            as: "state"
                        }]
                    }).then(function(previous) {
                        if(previous) {
                            console.log("FOUND PREVIOUS");
                            if(previous.state.id == s.state.id) {
                                console.log("SAME STATE");
                                return;
                            }
                            else if(previous.start >= payload.timestamp) {
                                console.log("OLD DATA");
                                return;
                            }
                            models.StateData.update({
                                end: payload.timestamp,
                                duration: parseInt(Math.abs(payload.timestamp - previous.start) / 1000)
                            }, {
                                where: {
                                    id: previous.id
                                }
                            }).then(function() {
                                models.StateData.create({
                                    start: payload.timestamp,
                                    end: null,
                                    duration: null,
                                    state_id: s.state.id,
                                    device_id: s.device.id
                                }).then(function(current) {
                                    transmitRealtime({
                                        device: s.device.name,
                                        machineName: s.device.machineName,
                                        timestamp: current.start,
                                        state: s.state.name,
                                        color: s.state.color
                                    });
                                });
                            })
                        }
                        else {
                            console.log("EMPTY DB");
                            models.StateData.create({
                                start: payload.timestamp,
                                end: null,
                                duration: null,
                                state_id: s.state.id,
                                device_id: s.device.id
                            }).then(function(current) {
                                transmitRealtime({
                                    device: s.device.name,
                                    machineName: s.device.machineName,
                                    timestamp: current.start,
                                    state: s.state.name,
                                    color: s.state.color
                                });
                            });
                        }
                    });
                }
            });
        }


    function transmitRealtime(data) {
        client.publish(options.baseTopic + "/tampere/realtime/status/" + data.machineName, JSON.stringify({
            device: data.device,
            identifier: data.machineName,
            timestamp: data.timestamp,
            state: data.state,
            color: data.color,
            image: data.image
        }));
    }

};

module.exports = new DataGate();
