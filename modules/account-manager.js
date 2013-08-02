
var crypto 		= require('crypto');
var MongoDB 	= require('mongoskin').Db;
var Server 		= require('mongoskin').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'node-login';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});
var accounts = db.collection('accounts');
var subscriptions = db.collection('subscriptions');
var subs_type = [
	{short: 'rss', name: 'RSS'}
];
/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
					});
				}
			});
		}
	});
}

exports.updateAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

exports.handleSubscription = function(newData, callback)
{
	if(newData.id === ''){
		addSubscription(newData, callback);
	}
	else{
		subscriptions.findOne({_id: getSubscriptionObjectId(newData.id)}, function(e, o) {
			if (e){
				addSubscription(newData, callback);
			}	else{
				updateSubscription(newData, callback);
			}
		});
	}
}

exports.getSubscriptions = function(user, callback)
{
	subscriptions.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(res)
	});
}

exports.getSubscriptionById = function(id, callback)
{
	subscriptions.findOne({_id: getSubscriptionObjectId(id)}, callback);
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getAccountObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllAccountRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

exports.getAllSubsType = function(callback)
{
	return subs_type;
}

exports.deleteSubscription = function(id, callback)
{
	subscriptions.remove({_id: getSubscriptionObjectId(id)}, callback);
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var addSubscription = function(data, callback)
{
	accounts.findOne({url:data.url}, function(e, o){
		if (o){
			callback('subscriptions-exists');
		}	else{	
			data.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			subscriptions.insert(data, {safe: true}, callback);
		}	
	});
}

var updateSubscription = function(data, callback)
{
	subscriptions.findOne({_id: getSubscriptionObjectId(data.id)}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			o.name = data.name;
			o.url = data.url;
			o.desc = data.desc;
			o.refr = data.refr;
			o.date = moment().format('MMMM Do YYYY, h:mm:ss a');
	        subscriptions.save(o, {safe: true}, callback);
		}
	});
}

var getAccountObjectId = function(id)
{
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getSubscriptionObjectId = function(id)
{
	if(!id || id === '') return '';
	return subscriptions.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findAccountById = function(id, callback)
{
	accounts.findOne({_id: getAccountObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

var findSubscriptionById = function(id, callback)
{
	subscriptions.findOne({_id: getSubscriptionObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
