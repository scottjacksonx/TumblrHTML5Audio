var l10n_str = l10n_str || {
	'ajax_error': 'Sorry, we seem to be having technical trouble.  Please try again later.',
	'load_more_posts': 'Load more posts',
	'loading': 'Loading...',
	'saving': 'Saving...',
	'no_posts_found': 'No posts found',
	'reply': 'Reply',
	'edit': 'edit',
	'delete': 'delete',
	'reblog': 'reblog',
	'like': 'like',
	'confirm_delete': 'Are you sure you want to delete this post?',
	'video_not_compatible': 'Video not compatible',
	'listen': 'Listen',
	'show_note': 'Show %d note',
	'show_notes': 'Show %d notes',
	'hide_note': 'Hide %d note',
	'hide_notes': 'Hide %d notes',
	'source': 'Source',
	'refresh': 'Refresh',
	'notification': ['%1$s answered your %2$squestion</a>', '%1$s liked your %2$spost</a>', '%1$s %2$sreblogged</a> your %4$spost</a>', '', '%1$s started following you', '', '%1$s replied to your %2$spost</a>']
};
var preload_images = [];
var preload_filenames = ['http://assets.tumblr.com/images/loading_big_cf2025.gif', 'http://assets.tumblr.com/images/loading_big_abb5c5.gif', 'http://assets.tumblr.com/images/iphone/dashboard/sprite.png?3', 'http://assets.tumblr.com/images/iphone/dashboard/reply_nipple.png', 'http://assets.tumblr.com/images/iphone/dashboard/external_image_loading.gif?2'];
for (i in preload_filenames) {
	preload_images[i] = new Image();
	preload_images[i].src = preload_filenames[i];
}
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-97144-8']);
_gaq.push(['_trackPageview']);

function $(el) {
	return document.getElementById(el) ? document.getElementById(el) : false;
}

function has_class_name(el, class_name) {
	if (typeof el == 'string') el = $(el);
	return (el.className.indexOf(class_name) == -1) ? false : true;
}

function add_class_name(el, class_name) {
	if (typeof el == 'string') el = $(el);
	el.className = el.className + ' ' + class_name;
}

function remove_class_name(el, class_name) {
	if (typeof el == 'string') el = $(el);
	el.className = el.className.replace(new RegExp(class_name, 'g'), '');
}

function toggle_class_name(el, class_name) {
	if (has_class_name(el, class_name)) {
		remove_class_name(el, class_name);
	} else {
		add_class_name(el, class_name);
	}
}

function ajax(url, onSuccess, onFailure, params) {
	if (typeof params == 'undefined') params = null;
	var method = (params ? 'POST' : 'GET');
	var req = new XMLHttpRequest();
	req.open(method, url, true);
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				onSuccess(req.responseText);
			} else {
				onFailure();
			}
		}
	};
	if (params) req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(params);
}

function toggle_reply_form(post_id) {
	toggle_class_name($('reply_' + post_id), 'active');
	if ($('reply_form_' + post_id).style.display == 'block') {
		$('reply_char_count_' + post_id).innerHTML = '250';
		$('reply_textarea_' + post_id).value = '';
		$('reply_form_' + post_id).style.display = 'none';
	} else {
		$('reply_form_' + post_id).style.display = 'block';
		$('reply_textarea_' + post_id).focus();
	}
}

function submit_reply_form(post_id, tumblelog_key) {
	var reply_text = $('reply_textarea_' + post_id).value;
	if (!reply_text) return false;
	$('reply_button_' + post_id).value = l10n_str.saving;
	ajax('/reply', function (res) {
		$('reply_button_' + post_id).value = l10n_str.reply;
		toggle_reply_form(post_id);
	}, function () {
		alert(l10n_str.ajax_error);
		$('reply_button_' + post_id).value = l10n_str.reply;
	}, 'post_id=' + post_id + '&key=' + tumblelog_key + '&reply_text=' + encodeURIComponent(reply_text).replace(/%20/g, '+'));
}

function update_reply_char_counter(post_id) {
	var count = 250 - $('reply_textarea_' + post_id).value.length;
	if (count < 16) {
		$('reply_char_count_' + post_id).innerHTML = '<b style="color:#de6d6d;">' + count + '</b>';
	} else {
		$('reply_char_count_' + post_id).innerHTML = count;
	}
}

