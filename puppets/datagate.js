var models = require('../models');
var mqtt = require("mqtt");
var DataGate = function() {};
DataGate.prototype.initialize = function(options) {
    var client = mqtt.connect(options.address);

    client.on("connect", function() {
        client.subscribe("hacklab/tampere/datagate/#");
        client.subscribe("hacklab/tampere/realtime/request/+");
    });

    client.on("message", function(topic, message) {
        console.log("ON MESSAGE");
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
                    identifier: dc
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
                ]
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
                        transmitRealtime({
                            device: device.name,
                            machineName: device.machineName,
                            timestamp: latest.start,
                            state: latest.state.name,
                            color: latest.state.color
                        });
                    });
                })(d);

            }
        });
    }

    function handleDatagate(data) {
        var splitTopic = data.topic.split("/");
        var payload = JSON.parse(data.message.toString());
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
        client.publish("hacklab/tampere/realtime/status/" + data.machineName, JSON.stringify({
            device: data.device,
            timestamp: data.timestamp,
            state: data.state,
            color: data.color
        }));
    }

};

module.exports = new DataGate();
