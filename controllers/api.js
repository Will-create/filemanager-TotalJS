exports.install = function() {
	GROUP(['authorize'], function() {
		// Files
		ROUTE('GET      /api/files/                  *File --> @query');
		ROUTE('POST     /api/files/                  *File --> @save');
		ROUTE('DELETE   /api/files/{id}/             *File --> @remove');

		// Common
		ROUTE('GET      /api/meta/                   *Common --> @meta');
	});

	ROUTE('POST /api/upload/',        upload,   ['authorize', 'upload'], 1024 * 5);
	ROUTE('POST /api/upload/base64/', upload64, ['authorize'], 1024 * 5);

	ROUTE('GET  /download/{id}/',     download, ['authorize']);
};

function download(id) {
	var self = this;
	id = id.substring(0, id.indexOf('-'));
	self.res.filefs('op' + self.user.openplatformid, id);
}

function upload() {
	var self = this;
	var file = self.files[0];
	file.fs('op' + self.user.openplatformid, self.user.id, function(err, id) {
		var output = {};
		output.id = UID();
		output.path = (self.query.path || '').replace(/\\|\//g, '-');
		output.reference = '';
		output.sharing = [];
		output.note = '';
		output.ip = self.req.ip;
		output.created = NOW;
		output.userid = self.user.id;
		output.fileid = id + '-' + self.user.id.hash();
		output.type = file.type;
		output.size = file.length;
		output.width = file.width;
		output.height = file.height;
		output.ext = U.getExtension(file.filename);
		output.name = file.filename.replace(/\.[a-z]+$/i, '');
		NOSQL('files').insert(output).callback(() => self.json(output));
	});
}

function upload64() {

	var self = this;
	var data = (self.body.data || '').base64ToBuffer();
	var filename = self.body.filename;

	if (!data || !filename) {
		self.invalid('error-data');
		return;
	}

	FILESTORAGE('op' + self.user.openplatformid).insert(filename, data, self.user.id, function(err, id, meta) {
		var output = {};
		
		output.id = UID();
		output.path = (self.query.path || '').replace(/\\|\//g, '-');
		output.reference = '';
		output.sharing = [];
		output.note = '';
		output.ip = self.req.ip;
		output.created = NOW;
		output.userid = self.user.id;
		output.fileid = id + '-' + self.user.id.hash();
		output.type = meta.type;
		output.size = meta.size;
		output.width = meta.width;
		output.height = meta.height;
		output.ext = U.getExtension(filename);
		output.name = filename.replace(/\.[a-z]+$/i, '');
		NOSQL('files').insert(output).callback(() => self.json(output));
	});
}
