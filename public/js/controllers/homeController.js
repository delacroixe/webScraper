
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#suburl').change(function(){ that.insertURL(); });

// confirm account deletion //
	$('#sub-form-btn1').click(function(){$('.modal-confirm').modal('show')});

// handle account deletion //
	$('.modal-confirm .submit').click(function(){ that.deleteSubscription(); });

	this.insertURL = function()
	{
		var baseurl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q='
		$('.modal-confirm').modal('hide');
		var that = this;

		$.ajax({
			url: baseurl + $('#suburl').val(),
			type: 'GET',
			dataType: 'jsonp',
			success: function(data){
				$('#lsubname').show();
				$('#lsubdesc').show();
	 			$('#subname').val(data.responseData.feed.title);
				$('#subdesc').val(data.responseData.feed.description);
				$('#subname').show();
				$('#subdesc').show();
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
}

HomeController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('A new subscription has been added.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}
