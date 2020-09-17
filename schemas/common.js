NEWSCHEMA('Common', function(schema) {

	schema.addWorkflow('meta', function($) {
		var data = {};
		data.users = MAIN.users[$.user.openplatformid].users;
		data.meta = MAIN.meta[$.user.openplatformid];
		$.callback(data);
	});

});