/*
 * Account Handler
 */

var crypto 		= require('crypto');
var moment 		= require('moment');

 function AccountHandler(db) {
 	"user strict";

 	//var that = this;

 	this.autoLogin = function(user, pass, callback) {
		db.collection('accounts').findOne({user:user}, function(e, o) {
			if (o){
				o.pass == pass ? callback(o) : callback(null);
			}	else{
				callback(null);
			}
		});
	}

	this.manualLogin = function(user, pass, callback) {
		db.collection('accounts').findOne({user:user}, function(e, o) {
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

	this.addNewAccount = function(newData, callback) {
		db.collection('accounts').findOne({user:newData.user}, function(e, o) {
			if (o){
				callback('username-taken');
			}	else{
				db.collection('accounts').findOne({email:newData.email}, function(e, o) {
					if (o){
						callback('email-taken');
					}	else{
						saltAndHash(newData.pass, function(hash){
							newData.pass = hash;
						// append date stamp when record was created //
							newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
							db.collection('accounts').insert(newData, {safe: true}, callback);
						});
					}
				});
			}
		});
	}

	this.updateAccount = function(newData, callback) {
		db.collection('accounts').findOne({user:newData.user}, function(e, o){
			o.name 		= newData.name;
			o.email 	= newData.email;
			o.country 	= newData.country;
			if (newData.pass == ''){
				db.collection('accounts').save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			}	else{
				saltAndHash(newData.pass, function(hash){
					o.pass = hash;
					db.collection('accounts').save(o, {safe: true}, function(err) {
						if (err) callback(err);
						else callback(null, o);
					});
				});
			}
		});
	}

	this.updatePassword = function(email, newPass, callback) {
		db.collection('accounts').findOne({email:email}, function(e, o){
			if (e){
				callback(e, null);
			}	else{
				saltAndHash(newPass, function(hash){
			        o.pass = hash;
			        db.collection('accounts').save(o, {safe: true}, callback);
				});
			}
		});
	}

	/* account lookup methods */

	this.deleteAccount = function(id, callback) {
		db.collection('accounts').remove({_id: getAccountObjectId(id)}, callback);
	}

	this.getAccountByEmail = function(email, callback) {
		db.collection('accounts').findOne({email:email}, function(e, o){ callback(o); });
	}

	this.validateResetLink = function(email, passHash, callback) {
		db.collection('accounts').find({ $and: [{email:email, pass:passHash}] }, function(e, o){
			callback(o ? 'ok' : null);
		});
	}

	this.getAllAccountRecords = function(callback) {
		db.collection('accounts').find().toArray(
			function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	};

	this.delAllRecords = function(callback) {
		db.collection('accounts').remove({}, callback); // reset db.collection('accounts') collection for testing //
	}

	/* private encryption & validation methods */

	var generateSalt = function() {
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

	var saltAndHash = function(pass, callback) {
		var salt = generateSalt();
		callback(salt + md5(pass + salt));
	}

	var validatePassword = function(plainPass, hashedPass, callback) {
		var salt = hashedPass.substr(0, 10);
		var validHash = salt + md5(plainPass + salt);
		callback(null, hashedPass === validHash);
	}

	/* auxiliary methods */

	var getAccountObjectId = function(id) {
		return db.collection('accounts').db.bson_serializer.ObjectID.createFromHexString(id)
	}


	var findAccountById = function(id, callback) {
		db.collection('accounts').findOne({_id: getAccountObjectId(id)},
			function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	};

	 var findByMultipleFields = function(a, callback) {
	// this takes an array of name/val pairs to search against {fieldName : 'value'} //
		db.collection('accounts').find( { $or : a } ).toArray(
			function(e, results) {
			if (e) callback(e)
			else callback(null, results)
		});
	}
 };

 module.exports = AccountHandler;