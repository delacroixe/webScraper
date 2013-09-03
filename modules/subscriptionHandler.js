/*
 * Subscriptions Handler
 */

function SubscriptionHanlder(db){
	this.subscriptions = db.collection('subscriptions');
	this.subs_type = [
		{short: 'rss', name: 'RSS'}
	];
	this.crons = [];

	var that = this;

	this.handleSubscription = function(newData, callback) {
		if(newData.id === ''){
			this.addSubscription(newData, callback);
		}
		else{
			this.subscriptions.findOne({_id: this.getSubscriptionObjectId(newData.id)}, function(e, o) {
				if (e){
					this.addSubscription(newData, callback);
				}	else{
					this.updateSubscription(newData, callback);
				}
			});
		}
	}

	this.getSubscriptions = function(user, callback) {
		this.subscriptions.find().toArray(
			function(e, res) {
			if (e) callback(e)
			else callback(res)
		});
	}

	this.getSubscriptionById = function(id, callback) {
		this.subscriptions.findOne({_id: this.getSubscriptionObjectId(id)}, callback);
	}

	this.deleteSubscription = function(id, callback) {
		this.subscriptions.remove({_id: this.getSubscriptionObjectId(id)}, callback);
	}

	this.getAllSubsType = function(callback) {
		return this.subs_type;
	}

	this.addSubscription = function(data, callback)	{
		this.subscriptions.findOne({url:data.url}, function(e, o){
			if (o){
				callback('subscription-exists');
			}	else{	
				data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
				this.createCron(data);
				this.subscriptions.insert(data, {safe: true}, callback);
			}	
		});
	}

	this.updateSubscription = function(data, callback) {
		this.subscriptions.findOne({_id: getSubscriptionObjectId(data.id)}, function(e, o){
			if (e){
				callback(e, null);
			}	else{
				o.name = data.name;
				o.url = data.url;
				o.desc = data.desc;
				o.refr = data.refr;
				o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
		        this.subscriptions.save(o, {safe: true}, callback);
			}
		});
	}

	this.createCron = function(data) {
		var j = schedule.scheduleJob('*/'+data.refr+' * * * *', function(){
			console.log('cron...');
		});
		this.crons.push(j);
	}

	this.findSubscriptionById = function(id, callback) {
		this.subscriptions.findOne({_id: this.getSubscriptionObjectId(id)},
			function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	};

	this.getSubscriptionObjectId = function(id)	{
		if(!id || id === '') return '';
		return this.subscriptions.db.bson_serializer.ObjectID.createFromHexString(id)
	}
};

