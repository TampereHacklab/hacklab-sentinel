function Underling(options) {
    var that = this;
    this.refresh = function(options) {
        that.identifier = options.identifier;
        that.name = options.name;
        that.seen = moment(options.seen, "YYYY-MM-DD[T]HH:mm:ss.sss");
        that.state = options.state;
        that.color = options.color;
        if(typeof options.image != "undefined") {
            that.image = options.image;
            console.log("GOT IMAGE");
        }
    };

    this.update = function() {
        that.elements.headerWrapper.css("background-color", that.color);
        that.elements.header.html(this.name).css("color", utilities.isColorLight(that.color) ? "black" : "white");
        that.elements.content.html(this.state).css("color", utilities.isColorLight(that.color) ? "black" : "white");
        that.elements.timestamp.html(this.seen.format("HH:mm:ss DD.MM.YYYY"));
    };

    this.updateDuration = function() {
        var duration = Math.round(moment().diff(that.seen) / 1000);
        that.elements.duration.html(utilities.toDurationStr(duration));
    };

    this.refresh(options);

    this.elements = {};
    this.elements.container =  $("<div></div>").addClass("underling");
    this.elements.headerWrapper = $("<div></div>").addClass("header-wrapper");
    this.elements.header = $("<h1></h1>").addClass("header");
    this.elements.contentWrapper = $("<div></div>").addClass("content-wrapper");
    this.elements.content = $("<div></div>").addClass("content");
    this.elements.timestamp = $("<div></div>").addClass("timestamp");
    this.elements.duration = $("<div></div>").addClass("duration");
    this.elements.image = $("<img>").addClass("img-circle").addClass("image").attr("src", this.image);

    this.elements.headerWrapper.append(this.elements.header);

    this.elements.contentWrapper.append(this.elements.duration);
    this.elements.headerWrapper.append(this.elements.content);
    this.elements.contentWrapper.append(this.elements.timestamp);
    this.elements.headerWrapper.append(this.elements.image);

    this.elements.container.append(this.elements.headerWrapper);
    this.elements.container.append(this.elements.contentWrapper);

    this.update(options);
    this.updateDuration();
    setInterval(this.updateDuration, 1000);
    $(options.container).append(this.elements.container);
}
