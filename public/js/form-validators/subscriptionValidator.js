
function SubscriptionValidator(){

// build array maps of the form inputs & control groups //

	this.formFields = [$('#substype'), $('#suburl'), $('#subname'), $('#subdesc'), $('#subref')];
	this.controlGroups = [$('#type-cg'), $('#url-cg'), $('#name-cg'), $('#desc-cg'), $('#refresh-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
	
	this.validateURL = function(s)
	{
		return s.length >= 5;
	}
	
	this.validateType = function(s)
	{
		return s.length >= 2;
	}

	this.validateRefresh = function(s)
	{
		return s.length >= 1;
	}
	
	this.validateName = function(s)
	{
		return s.length >= 3;
	}
	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}

SubscriptionValidator.prototype.showInvalidURL = function()
{
	this.controlGroups[1].addClass('error');
	this.showErrors(['That url address is not ok.']);
}

SubscriptionValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	if (this.validateType(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); e.push('Please Enter a type');
	}
	if (this.validateURL(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error'); e.push('Please Enter a URL');
	}
	if (this.validateName(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error'); e.push('Please Enter a Name');
	}
	if (this.validateRefresh(this.formFields[3].val()) == false) {
		this.controlGroups[3].addClass('error'); e.push('Please Enter a Refresh Time');
	}
	if (e.length) this.showErrors(e);
	return e.length === 0;
}

	