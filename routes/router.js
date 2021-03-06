
var CT = require('../modules/country-list');
var EM = require('../modules/email-dispatcher');
var service = require('../modules/services');
var AccountHandler = require('../handlers/accountHandler');
var SubscriptionHandler = require('../handlers/subscriptionHandler');
var ItemHandler = require('../handlers/itemHandler');

module.exports = function(app, db, CronAPI, io) {

	var ch = new CronAPI(db, io);
	ch.initCrons(function(err){
      if(err) console.log('Error initing crons...' + e);
    });
	
	var accountHandler = new AccountHandler(db);
	var subscriptionHandler = new SubscriptionHandler(db, ch);
	var itemHandler = new ItemHandler(db, io);

/*
//Llamadas para testeo
	app.get('/todas', itemHandler.showAll);

// Llama al RSS y por cada link extra el la noticia y la guarda
	app.get('/list', function (req, res) {
	  service.list(function(c){
	    //console.log(c);
	    res.send(c);
	  });

	});

// noticias mas nuevas que la fecha enviada
	app.get('/last', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
	    	IM.last(function(c){
	    		res.json(c);
	    	});

	    }
	});

//angular list page
	app.get('/itemList', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			res.render('itemList', {
				title : 'Publisher Home'
			});
	    }
	});

// Recibe los datos del formulario add
	app.post('/additem', function(req,res){
		var obj = req.body;
		obj.fecha = new Date();

		console.log(obj);
		IM.save(obj)
		res.redirect('/new');
	});

// Llama al RSS y por cada link extra el la noticia y la guarda

	app.get('/list', function (req, res) {
	  service.list(function(c){
	    //console.log(c);
	    res.send(c);
	  });

	});
*/

// Add new item into Data Base
	app.get('/new', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			res.render('new', {
				title : 'Publisher Home'
			});
	    }
	});

//Cross-origin request error parser
	app.all('/*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
		next();
	});



// main login page //

	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			accountHandler.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});

	app.post('/', function(req, res){
		accountHandler.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});

//Una ruta que devuelve ese String

	app.get('/items', function (req, res) {
	  itemHandler.getItems(req, res, function(obj){
	    res.json(obj);
	  });
	});

// logged-in user homepage //

	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
	    	subscriptionHandler.getSubscriptionTags(function(data){
		    	subscriptionHandler.getSubscriptions(null, function(e){
		    		res.render('home', {
						title : 'Publisher Home',
						udata : req.session.user,
						subs: e,
						substype: subscriptionHandler.getAllSubsType(),
						substags: data
					});
		    	});
	    	});
	    }
	});

	app.post('/addSub', function(req, res) {
		subscriptionHandler.handleSubscription({
			id		: req.param('subid'),
			name 	: req.param('subname'),
			type 	: req.param('subtype'),
			url 	: req.param('suburl'),
			desc	: req.param('subdesc'),
			refr	: req.param('subref'),
			tags	: req.param('tags')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

	app.get('/getSub', function(req, res) {
		subscriptionHandler.getSubscriptionById(req.param('id')
		, function(e, o){
			if (e){
				res.send(e, 400);
			}	else{
				res.send(o);
			}
		});
	});

	app.get('/subsTags', function(req, res) {
		subscriptionHandler.getSubscriptionTags(function(r){
			res.send(r);
		});
	});

	app.get('/checkTw', function(req, res) {
		subscriptionHandler.getTwInfo(req.param('username')
		, function(e, o){
			console.log(e);
			console.log(o);
			if (e){
				res.send(e, 400);
			}	else{
				res.send(o);
			}
		});
	});

	app.get('/delSub', function(req, res) {
		subscriptionHandler.deleteSubscription(req.param('id')
		, function(e, o){
			if (e){
				res.send('record not found', 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

	app.get('/refSub', function(req, res) {
		subscriptionHandler.getSubscriptionById(req.param('id')
		, function(e, o){
			if (e){
				res.send('record not found', 400);
			}	else{
				ch.refreshSubscription(o);
				res.send('ok', 200);
			}
		});
	});

	app.get('/profile', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			res.render('profile', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
	    }
	});

	app.post('/profile', function(req, res){
		if (req.param('user') != undefined) {
			accountHandler.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				country 	: req.param('country'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
					}
					res.send('ok', 200);
				}
			});
		}
	});

	app.post('/logout', function(req, res){
		if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});

// creating new accounts //

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});

	app.post('/signup', function(req, res){
		accountHandler.addNewAccount({
			name 	: req.param('name'),
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			country : req.param('country')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		accountHandler.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		accountHandler.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		accountHandler.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		})
	});

// view & delete accounts //

	app.get('/print', function(req, res) {
		accountHandler.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});

	app.post('/delete', function(req, res){
		accountHandler.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});

	app.get('/reset', function(req, res) {
		accountHandler.delAllRecords(function(){
			res.redirect('/print');
		});
	});

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });


};