function toggle_like(post_id, reblog_key) {
	if (!form_key) return false;
	var heart = $('heart_' + post_id);
	var red = has_class_name(heart, 'red');
	if (has_class_name(heart, 'loading')) return;
	if (red) remove_class_name(heart, 'red');
	add_class_name(heart, 'loading');
	if (!red) _gaq.push(['_trackEvent', '/iphone', 'Like', 'Post: ' + post_id]);
	ajax((red ? '/unlike/' : '/like/') + reblog_key, function () {
		remove_class_name(heart, 'loading');
		if (!red) add_class_name(heart, 'red');
	}, function () {
		alert(l10n_str.ajax_error);
		remove_class_name(heart, 'loading');
		if (red) add_class_name(heart, 'red');
	}, 'id=' + post_id + '&form_key=' + form_key);
}

function _toggle_notes(post_id) {
	$('notes_' + post_id).style.display = ($('notes_' + post_id).style.display == 'none' ? 'block' : 'none');
}

function toggle_notes(post_id, tumblelog_key) {
	if ($('notes_' + post_id).hasAttribute('fetched')) {
		_toggle_notes(post_id);
		$('show_notes_show_' + post_id).style.display = ($('show_notes_show_' + post_id).style.display == 'none' ? 'inline' : 'none');
		$('show_notes_hide_' + post_id).style.display = ($('show_notes_hide_' + post_id).style.display == 'none' ? 'inline' : 'none');
	} else {
		$('show_notes_loading_' + post_id).style.display = 'inline';
		$('show_notes_show_' + post_id).style.display = 'none';
		$('show_notes_hide_' + post_id).style.display = 'none';
		ajax('/dashboard/notes/' + post_id + '/' + tumblelog_key + '?iphone', function (res) {
			$('show_notes_loading_' + post_id).style.display = 'none';
			$('show_notes_show_' + post_id).style.display = 'none';
			$('show_notes_hide_' + post_id).style.display = 'inline';
			$('notes_' + post_id).innerHTML += res;
			$('notes_' + post_id).setAttribute('fetched', 'true');
			_toggle_notes(post_id);
		}, function () {
			alert(l10n_str.ajax_error);
			$('show_notes_loading_' + post_id).style.display = 'none';
			$('show_notes_show_' + post_id).style.display = 'inline';
			$('show_notes_hide_' + post_id).style.display = 'none';
		});
	}
}

function toggle_playing(post_id) {
	var player = $('audio_player_' + post_id);
	var controller = $('audio_controller_' + post_id);
	if (player && controller) {
		if (player.paused) {
			player.play();
			if (player.hasAttribute('preload')) {
				add_class_name(controller, 'is_loading');
				player.removeAttribute('preload');
			} else {
				toggle_class_name(controller, 'is_playing');
			}
		} else {
			player.pause();
			toggle_class_name(controller, 'is_playing');
		}
		player.addEventListener("canplaythrough", function () {
			remove_class_name(controller, 'is_loading');
			add_class_name(controller, 'is_playing');
		}, true);
	}
}

function confirm_delete(post_id) {
	if (!form_key) return false;
	if (confirm(l10n_str.confirm_delete)) {
		add_class_name('delete_' + post_id, 'loading');
		ajax('/delete', function (res) {
			window.location = window.location;
			remove_class_name('delete_' + post_id, 'loading');
		}, function () {
			alert(l10n_str.ajax_error);
			remove_class_name('delete_' + post_id, 'loading');
		}, 'id=' + post_id + '&form_key=' + form_key + '&redirect_to=' + encodeURIComponent(window.location));
	}
}

function toggle_external_inline_image(thumbnail, external_src) {
	if (has_class_name(thumbnail, 'enlarged')) {
		thumbnail.src = thumbnail.getAttribute('original_src');
		remove_class_name(thumbnail, 'enlarged');
	} else {
		thumbnail.setAttribute('original_src', thumbnail.src);
		add_class_name(thumbnail, 'enlarged');
		if (thumbnail.hasAttribute('loader')) {
			thumbnail.src = thumbnail.getAttribute('loader');
		}
		var img_obj = new Image();
		img_obj.onload = function () {
			thumbnail.src = external_src;
		};
		img_obj.onerror = function () {
			thumbnail.src = thumbnail.getAttribute('original_src');
		};
		img_obj.src = external_src;
	}
}
var swiper_x_start = 0;

