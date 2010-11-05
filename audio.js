$(".post_content").each(function(index) {
	if ($(this).children().first().attr("id").substr(0,10) == "audio_node") {
		//alert("no album art post found");
		var src = $(this).children().first().next().html();
		var start = src.search("http://www.tumblr.com/audio_file/");
		var end = src.search("color=FFFFFF");
		src = src.substr(start, end-start-4);
		//alert(src);
		
		$("<audio src=\"" + src + "\" controls=\"controls\" preload=\"none\">Uh oh</audio>").insertAfter($(this).children().first());
		$(this).children().first().css("display", "none");
	}
});

$(".post_content").each(function(index) {
	if ($(this).children().first().next().attr("id").substr(0,10) == "audio_node") {
		//alert("album art post found");
		var src = $(this).children().first().next().next().html();
		var start = src.search("http://www.tumblr.com/audio_file/");
		var end = src.search("color=FFFFFF");
		src = src.substr(start, end-start-4);
		//alert(src);

		$("<audio src=\"" + src + "\" controls=\"controls\" preload=\"none\">Uh oh</audio>").insertAfter($(this).children().first().next());
		$(this).children().first().next().css("display", "none");
	}
});