function $(id, text, color, ishtml) {
	elem = document.getElementById(id);
	if (text) {
		if (ishtml) {
			elem.innerHTML = text;
		} else {
			elem.textContent = text;
		}
	}
	if (color) {
		elem.style.color = color;
	}
	return elem;
}
function pad(x) {
	var out = x + "";
	if (out.length == 1) {
		return "0" + out;
	} else {
		return out;
	}
}
var os = ["Opening Ceremony", "8:50", "9:30", "--:--"];
var signups = [	0,		0,		0,		3072,	0,		11614,	0,		6277,	9154,	4353,	os,		os,		//  8:00 -  8:55
				os,		os,		os,		os,		os,		os,		12666,	11610,	3242,	11614,	7561,	10277,	//  9:00 -  9:55
				7561,	0,		5975,	4266,	12858,	18228,	7280,	0,		7561,	10277,	15746,	13881,	// 10:00 - 10:55
				11614,	3242,	6277,	18228,	10277,	10223,	3027,	5975,	3027,	10223,	14501,	13881,	// 11:00 - 11:55
				4266,	18228,	5975,	0,		11610,	7280,	0,		7280,	7561,	15746,	9154,	14501,	// 12:00 - 12:55
				12666,	3242,	6277,	14501,	10223,	14501,	12858,	7561,	13881,	18228,	3242,	3072];	//  1:00 -  1:55

var base_time = 22 * 3600 + 0 * 60 + 0//8 * 3600 + 0 * 60 + 0;
var time_slot_length = 5 * 60;
var default_entry = 0;
var red_threshold = 60, beep_threshold = [60, 10];

function get_seconds_from_base(d) {
	return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds() - base_time;
}

function get_time_slot(d) {
	return Math.floor(get_seconds_from_base(d) / time_slot_length);
}

function get_team_slot(offset) {
	if (offset >= 0 && offset < signups.length) {
		return signups[offset];
	} else {
		return default_entry;
	}
}

function format_slot(slot) {
	if (slot == 0) {
		return "None";
	} else {
		return "" + slot;
	}
}

setInterval(function() {
	var d = new Date();
	var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
	var offset = get_time_slot(d);
	var teamno = get_team_slot(offset), teamnext = get_team_slot(offset + 1), teamprev = get_team_slot(offset - 1);
	$("now", pad(h) + ":" + pad(m) + ":" + pad(s));
	if (typeof teamno !== "number") {
		$("team", teamno[0]);
		$("from", teamno[1]);
		$("to", teamno[2]);
		$("counter", teamno[3], teamno[4]);
	} else {
		$("team", format_slot(teamprev) + "..<span class='active'>" + format_slot(teamno) + "</span>.." + format_slot(teamnext), false, true);
		$("from", pad(h) + ":" + pad(m - m % 5));
		if (m >= 55) {
			$("to", pad(h+1) + ":00");
		} else {
			$("to", pad(h) + ":" + pad(5 + m - m % 5));
		}
		var since = get_seconds_from_base(d);
		var count = time_slot_length - (since % time_slot_length);
		if (count == time_slot_length) { count = 0; }
		if (beep_threshold.indexOf(count) !== -1) {
			new Audio("beep-01.wav").play();
		}
		$("counter", pad(Math.floor(count / 60)) + ":" + pad(count % 60), (count < red_threshold) ? "red" : "black");
	}
}, 1000);