function swiper(e) {
	var touches = e.type == 'touchend' ? e.changedTouches : e.touches;
	if (!(touches && touches.length == 1)) return;
	var touch = touches[0];
	var node = touch.target;
	if (!(node.className && node.className.indexOf('photoset') != -1)) return;
	var post_id_and_offset = node.id.replace('photoset_photo_', '').replace('img_', '').split('_');
	if (post_id_and_offset.length != 2) return;
	post_id_and_offset[1] = parseInt(post_id_and_offset[1]);
	var photoset = $('photoset_photos_' + post_id_and_offset[0]);
	if (e.type == "touchstart") {
		swiper_x_start = touch.clientX;
		remove_class_name(photoset, 'tween');
	} else if (e.type == 'touchmove') {
		var delta = swiper_x_start - touch.clientX;
		var distance = (post_id_and_offset[1] * -600) - delta;
		photoset.style.webkitTransform = 'translate(' + distance + 'px,0)';
	} else if (e.type == 'touchend') {
		var delta = swiper_x_start - touch.clientX;
		snap(post_id_and_offset, (Math.abs(delta) >= 250) ? (delta <= 0 ? -1 : 1) : 0);
		swiper_x_start = 0;
	}
}

function snap(post_id_and_offset, direction) {
	var photoset = $('photoset_photos_' + post_id_and_offset[0]);
	var photos = photoset.childNodes;
	var indicators = true;
	var distance = -600 * (post_id_and_offset[1] + direction);
	if (direction == 0) {
		distance = post_id_and_offset[1] * -600;
		indicators = false;
	}
	if (direction == -1 && post_id_and_offset[1] == 0) {
		distance = 0;
		indicators = false;
	}
	if (direction == 1 && (photos.length - 1) == post_id_and_offset[1]) {
		distance = (photos.length - 1) * -600;
		indicators = false;
	}
	add_class_name(photoset, 'tween');
	photoset.style.webkitTransform = 'translate(' + distance + 'px,0)';
	if (indicators) {
		indicators = $('photoset_indicators_' + post_id_and_offset[0]).getElementsByTagName('b');
		for (i in indicators) {
			indicators[i].className = (i == (post_id_and_offset[1] + direction) ? 'active' : '');
		}
	}
}
var next_page = false;
var loading_next_page = false;

function load_next_page() {
	if (loading_next_page) return;
	$('str_load_more_posts').style.display = 'none';
	$('str_loading_more_posts').style.display = 'inline';
	loading_next_page = true;
	_gaq.push(['_trackPageview', next_page.replace('&json=1', '')]);
	ajax(next_page, function (res) {
		$('str_load_more_posts').style.display = 'inline';
		$('str_loading_more_posts').style.display = 'none';
		loading_next_page = false;
		var data = eval(res);
		render(data);
		start_post_fader();
		next_page = data.next_page;
	}, function () {
		alert(l10n_str.ajax_error);
		loading_next_page = false;
		$('str_load_more_posts').style.display = 'inline';
		$('str_loading_more_posts').style.display = 'none';
	});
}
var callback = false;

function render(data) {
	if (data.next_page) next_page = data.next_page;
	if (data.callback) callback = data.callback;
	if (data.posts && data.posts.length) {
		if (!$('posts')) {
			var posts = document.createElement('ul');
			posts.id = 'posts';
			window.document.body.appendChild(posts);
			if (data.next_page) {
				var load_more_posts = document.createElement('a');
				load_more_posts.href = 'javascript:load_next_page();';
				load_more_posts.id = 'load_more_posts';
				load_more_posts.innerHTML = '<div class="gradient"></div>' + '<span id="str_load_more_posts">' + l10n_str.load_more_posts + '</span>' + '<span id="str_loading_more_posts" style="display:none">' + l10n_str.loading + '</span>';
				window.document.body.appendChild(load_more_posts);
			}
		}
		render_posts(data.posts);
	} else {
		if (!$('posts')) {
			window.document.body.innerHTML = '<div id="no_posts"><div class="x"><div class="neg"></div><div class="pos"></div></div>' + l10n_str.no_posts_found + '</div>';
		} else {
			$('load_more_posts').style.display = 'none';
		}
	}
}

