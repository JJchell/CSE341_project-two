const express = require('express')
const {Pool} = require('pg')
const path = require('path')
const PORT = process.env.PORT || 5000
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const connectionString = process.env.DATABASE_URL || 'postgres://mmrnjisxpymnsx:217743defcce5ccbdfeae2a390e7149a335d1124bf4b71cba328a1593a0278f3@ec2-18-214-211-47.compute-1.amazonaws.com:5432/ddefaiklf4d1f?ssl=true' 
const pool = new Pool({connectionString: connectionString});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/info', queryInfo)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


function queryInfo(request, response) {
	// First get the person's id
	// const id = request.query.id;
const id=0;
	// TODO: We should really check here for a valid id before continuing on...

	// use a helper function to query the DB, and provide a callback for when it's done
	getPersonFromDb(id, function(error, result) {
		// This is the callback function that will be called when the DB is done.
		// The job here is just to send it back.

		// Make sure we got a row with the person, then prepare JSON to send back
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
function getPersonFromDb(id, callback) {
	console.log("Getting person from DB with id: " + id);

	// Set up the SQL that we will use for our query. Note that we can make
	// use of parameter placeholders just like with PHP's PDO.
	const sql = "SELECT * FROM player";

	// We now set up an array of all the parameters we will pass to fill the
	// placeholder spots we left in the query.
	const params = [id];

	// This runs the query, and then calls the provided anonymous callback function
  // with the results.
  // the second pramitor is params
	pool.query(sql, function(err, result) {
		// If an error occurred...
		if (err) {
			console.log("Error in query: ")
			console.log(err);
			callback(err, null);
		}

		// Log this to the console for debugging purposes.
		console.log("Found result: " + JSON.stringify(result.rows));


		// When someone else called this function, they supplied the function
		// they wanted called when we were all done. Call that function now
		// and pass it the results.

		// (The first parameter is the error variable, so we will pass null.)
		callback(null, result.rows);
	});

} // end of getPersonFromDb
