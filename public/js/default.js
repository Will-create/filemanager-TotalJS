UPTODATE('1 hour', function() {
	return !document.hasFocus();
});

function resizelayout() {
	var h = $(window).height();
	$('.scroller').each(function() {
		var el = $(this);
		var m = el.attrd('margin');

		if (m)
			m = +m;
		else
			m = 0;

		el.css('height', h - (el.offset().top + m));
	});
}

NAV.clientside('.jR');

ON('ready', resizelayout);
$(document).ready(resizelayout);

OPENPLATFORM.on('resize', resizelayout);
OPENPLATFORM.init(function() {
	common.ready = true;
	SET('common.state', 'ready');
});

Tangular.register('filesize', function(value, decimals, type) {
	return value ? value.filesize(decimals, type) : '...';
});

Number.prototype.filesize = function(decimals, type) {

	if (typeof(decimals) === 'string') {
		var tmp = type;
		type = decimals;
		decimals = tmp;
	}

	var value;

	// this === bytes
	switch (type) {
		case 'bytes':
			value = this;
			break;
		case 'KB':
			value = this / 1024;
			break;
		case 'MB':
			value = filesizehelper(this, 2);
			break;
		case 'GB':
			value = filesizehelper(this, 3);
			break;
		case 'TB':
			value = filesizehelper(this, 4);
			break;
		default:

			type = 'bytes';
			value = this;

			if (value > 1023) {
				value = value / 1024;
				type = 'KB';
			}

			if (value > 1023) {
				value = value / 1024;
				type = 'MB';
			}

			if (value > 1023) {
				value = value / 1024;
				type = 'GB';
			}

			if (value > 1023) {
				value = value / 1024;
				type = 'TB';
			}

			break;
	}

	type = ' ' + type;
	return (decimals === undefined ? value.format(2).replace('.00', '') : value.format(decimals)) + type;
};

function filesizehelper(number, count) {
	while (count--) {
		number = number / 1024;
		if (number.toFixed(3) === '0.000')
			return 0;
	}
	return number;
}

Tangular.register('sharing', function(val) {

	if (!val || !val.length)
		return '';

	var builder = [];
	for (var i = 0; i < val.length; i++) {
		var item = val[i];
		switch (item.substring(0, 1)) {
			case 'R':
				// role
				var r = common.meta.roles.findItem('id', item.substring(1));
				r && builder.push('<span class="mr5 badge badge-orange">{0}</span>'.format(r.name));
				break;
			case 'G':
				// group
				var g = common.meta.groups.findItem('id', item.substring(1));
				g && builder.push('<span class="mr5 badge badge-green">{0}</span>'.format(g.name));
				break;
			default:
				// user
				var user = common.users.findItem('id', item);
				user && builder.push('<span class="mr5 badge badge-blue">{0}</span>'.format(user.name));
				break;
		}
	}

	return builder.join('');
});

Tangular.register('sharingsearch', function(val) {

	if (!val || !val.length)
		return '';

	var builder = [];
	for (var i = 0; i < val.length; i++) {
		var item = val[i];
		switch (item.substring(0, 1)) {
			case 'R':
				// role
				var r = common.meta.roles.findItem('id', item.substring(1));
				r && builder.push(r.name);
				break;
			case 'G':
				// group
				var g = common.meta.groups.findItem('id', item.substring(1));
				g && builder.push(g.name);
				break;
			default:
				// user
				var user = common.users.findItem('id', item);
				user && builder.push(user.name);
				break;
		}
	}

	return builder.join('');
});
