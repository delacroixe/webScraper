/*
 * Account Handler
 */

 function AccountHandler(db) {
 	this.accounts = db.collection('accounts');

 	var that = this;

 	this.autoLogin = function(user, pass, callback) {
		this.accounts.findOne({user:user}, function(e, o) {
			if (o){
				o.pass == pass ? callback(o) : callback(null);
			}	else{
				callback(null);
			}
		});
	}

	this.manualLogin = function(user, pass, callback) {
		this.accounts.findOne({user:user}, function(e, o) {
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
		this.accounts.findOne({user:newData.user}, function(e, o) {
			if (o){
				callback('username-taken');
			}	else{
				this.accounts.findOne({email:newData.email}, function(e, o) {
					if (o){
						callback('email-taken');
					}	else{
						saltAndHash(newData.pass, function(hash){
							newData.pass = hash;
						// append date stamp when record was created //
							newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
							this.accounts.insert(newData, {safe: true}, callback);
						});
					}
				});
			}
		});
	}

	this.updateAccount = function(newData, callback) {
		this.accounts.findOne({user:newData.user}, function(e, o){
			o.name 		= newData.name;
			o.email 	= newData.email;
			o.country 	= newData.country;
			if (newData.pass == ''){
				this.accounts.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			}	else{
				saltAndHash(newData.pass, function(hash){
					o.pass = hash;
					this.accounts.save(o, {safe: true}, function(err) {
						if (err) callback(err);
						else callback(null, o);
					});
				});
			}
		});
	}

	this.updatePassword = function(email, newPass, callback) {
		this.accounts.findOne({email:email}, function(e, o){
			if (e){
				callback(e, null);
			}	else{
				saltAndHash(newPass, function(hash){
			        o.pass = hash;
			        this.accounts.save(o, {safe: true}, callback);
				});
			}
		});
	}

	/* account lookup methods */

	this.deleteAccount = function(id, callback) {
		this.accounts.remove({_id: getAccountObjectId(id)}, callback);
	}

	this.getAccountByEmail = function(email, callback) {
		this.accounts.findOne({email:email}, function(e, o){ callback(o); });
	}

	this.validateResetLink = function(email, passHash, callback) {
		this.accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
			callback(o ? 'ok' : null);
		});
	}

	this.getAllAccountRecords = function(callback) {
		this.accounts.find().toArray(
			function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	};

	this.delAllRecords = function(callback) {
		this.accounts.remove({}, callback); // reset this.accounts collection for testing //
	}

	/* private encryption & validation methods */

	this.generateSalt = function() {
		var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
		var salt = '';
		for (var i = 0; i < 10; i++) {
			var p = Math.floor(Math.random() * set.length);
			salt += set[p];
		}
		return salt;
	}

	this.md5 = function(str) {
		return crypto.createHash('md5').update(str).digest('hex');
	}

	this.saltAndHash = function(pass, callback) {
		var salt = generateSalt();
		callback(salt + md5(pass + salt));
	}

	this.validatePassword = function(plainPass, hashedPass, callback) {
		var salt = hashedPass.substr(0, 10);
		var validHash = salt + md5(plainPass + salt);
		callback(null, hashedPass === validHash);
	}

	/* auxiliary methods */

	this.getAccountObjectId = function(id) {
		return this.accounts.db.bson_serializer.ObjectID.createFromHexString(id)
	}


	this.findAccountById = function(id, callback) {
		this.accounts.findOne({_id: getAccountObjectId(id)},
			function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	};

	this.findByMultipleFields = function(a, callback) {
	// this takes an array of name/val pairs to search against {fieldName : 'value'} //
		this.accounts.find( { $or : a } ).toArray(
			function(e, results) {
			if (e) callback(e)
			else callback(null, results)
		});
	}
 };