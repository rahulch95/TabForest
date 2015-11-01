document.addEventListener('DOMContentLoaded', function() {

	chrome.storage.local.get("stat", function(data){
		var status;
		if(data.stat){
			status = data.stat;
		}
		else {
			status = "start";
			chrome.storage.local.set({"stat": "start"});
		}

		if(status == "start"){
			$('#stat li img').attr("src", "pause.png");
			$('#stat li p').html("Pause Recording");
		}
		else {
			$('#stat li img').attr("src", "play.png");
			$('#stat li p').html("Start Recording");
		}

	});

	$("#stat").on('click', function(){
		if($('#stat li p').text() == "Start Recording"){
			$('#stat li img').attr("src", "pause.png");
			$('#stat li p').html("Pause Recording");
			chrome.storage.local.set({"stat": "start"});
		}
		else {
			$('#stat li img').attr("src", "play.png");
			$('#stat li p').html("Start Recording");
			chrome.storage.local.set({"stat": "pause"});
		}
	});

	$('#options').on('click', function(){
	});

});
