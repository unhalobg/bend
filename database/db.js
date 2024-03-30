// @ts-check

const mysql = require("mysql");

/**
 * db : connection to the external sql database
 * @type {mysql.Pool}
 */
var db = mysql.createPool({
	// use whatever values chose when creating your local database (can create it using MySQL Workbench)
	host: 'localhost',
	user: 'root',
	password: 'root',  
	database: 'smart_placement',
	connectionLimit: 50,
	multipleStatements: true,
	ssl: true

	/*
	change to this when the app switches to a non-local database (and update '.env' with the correct values)
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	connectionLimit: 50,
	multipleStatements: true,
	ssl: true
	*/
});


module.exports = db;
