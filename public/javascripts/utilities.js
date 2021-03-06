var utilities = {
    toDurationStr: function(duration) {
        var hrs = ~~(duration / 3600);
        var mins = ~~((duration % 3600) / 60);


        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";
        if (duration < 60) {
            ret = "0 min";
        }
        else {
            if (hrs < 10) {
                ret += "0" + hrs + ":";
            }
            else {
                ret +=  hrs + ":";
            }
            if (mins < 10) {
                ret += "0" + mins;
            }
            else {
                ret +=  mins;
            }
        }


        return ret;
    },
    isColorLight: function(hex) {
        //https://codepen.io/anon/pen/vZLReL
        var rgb = utilities.hexToRgb(hex);
        var a = 1 - (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return (a < 0.5);
    },
    hexToRgb: function(hex) {
        //https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

};
