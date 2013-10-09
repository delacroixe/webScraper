
$(document).ready(function(){

	var hc = new HomeController();
	var sv = new SubscriptionValidator();

	$('#subscription-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (sv.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status === 'success') {
				hc.onSuccess('Success!','A subscription has been handled successfully.');
				hc.showLockedAlert('Redirecting you back to the homepage');
			}
		},
		error : function(e){
			if (e.responseText == 'subscription-exists'){
				 sv.showInvalidURL('The subscription already exists!');
			}
			else{
				console.log(e.responseText);
			}
		}
	});

// customize the account settings form //
	$('#subname').hide();
	$('#subdesc').hide();
	$('#lsubname').hide();
	$('#lsubdesc').hide();
	$('#subref').hide();
	$('#lsubref').hide();
	$('#lsubtags').hide();
	$('#subtags').hide();
	$('#subscription-form-btn2').hide();

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your subscription?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');

	hc.initTags();

})