var mysql  = require('mysql');

function createDBConnection(){
		return mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'gabriel00',
			database: 'nodejs2'
		});
}

module.exports = function() {
	return createDBConnection;
}
