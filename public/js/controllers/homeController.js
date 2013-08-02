
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;
	var subid = '';

// handle adding url //
	$('#suburl').change(function(){ that.insertURL(); });

//handle sub update //
	$('#subscription-form-btn1').click(function(){that.updateSub()});
	$('#subscription-form-btn2').click(function(){that.emptySubForm()});

// confirm sub deletion //
	$('a.subdel').click(function(){
		subid = $(this).attr('id');
		$('.modal-confirm').modal('show');
	});

// handle account deletion //
	$('.modal-confirm .submit').click(function(){ that.deleteSubscription(); });


// handle edit sub//
	$('a.subedit').click(function(){ that.onSubEdit($(this).attr('id')); });

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
				$('#lsubref').show();
	 			$('#subname').val(data.responseData.feed.title);
				$('#subdesc').val(data.responseData.feed.description);
				$('#subname').show();
				$('#subdesc').show();
				$('#subref').show();
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.onSubEdit = function(id){
		$.ajax({
			url: '/getSub',
			type: 'GET',
			dataType: 'jsonp',
			data: {id: id},
			success: function(data){
				fillSubForm(data);
			},
			error: function(jqXHR){
				if (jqXHR.status === 200){
					that.fillSubForm($.parseJSON(jqXHR.responseText));	
				}
				else {
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			}
		});
	}

	this.deleteSubscription = function(){
		$('.modal-confirm').modal('hide');
		$.ajax({
			url: '/delSub',
			type: 'GET',
			dataType: 'jsonp',
			data: {id: subid},
			success: function(data){
				this.showLockedAlert('Your subscription has been deleted.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				if(jqXHR.status === 200)that.showLockedAlert('Your subscription has been deleted.<br>Redirecting you back to the homepage.');
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.fillSubForm = function(data){
		$('#subscription-form-btn1').html('Update');
		if($('#subscription-form-btn1').hasClass('btn-success'))
			$('#subscription-form-btn1').toggleClass('btn-success');
		if(!$('#subscription-form-btn1').hasClass('btn-warning'))
			$('#subscription-form-btn1').toggleClass('btn-warning');
		$('#lsubname').show();
		$('#lsubdesc').show();
		$('#lsubref').show();
		$('#subid').val(data._id);
		$('#suburl').val(data.url);
	 	$('#subname').val(data.name);
		$('#subdesc').val(data.desc);
		$('#subref').val(data.refr);
		$('#subref').show();
		$('#subname').show();
		$('#subdesc').show();
		$('#subscription-form-btn2').show();
	}

	this.emptySubForm = function(data){
		$('#subscription-form-btn1').hide();
		$('#subscription-form-btn1').html('Add');
		if(!$('#subscription-form-btn1').hasClass('btn-success'))
			$('#subscription-form-btn1').toggleClass('btn-success');
		if($('#subscription-form-btn1').hasClass('btn-warning'))
			$('#subscription-form-btn1').toggleClass('btn-warning');
		$('#lsubname').hide();
		$('#lsubdesc').hide();
		$('#lsubref').hide();
		$('#subid').val('');
		$('#suburl').val('');
	 	$('#subname').val('');
		$('#subdesc').val('');
		$('#subref').val('');
		$('#subname').hide();
		$('#subdesc').hide();
		$('#subref').hide();
		$('#subscription-form-btn2').hide();
		$('#subscription-form-btn1').show();

	}


}

HomeController.prototype.onSuccess = function()
{
	if(!$('#subscription-form-btn1').hasClass('btn-success'))
		$('#subscription-form-btn1').toggleClass('btn-success');
	if($('#subscription-form-btn1').hasClass('btn-warning'))
		$('#subscription-form-btn1').toggleClass('btn-warning');
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html('A subscription has been handled successfully.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}

HomeController.prototype.showLockedAlert = function(msg){
	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Success!');
	$('.modal-alert .modal-body p').html(msg);
	$('.modal-alert').modal('show');
	$('.modal-alert button').click(function(){window.location.href = '/home';})
	setTimeout(function(){window.location.href = '/home';}, 3000);
}
