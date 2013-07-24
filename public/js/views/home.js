
$(document).ready(function(){

	
	$('#subs-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success')console.log('success');
		},
		error : function(e){
			
		}
	});

// customize the account settings form //
	
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