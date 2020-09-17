global.MAIN = {};
MAIN.users = {};
MAIN.sessions = {};
MAIN.meta = {};

MAIN.notify = function(user, msg, type, data) {
	user && RESTBuilder.make(function(builder) {
		builder.url(user.notify);
		builder.json({ body: msg, type: type, data: data });
		builder.exec(ERROR('MAIN.notify()'));
	});
};

MAIN.badge = function(user) {
	user && RESTBuilder.make(function(builder) {
		builder.url(user.badge);
		builder.exec(ERROR('MAIN.badge()'));
	});
};