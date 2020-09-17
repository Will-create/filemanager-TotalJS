NEWSCHEMA('File', function(schema) {

	schema.define('id', 'UID', true);
	schema.define('fileid', 'String(50)');
	schema.define('name', 'String(50)', true);
	schema.define('path', 'String(50)');
	schema.define('width', Number);
	schema.define('height', Number);
	schema.define('size', Number);
	schema.define('ext', 'String(10)');
	schema.define('type', 'String(80)');
	schema.define('reference', 'String(50)');
	schema.define('sharing', '[String]');
	schema.define('note', 'String(100)');

	schema.setSave(function($) {
		var model = $.model;
		model.ip = $.ip;
		model.userid = $.user.id;
		model.created = NOW;
		model.path = model.path.replace(/\/|\\/g, '-').trim();
		NOSQL('files').update(model).where('id', model.id).callback(() => $.success(model.id));
	});

	schema.setQuery(function($) {

		var builder = NOSQL('files').find2();
		var filter = [$.user.id];

		for (var i = 0; i < $.user.roles.length; i++)
			filter.push('R' + $.user.roles[i]);

		for (var i = 0; i < $.user.groups.length; i++)
			filter.push('G' + $.user.groups[i]);

		builder.or();
		builder.where('userid', $.user.id);
		builder.in('sharing', filter);
		builder.end();
		builder.callback($.callback);
	});

	schema.setRemove(function($) {
		NOSQL('files').remove().where('id', $.id).where('userid', $.user.id).first();
		$.success();
	});

});