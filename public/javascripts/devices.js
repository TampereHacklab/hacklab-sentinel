var uploadCrop = $("#image-upload-area").croppie({
    enableExif: true,
    viewport: {
        height: 200,
        width: 200,
        type: "rectangle"
    },
    boundary: {
        height: 300,
        width: 300
    }
});
$("#upload-image-button").on("change", function(event) {
    readFile(this);
});
function readFile(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
        	$('.upload-demo').addClass('ready');
        	uploadCrop.croppie('bind', {
        		url: e.target.result
        	}).then(function(){

        	});

        }

        reader.readAsDataURL(input.files[0]);
    }
}
$("#image-upload-modal button#apply").on("click", function(event) {
    uploadCrop.croppie('result', {
    	type: 'canvas',
    	size: 'viewport'
    }).then(function (resp) {
    	$("img#device-image").attr("src", resp);
        $("input[name='image']").val(resp);
        $("#image-upload-modal").modal("hide");
    });
});
