AUTH(function(req, res, flags, next) {

	var op = req.query.openplatform;

	if (!op || op.length < 20) {
		next(true);
		return;
	}

	var id = op.hash();

	if (MAIN.sessions[id] && MAIN.sessions[id].nextreload > NOW) {
		next(true, MAIN.sessions[id]);
		return;
	}

	RESTBuilder.make(function(builder) {
		builder.url(op);
		builder.exec(function(err, user) {

			if (user.id) {
				MAIN.meta[user.openplatformid] = user.meta;
				var tmp = user.profile;
				tmp.expire = NOW.add('1 day');
				tmp.openplatformid = user.openplatformid;
				MAIN.sessions[tmp.id] = tmp;
				MAIN.sessions[id] = tmp;
				tmp.nextreload = NOW.add('5 minutes');
				synchronize(user, () => next(true, tmp));
			} else
				next(false);

		});
	});

});

ON('service', function(counter) {

	// Each 10 minutes
	if (counter % 10 !== 0)
		return;

	var keys = Object.keys(MAIN.sessions);
	for (var i = 0; i < keys.length; i++) {
		var session = MAIN.sessions[keys[i]];
		if (session.expire < NOW)
			delete MAIN.sessions[keys[i]];
	}
});

function synchronize(user, callback) {

	if (!user)
		return callback && callback();

	var meta = MAIN.users[user.openplatformid];
	if (meta && meta.updated.add('5 minutes') > NOW) {
		callback && callback();
		return;
	}

	RESTBuilder.make(function(builder) {
		builder.url(user.users);
		builder.exec(function(err, users) {
			!meta && (meta = MAIN.users[user.openplatformid] = {});
			meta.users = users.items.map(mapping);
			meta.updated = NOW;
			callback && callback();
		});
	});

}

function mapping(item) {
	return { id: item.id, name: item.name, notify: item.notify, notifications: item.notifications, badge: item.badge };
}