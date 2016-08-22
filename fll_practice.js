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

var base_time = 8 * 3600 + 0 * 60 + (window.location.toString().includes(":8080") ? 0 : 0);
var time_slot_length = 5 * 60;
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

function format_slot(slot, main) {
	if (typeof slot !== "number") {
		return slot[main ? 0 : 5];
	} else if (slot == 0) {
		return "None";
	} else {
		return "" + slot;
	}
}

var last_second = 0;

function update() {
	var d = new Date();
	var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
	if (s == last_second) {
		return;
	}
	last_second = s;
	var offset = get_time_slot(d);
	var teamno = get_team_slot(offset), teamnext = get_team_slot(offset + 1), teamprev = get_team_slot(offset - 1);
	$("now", pad(h) + ":" + pad(m) + ":" + pad(s));
	var complex = typeof teamno !== "number";
	$("team", format_slot(teamprev) + "..<span class='active'>" + format_slot(teamno, true) + "</span>.." + format_slot(teamnext), false, true);
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
	$("counter", (complex && teamno[3]) || (pad(Math.floor(count / 60)) + ":" + pad(count % 60)), (complex && teamno[4]) || ((count < red_threshold) ? "red" : "black"));
}

function start() {
	setInterval(update, 100);
}
