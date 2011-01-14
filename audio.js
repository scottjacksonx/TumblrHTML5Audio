$('#posts').children().each(function(index) {
	if ($(this).attr("class").search("audio") != -1) {
		//alert("audio post found");
		
		/* Parse the URL of the audio file. */
		var src = $(this).children().first().next().next().next().html();
		var start = src.search("http://www.tumblr.com/audio_file/");
		var end = src.search("color=FFFFFF");
		src = src.substr(start, end-start-4);
		
		var elem = $(this);

		/* Check whether the file is hosted at Tumblr or externally hosted. */
		$.ajax({
			url: src,
			type: 'GET',
			error: function(xhr, ajaxOptions, thrownError) {
				/* Hosted at Tumblr. */
				src += "?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio";
				insertAudio(elem, src);
			},
			success: function(data) {
				/* Externally hosted. */
				insertAudio(elem, src);
			}
		});
	} else if ($(this).attr("class").search("video") != -1) {
		/* Parse the URL of the video file. */
		var src = $(this).children().first().next().next().next().html();
		var start = src.search("http://www.tumblr.com/video_file/");
		if (start != -1) {
			var end = src.search(",500");
			src = src.substr(start, end-start-1);	
			//alert("video url: " + src);
			insertVideo($(this), src);
		}
	}
});


/*
**	@elem: a child of $('#posts')
**	@src: the URL of an audio file
*/
function insertAudio(elem, src) {
	$("<audio src=\"" + src + "\" controls=\"controls\" preload=\"none\">Uh oh</audio>").insertAfter(elem.children().first().next().next().next().children().first());
	elem.children().first().next().next().next().children().first().next().next().css("display", "none");
}

/*
**	@elem: a child of $('#posts')
**	@src: the URL of a video file
*/
function insertVideo(elem, src) {
	$("<video src=\"" + src + "\" controls=\"controls\" preload=\"none\" style=\"width: 500px;\">Uh oh</audio>").insertAfter(elem.children().first().next().next().next().children().first());
	elem.children().first().next().next().next().children().first().css("display", "none");
}