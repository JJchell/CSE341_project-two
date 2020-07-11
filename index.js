const express = require('express')
const {Pool} = require('pg')
const path = require('path')
const PORT = process.env.PORT || 5000
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const connectionString = process.env.DATABASE_URL || 'postgres://mmrnjisxpymnsx:217743defcce5ccbdfeae2a390e7149a335d1124bf4b71cba328a1593a0278f3@ec2-18-214-211-47.compute-1.amazonaws.com:5432/ddefaiklf4d1f?ssl=true' 
const pool = new Pool({connectionString: connectionString});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.urlencoded({extended:true}))//support url encoded bodies
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/info', queryInfo)
//   .get('/getServerTime')
  .post('/prof',queryProf)
  .post('/login', login)
	// .post('/logout')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  // adding a log in start *****************************************
	
	
  // adding a log in end *******************************************


function queryInfo(request, response) {
	
const prof=0;

	getPersonFromDb(prof, function(error, result) {
		
		if (error || result == null || result.length == 0) {
			response.status(500).json({success: false, data: error});
		} else {
			const person = result;
			response.status(200).json(person);
		}
	});
}

// This function gets a person from the DB.
// By separating this out from the handler above, we can keep our model
// logic (this function) separate from our controller logic (the getPerson function)
function getPersonFromDb(prof, callback) {
	console.log("Getting person from DB with prof: " + prof);

	const sql = "SELECT * FROM player";

	const params = [prof];

	pool.query(sql, function(err, result) {

		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

} // end of getPersonFromDb

function queryProf(request, response) {
	// First get the person's prof
	const prof = request.body.prof;

	// use a helper function to query the DB, and provprofe a callback for when it's done
	getProfFromDb(prof, function(error, result) {
		
		if (error || result == null || result.length == 0) {
			response.status(500).json({success: false, data: error});
		} else {
			const person = result;
			response.status(200).json(person);
		}
	});
}

function getProfFromDb(prof, callback) {
	console.log("Getting prof from DB with prof: " + prof);

	const sql = "SELECT * FROM player WHERE first_prof LIKE $1::text or second_prof LIKE $1::text ";

	const params = [prof];

	pool.query(sql,params, function(err, result) {
	
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		console.log("Found result: " + JSON.stringify(result.rows));

		callback(null, result.rows);
	});

}

// adding a log in start *****************************************
function login(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	console.log(username, password);

	if(username === 'admin' && password === 'password') {
		var result = {success: true, login: true};
		res.json(result);
	} else {
		var result = {success: true, login:false};
		res.json(result);
	}

}
// adding a log in end *******************************************