function render_reply_form(post) {
	return post.with_reply ? '<div class="clear"></div>' + '<div id="reply_form_' + post.id + '" style="display:none;">' + '<div class="reply_bubble">' + '<div class="reply_nipple"></div>' + '<textarea id="reply_textarea_' + post.id + '" onkeyup="update_reply_char_counter(' + post.id + ')"></textarea>' + '</div>' + '<a href="javascript:submit_reply_form(' + post.id + ',\'' + post.tumblelog_key + '\')" class="reply_button">' + l10n_str.reply + '</a>' + '<span id="reply_char_count_' + post.id + '" class="reply_char_count">250</span>' + '</div>' : '';
}

function render_post_header(post) {
	if (post.is_mine) {
		var edit = '/edit/' + post.id + '?redirect_to=' + encodeURIComponent(window.location);
		if (callback == 'js') {
			edit = 'javascript:tumblr_edit(' + post.id + ')';
		} else if (callback) {
			edit = 'tumblr:///edit?id=' + post.id + '&url=' + encodeURIComponent(post.tumblelog_url);
		}
		var controls = '<a class="delete" id="delete_' + post.id + '" href="javascript:confirm_delete(' + post.id + ');">' + l10n_str['delete'] + '</a>' + (post.type != 'note' ? '<a class="text" href="' + edit + '">' + l10n_str.edit + '</a>' : '');
	} else {
		var reblog = '/reblog/' + post.id + '/' + post.reblog_key + '&redirect_to=' + encodeURIComponent(window.location);
		if (callback == 'js') {
			reblog = 'javascript:tumblr_reblog(' + post.id + ',\'' + post.reblog_key + '\')';
		} else if (callback >= 2) {
			reblog = 'tumblr:///reblog?id=' + post.id + '&key=' + encodeURIComponent(post.reblog_key) + '&url=' + encodeURIComponent(post.url);
		}
		var controls = (post.with_reply ? '<a class="reply" id="reply_' + post.id + '" href="javascript:toggle_reply_form(' + post.id + ');"></a>' : '') + (post.type != 'note' ? '<a class="reblog" href="' + reblog + '">' + l10n_str.reblog + '</a>' : '') + '<a class="like' + (post.user_did_like ? ' red' : '') + '" id="heart_' + post.id + '" href="javascript:toggle_like(' + post.id + ',\'' + post.reblog_key + '\');">' + l10n_str.like + '</a>';
	}
	if (!form_key) controls = '';
	return '<div class="post_middle ' + (post.note_count ? 'with_notes ' : '') + (post.thumbnail || post.embed || post.photo || post.photos || post.type == 'audio' ? ' with_media' : '') + '">' + '<div class="header ' + (post.with_reply ? 'with_reply' : '') + '">' + '<div class="username">' + '<a href="' + post.url + '">' + post.tumblelog_name + '</a>' + '<div class="gradient"></div>' + '</div>' + '<div class="controls">' + controls + '</div>' + render_reply_form(post) + '</div>' + '<div class="caption">';
}

function render_post_footer(post) {
	var notes = (post.note_count ? '<div id="notes_' + post.id + '" style="display:none">' + '<a href="javascript:toggle_notes(' + post.id + ', \'' + post.tumblelog_key + '\')" class="hide_notes">' + ((post.note_count == 1 ? l10n_str.hide_note : l10n_str.hide_notes).replace('%d', post.note_count)) + '</a>' + (post.source_url ? '<div class="source">' + l10n_str.source + ': <a href="' + post.source_url + '">' + post.source_title + '</a></div>' : '') + '</div>' : '');
	return notes + '</div></div>';
}

