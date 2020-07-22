/* https://convert.ing-now.com/generate-a-waveform-image-from-an-audio-file/ */

// HTML5 File Uploader
// CONVERTING NOW V2.0 JAN 2017

// init
var fileTypes = ['mp3','m4a','wav'],
	fileNamePrefix='upload',
	loadingText='uploading ',
	completeText='complete',
	fileSize='?? MB',
	fileSizeBytes=0,
	currentFileBytesLoaded=0,
	previousFileBytesLoaded=0,
	uploadInProgress=false;
	intervalID=false;


jQuery(document).ready(function(){

	$(document).on('dragenter', function (e) 
	{
		if(!uploadInProgress) {$('#file_upload_control_wrapper').removeClass( "dragOver" );}
		return false;
	});
	
	$(document).on('dragleave', function (e) 
	{
		if(!uploadInProgress) {$('#file_upload_control_wrapper').addClass( "dragOver" );}
		return false;
	});	
	
	$(document).on('dragover', function (e) 
	{
	  if(!uploadInProgress) {$('#file_upload_control_wrapper').addClass( "dragOver" );}
	  return false;
	});
	
	$(document).on('drop', function (e) 
	{
		if(!uploadInProgress) {$('#file_upload_control_wrapper').removeClass( "dragOver" );}
		return false;
	});	
	
	$('#file_upload').on('drop', function(event) {

		if(!uploadInProgress)
		{
			var files = event.originalEvent.dataTransfer.files;
			fileDrop(files);
			$('#file_upload_control_wrapper').removeClass( "dragOver" );
		}
		
		return false;

	 });

	var xhr = new XMLHttpRequest();
	
	// Detect if XHR is available
	//
	if (xhr.upload) { // use xhr
		
		$('#file_upload').css('display','block');
		
		$('#file_upload_filename').on('change', function() {
			
			fileSizeBytes=this.files[0].size;
			fileSize=(this.files[0].size / (1024*1024)).toFixed(2);
			
			var file=$(this)[0].files[0];
			var ext = file.name.split('.').pop().toLowerCase();
			var qty = $(this)[0].files.length;
			
			if (fileValidate(qty,fileSize,ext)) {
			
				if (uploadInProgress) {
					error('notification',"a file is already uploading...");
					return false;
				}				
			
				fileSize=fileSize + 'MB';

				$.event.trigger({
						type: "PAJ_Application_Media_Upload_Started",
						fileSize : fileSize,
						time: new Date()
				});
				
				uploadInProgress=true;
				UploadFile(file);
				
			} else {
				// reset input field
				$('#file_upload_filename').val('');
			}
			
			return false;
		});	
		
	} else { // no upload
	
		error('notification','Your browser does not support this upload.');
	}

});

	function fileValidate(qty,size,ext)
	{
			
			// Terms and conditions
			//
			//if (!isChecked('#file_upload_terms'))
			//{
			//	error('notification','Please agree to the image submission terms and conditions.');
			//	return false;
			//}
			
			// init
			$("#file_upload_radial_progress").fadeOut("slow");
			
			// validate file
			if($.inArray(ext, fileTypes) == -1) { // validate extension
				error('notification','sorry this file type is not supported.');
				return false;
			}			
			
			if (fileSize < 50) // validate size
			{
				if (qty === 1) // validate quantity
				{
					return true;
				} else {
					error('notification','Please upload one file at a time.');
					return false;
				}
				
			} else {
				error('notification','Damn, this file is too big to upload, try again with a smaller file.');
				return false;
			}	
	}
	
	function fileDrop(files)
	{
		var qty=files.length;
		
		fileSizeBytes=files[0].size;
		fileSize=(files[0].size / (1024*1024)).toFixed(2);
		
		var ext = files[0].name.split('.').pop().toLowerCase();
		
		if (fileValidate(qty,fileSize,ext)) {
		
			fileSize=fileSize + 'MB';
		
			$.event.trigger({
					type: "PAJ_Application_Media_Upload_Started",
					fileSize : fileSize,
					time: new Date()
			});	
			
			$("#file_upload").prop('disabled', true);
			
			UploadFile(files[0]);
		}	   

	}
	// XHR HTML5 upload
	//
	function UploadFile(file) {

			var xhr = new XMLHttpRequest();
		
			// start speed calculator
			intervalID=setInterval(calculateSpeed, 1000);

			// progress bar
			xhr.upload.addEventListener("progress", function(e) {
				if (e.lengthComputable)
				{
					updateProgress((e.loaded / e.total));
					currentFileBytesLoaded=e.loaded;
				} else {
					error('info',"Cannot calculate file upload size.",1);
				}
			}, false);
			
			xhr.addEventListener("error", uploadFailed, false);
			xhr.addEventListener("abort", uploadCanceled, false);			

			// file received/failed
			xhr.onreadystatechange = function(e) {
				
				if (xhr.readyState==4) //4: request finished and response is ready
				{
					var response=jQuery.parseJSON(xhr.responseText); // response from server
					
					clearInterval(intervalID);
					
						if (response.status==='success')
						{
							UploadFileSuccess(response);
							
						} else {
							UploadFileFail(response);
						}
				}
			};
			
			var fileName=file.name.toLowerCase().replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '-');
			fileName=replaceAll(' ','-',fileName);
			fileName=replaceAll('_','-',fileName);
			fileName=replaceAll('--','-',fileName);
			fileName=replaceAll('-.','.',fileName);
			
			try {			
				// start upload
				// modify path to server side php as required
				xhr.open("POST","/index.php?ajax=TRUE&class=PAJ_Application_ConvertingNow_File_FileUpload&variables=true&uploadfilenameprefix=" + fileNamePrefix + "&uploadresize=0x0",true);
				xhr.setRequestHeader("X-FILENAME", fileName);
				xhr.send(file);
				// reset file upload input element
				var control = jQuery("#file_upload_filename");
				control.replaceWith( control = control.clone( true ) );
			}
			catch(err) {
				uploadInProgress=false;
				jQuery.event.trigger({
						type: "PAJ_Application_Media_Upload_Failed",
						filename:  fileName,
						errormessage: err.message,
						time: new Date()
				});					
			}			

	}
	
	function uploadFailed(evt) {
	  uploadInProgress=false;
	  error('notification',"There was an error attempting to upload the file.",1);
	  clearInterval(intervalID);
	}

	function uploadCanceled(evt) {
	  uploadInProgress=false;
	  error('notification',"The upload has been cancelled, or the browser dropped the connection.",1);
	  clearInterval(intervalID);
	}  	
	
	// upload speed and progress calculator
	function calculateSpeed()
	{
		var bps=(currentFileBytesLoaded-previousFileBytesLoaded);
		
		var percent = parseInt((currentFileBytesLoaded / fileSizeBytes) * 100).toFixed(0);
		
		var kbps=(bps / 1024).toFixed(0);
		
		previousFileBytesLoaded=currentFileBytesLoaded;
		
		fileSizeBytesRemaining=fileSizeBytes-currentFileBytesLoaded;
		
		var secondsRemaining=(fileSizeBytesRemaining * 8) / bps;
		
		var minutes=secondsRemaining/60;
		
		var remaining=minutes.toFixed(0);
		
		var text='minutes remaining';
		
		if (minutes < 1)
		{
			remaining=secondsRemaining.toFixed(0);
			text='seconds remaining'
			
			if (remaining < 10 && remaining >= 0)
			{
				remaining='';
				text='less than 10 seconds remaining';
			}
		
		}
		
		if (kbps > 0) {
			$('#file_upload_speed').text('(' + kbps + ' Kbps - ' + percent + '% - ' + remaining + ' ' + text + ')');
		}

		
	}

	// upload success function
	function UploadFileSuccess(response)
	{
		uploadInProgress=false;
		// trigger event
			$.event.trigger({
					type: "PAJ_Application_Media_Upload_Complete",
					filename:  response.filename,
					output: response.output,
					fileid: response.fileid,
					duration: response.duration,
					time: new Date()
			});			
	}
	
	// upload failed function
	function UploadFileFail(response)
	{
		uploadInProgress=false;
		// trigger event
			$.event.trigger({
					type: "PAJ_Application_Media_Upload_Failed",
					filename:  response.errormessage,
					errormessage: response.errormessage,
					fileid: response.fileid,
					duration: response.duration,
					time: new Date()
			});			
	}