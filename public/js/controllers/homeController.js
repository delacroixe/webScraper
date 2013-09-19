
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;
	var subid = '';


// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

// handle adding url //
	$('#suburl').keyup(function(){ that.insertURL(); });

//handle sub update //
	$('#subscription-form-btn2').click(function(){that.emptySubForm()});

// confirm sub deletion //
	$('a.subdel').click(function(){
		subid = $(this).attr('id');
		$('.modal-confirm').modal('show');
	});

// handle subscription deletion //
	$('.modal-confirm .submit').click(function(){ that.deleteSubscription(); });


// handle edit sub//
	$('a.subedit').click(function(){ that.onSubEdit($(this).attr('id')); });

// handle update subscription
	$('a.subref').click(function(){ that.refreshSubcription($(this).attr('id')); });

	this.insertURL = function()
	{
		var set = false;
		$('.modal-confirm').modal('hide');
		if(checkIsRSS()) {
			set = true;
		}
		/*if(!set && checkIsTW()){
			set = true;
		}*/
		else that.showInvalidRSS('The RSS URL you inserted is not valid, check it out and try again!');
	}

	this.refreshSubcription = function(id) {
		$.ajax({
			url: '/refSub',
			type: 'GET',
			dataType: 'jsonp',
			data: {id: id},
			success: function (data){
				that.onSuccess('Success!','Subscription refreshed!');
			},
			error: function (jqXHR){
				if(jqXHR.status === 200) that.onSuccess('Success!','Subscription refreshed!');
				else console.log(jqXHR.statusText + " :: " + jqXHR.responseText);
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
				that.fillSubForm(data);
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
				that.showLockedAlert('Your subscription has been deleted.<br>Redirecting you back to the homepage.');
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

	this.showInvalidRSS = function(msg){
		/*
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Invalid RSS!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		*/
		$('#url-cg').addClass('control-group error');
	}

	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/logout",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	var checkIsRSS = function() {
		var newurl = (($('#suburl').val()).indexOf('http://') === -1)? 'http://'+$('#suburl').val() : $('#suburl').val();
		var baseurl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=-1&q='
		$.ajax({
			url: baseurl + newurl,
			type: 'GET',
			dataType: 'jsonp',
			success: function(data){
				if(data.responseData != null){
					$('#lsubname').show();
					$('#lsubdesc').show();
					$('#lsubref').show();
		 			$('#subname').val(data.responseData.feed.title);
					$('#subdesc').val(data.responseData.feed.description);
					$('#subname').show();
					$('#subdesc').show();
					$('#subref').show();
					$('#url-cg').removeClass('control-group error');
					$('#suburl').val(newurl);
					$('#substype').val('rss');
					return true;
				}
				return false;
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				return false;
			}
		});
	}

	var checkIsTW = function() {
		var username = null;
		var result = false;
		if (($('#suburl').val()).indexOf('https://twitter.com/') !== -1) {
			username = $('#suburl').val().substring('https://twitter.com/'.length);
			if(username.indexOf('/') !== -1){
				username = username.substring(0, username.indexOf('/'));
			}
			$.ajax({
				url: '/checkTw',
				type: 'GET',
				dataType: 'jsonp',
				data: {username: username},
				success: function (data){
					console.log(data);
				},
				error: function (jqXHR){
					if(jqXHR.status === 200) console.log('Success!' + jqXHR.responseText);
					else console.log(jqXHR.statusText + " :: " + jqXHR.responseText);
				}
			});
		}
		return result;
	}

}

HomeController.prototype.onSuccess = function(title, msg)
{
	if(!$('#subscription-form-btn1').hasClass('btn-success'))
		$('#subscription-form-btn1').toggleClass('btn-success');
	if($('#subscription-form-btn1').hasClass('btn-warning'))
		$('#subscription-form-btn1').toggleClass('btn-warning');
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h3').text(title);
	$('.modal-alert .modal-body p').html(msg);
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