function render_posts(posts) {
	var class_name = false;
	for (i in posts) {
		var post_html = '';
		var post = posts[i];
		if (post.type == 'notification') {
			class_name = 'notification type_' + post.notification_type;
			post_html += l10n_str.notification[post.notification_type].replace('%1$s', '<a href="' + post.from_tumblelog_url + '">' + post.from_tumblelog_name + '</a>');
			if (post.notification_type == 2) {
				post_html = post_html.replace('%2$s', '<a href="' + post.reblogged_post_url + '">').replace('%4$s', '<a href="' + post.post_url + '">');
			} else {
				post_html = post_html.replace('%2$s', '<a href="' + post.post_url + '">');
			}
			if (post.summary) {
				post_html += ': <em><a href="' + post.post_url + '">' + post.summary + '</a></em>';
			}
			if (post.body) {
				post_html += '<blockquote>' + post.body + '</blockquote>';
			}
			if (post.first) class_name += ' first_notification';
			if (post.last) class_name += ' last_notification';
		} else if (post.type == 'regular') {
			post_html += render_post_header(post) + '<div class="words">' + (post.title ? '<h1>' + post.title + '</h1>' : '') + (post.body ? post.body : '') + '</div>' + render_post_footer(post);
		} else if (post.type == 'photo') {
			post_html += (post.clickthru ? '<a href="' + post.clickthru + '" target="_blank">' : '') + '<div class="media">' + '<div class="nipple"></div>' + '<img src="' + post.photo + '" width="' + post.width + '" height="' + (post.height ? post.height : '') + '" class="photo" onload="this.src=\'' + post.photo.replace('_100.', '_' + (post.max ? post.max : '400') + '.') + '\'"/>' + '</div>' + (post.clickthru ? '</a>' : '') + render_post_header(post) + '<div class="words">' + (post.body ? post.body : '') + '</div>' + render_post_footer(post);
		} else if (post.type == 'photoset') {
			post_html += '<div class="media photoset">' + '<div class="photoset_photos" id="photoset_photos_' + post.id + '" style="-webkit-transform:translate(0,0); height:' + post.height + 'px">';
			for (j in post.photos) {
				var photo = post.photos[j];
				post_html += '<div class="photoset_photo" id="photoset_photo_' + post.id + '_' + j + '">' + '<img class="photoset_photo_img" id="photoset_photo_img_' + post.id + '_' + j + '" src="' + photo.src + '"' + 'width="' + photo.width + '" height="' + photo.height + '" ' + 'style="padding-top:' + Math.round((post.height - photo.height) / 2) + 'px;"/>' + '</div>';
			}
			post_html += '</div>' + '<div class="indicators" id="photoset_indicators_' + post.id + '">';
			for (j in post.photos) {
				post_html += '<b' + (j == 0 ? ' class="active"' : '') + '></b>';
			}
			post_html += '</div>' + '<div class="nipple"></div>' + '</div>' + render_post_header(post) + '<div class="words">' + (post.body ? post.body : '') + '</div>' + render_post_footer(post);
		} else if (post.type == 'quote') {
			post_html += render_post_header(post) + '<div class="words">' + '<h1>â€œ' + post.quote + 'â€</h1>';
			if (post.body) {
				post_html += '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:15px 0 0 0">' + '<tbody>' + '<tr>' + '<td valign="top" style="width:2px; font-size:24px; padding:0 20px 0 0">â€”</td>' + '<td valign="top" style="font-size:27px; line-height:38px">' + post.body + '</td>' + '</tr>' + '</tbody>' + '</table>';
			}
			post_html += '</div>' + render_post_footer(post);
		} else if (post.type == 'link') {
			post_html += render_post_header(post) + '<div class="words">' + '<h1 class="link"><a href="' + post.link_url + '">' + post.link_name + '&nbsp;&rarr;</a></h1>' + (post.body ? post.body : '') + '</div>' + render_post_footer(post);
		} else if (post.type == 'conversation') {
			post_html += render_post_header(post) + '<div class="words">' + (post.title ? '<h1>' + post.title + '</h1>' : '') + '<table class="chat" border="0" cellpadding="0" cellspacing="0">';
			for (j in post.lines) {
				post_html += '<tr>' + '<td class="username">' + post.lines[j].name + ':</td>' + '<td class="words" width="*">' + post.lines[j].phrase + '</td>' + '</tr>';
			}
			post_html += '</table>' + '</div>' + render_post_footer(post);
		} else if (post.type == 'video') {
			if (post.video_url) post_html += '<a href="' + post.video_url + '">';
			if (post.thumbnail) {
				if ((dimensions = post.dimensions)) {
					dimensions = 'width="' + dimensions[0] + '" height="' + dimensions[1] + '"';
				} else {
					dimensions = '';
				}
				post_html += '<div class="media">' + '<div class="nipple"></div><div class="play_video_circle"></div><img src="' + post.thumbnail + '" class="video_thumbnail"' + dimensions + '/>' + '</div>';
			}
			if (post.video_url) post_html += '</a>';
			post_html += render_post_header(post);
			if (post.body || !post.thumbnail) {
				post_html += '<div class="words">' + (!post.thumbnail ? '<span class="unable_to watch_video"><strong>' + l10n_str.video_not_compatible + '</strong></span><br/>' : '') + (post.body ? post.body : '') + '</div>';
			}
			post_html += render_post_footer(post);
		} else if (post.type == 'audio') {
			post_html += '<div class="media audio">' + (post.album_art ? '<img src="' + post.album_art + '" class="cover">' : '') + '<a id="audio_controller_' + post.id + '" href="javascript:toggle_playing(' + post.id + ');" class="play' + (post.album_art ? ' with_cover_art' : '') + '">' + (post.id3 ? (post.id3.track ? '<strong>' + post.id3.track + '</strong><br/>' : '') + (post.id3.artist ? post.id3.artist : '') : '<strong class="listen">' + l10n_str.listen + '</strong>') + '</a>' + '<audio id="audio_player_' + post.id + '" src="' + post.direct_audio_url + '" preload="none"></audio>' + '</div>' + render_post_header(post) + '<div class="words">' + (post.body ? post.body : '') + '</div>' + render_post_footer(post);
		} else if (post.type == 'note') {
			post_html += render_post_header(post) + '<div class="words">' + '<div class="answer_question">' + post.question + '<div class="question_nipple"></div>' + '</div>' + '<div class="answer_asker">' + (post.asker_url ? '<a href="' + post.asker_url + '">' : '') + '<img src="' + post.asker_avatar + '" width="64" height="64" />' + (post.asker_url ? '</a>' : '') + '</div>' + (post.answer ? '<p>' + post.answer + '</p>' : '') + '</div>' + render_post_footer(post);
		}
		if (post.note_count) {
			post_html += '<a href="javascript:toggle_notes(' + post.id + ',\'' + post.tumblelog_key + '\')" class="show_notes" id="show_notes_' + post.id + '">' + '<span id="show_notes_show_' + post.id + '">' + ((post.note_count == 1 ? l10n_str.show_note : l10n_str.show_notes).replace('%d', post.note_count)) + '</span>' + '<span id="show_notes_loading_' + post.id + '" style="display:none">' + l10n_str.loading + '</span>' + '<span id="show_notes_hide_' + post.id + '" style="display:none">' + ((post.note_count == 1 ? l10n_str.hide_note : l10n_str.hide_notes).replace('%d', post.note_count)) + '</span>' + '</a>';
		}
		if (post_html) {
			post = document.createElement('li');
			post.className = class_name ? class_name : 'post';
			post.innerHTML = post_html;
			$('posts').appendChild(post);
			class_name = false;
		}
	}
}
var last_offset = 0;
var post_fader = false;

function start_post_fader() {
	if (post_fader) return false;
	post_fader = setInterval(function () {
		if (window.pageYOffset && window.pageYOffset != last_offset) {
			last_offset = window.pageYOffset;
			list_items = document.getElementsByTagName('li');
			for (i in list_items) {
				if (list_items[i].className == 'post') {
					if (list_items[i].offsetTop + list_items[i].offsetHeight + 10000 < window.pageYOffset) {
						list_items[i].style.height = (list_items[i].offsetHeight - 10) + 'px';
						list_items[i].innerHTML = '';
						list_items[i].className = 'post faded';
					}
				}
			}
			if (!$('refresh')) $('posts').innerHTML += '<div id="refresh"><a class="inner" href="javascript:window.location=window.location;$(\'refresh\').style.display=\'none\';">' + l10n_str.refresh + '</a></div>';
		}
	}, 10000);
}