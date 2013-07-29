
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
			console.log(status);
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
			console.log(e);
		}
	});

// customize the account settings form //
	$('#subname').hide();
	$('#subdesc').hide();
	$('#lsubname').hide();
	$('#lsubdesc').hide();
	$('#subscription-form-btn1').html('Add');
	$('#subscription-form-btn1').addClass('btn-success');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');

})