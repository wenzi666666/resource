var uploadFileInit = function(url) {
	var uploader = new plupload.Uploader({
		runtimes: 'html5,flash,silverlight,html4',
		browse_button: 'pickfiles', // you can pass an id...
		container: document.getElementById('personal-center-container'), // ... or DOM Element itself
		url: url,
		// flash_swf_url : '../js/Moxie.swf',
		// silverlight_xap_url : '../js/Moxie.xap',

		filters: {
			max_file_size: '10mb',
			mime_types: [{
				title: "Image files",
				extensions: "jpg,gif,png"
			}, {
				title: "Zip files",
				extensions: "zip"
			}]
		},

		init: {
			PostInit: function() {
				//								document.getElementById('filelist').innerHTML = '';

				//								document.getElementById('uploadfiles').onclick = function() {
				//									uploader.start();
				//									return false;
				//								};
			},

			FilesAdded: function(up, files) {
				uploader.start();
				
				//								plupload.each(files, function(file) {
				//									document.getElementById('filelist').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>';
				//								});
			},

			UploadProgress: function(up, file) {
				//								document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			},
			FileUploaded: function(up, file, info) {
				console.log(info,up,file)
				$('#uploadModel').modal("hide");
				$('#eiditResModel').modal("show");
				
				file.path = info.response;
				$('#resName').val(file.name);
//				$('#resSize').val(file.size);
				
				window.localStorage.setItem('ngStorage-currentFile', JSON.stringify(file))
			},

			Error: function(up, err) {
				//								document.getElementById('console').appendChild(document.createTextNode("\nError #" + err.code + ": " + err.message));
			}
		}
	});

	uploader.init();
}