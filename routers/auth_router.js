// @ts-check

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const db = require("../database/db");
const bcrypt = require("bcrypt");
const { userTable, resetPasswordTokenTable } = require("../database/db_table");
const { connect } = require("./student_application_router");

const nodemailer = require("nodemailer");

var SALT = null;
if (process.env.SALT)
{
	 SALT = parseInt(process.env.SALT, 10);
}

/**
 * hashedPassword
 * @param {string} password
 * @returns {Promise} string if successful
 */
const hashedPassword = async (password) => {
    return await bcrypt.hash(password, SALT);
}

/**
 * 
 * @param {string} password password the user entered when trying to login
 * @param {string} hashedPassword password retrieved from the database (already hashed)
 * @returns {Promise} boolean if successful
 */
const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

/**
 * parseToken
 * @param {string} user
 * @returns {Promise} string if successful
 */
const parseToken = async (user) => {
    if (process.env.TOKEN_SECRET)
    {
        const token = await jwt.sign(user, process.env.TOKEN_SECRET);
        return token;
    }
}

// Sends the reset password link to the user's email address.
// Called from router.post("/reset-password-link")
/**
 * sendLink
 * @param {string} email email address to send the link to
 * @param {string} link link containing token to email to the user
 * @returns {Promise} true if successful, null if not
 */
async function sendLink (email, link)
{
	// Check that the NODEMAILER_EMAIL and NODEMAILER_PASSWORD environment variables
	//   are in the '.env' file. If they are, create the transport using gmail as
	//   the service.
	if (process.env.NODEMAILER_EMAIL && process.env.NODEMAILER_PASSWORD)
	{
		 const transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        });
		
		// Create the message
		let message =
		{
			from: process.env.NODEMAILER_EMAIL,
			// Send to the user's email address
			to: email,
			subject: 'UTA Smart Placement Password Reset Link',
			// plain text body
			text: 'A request was made to reset the password of the account associated with this email address for the UTA Smart Placement App.\n\nThe link to reset the password is below. It expires in 15 minutes.\n\n' + link,
			// html body
			html: '<b>A request was made to reset the password of the account associated with this email address for the UTA Smart Placement App.\n\nThe link to reset the password is below. It expires in 15 minutes.<br>' + link + '</b>',
		};
		
		// Send the email
		transporter.sendMail(message, (err, info) =>
		{
			
			if (err)
			{
				console.log('Error occurred while sending email. ' + err.message);
				return null;
			}
			return true;
		});
	}
	
	// If the function hasn't returned true yet, then something went wrong. So
	//   return null.
	return null;
}

/* 
$POST => http://localhost:8080/api/v1/auth/register 
body = {email, password}
*/
router.post("/register", async (req, res, next) => {
    var { id, email, password, role } = req.body;
    email = email.toLowerCase();
    password = await hashedPassword(password);
     
    db.query(`INSERT INTO ${userTable} (id, email, password, role)
     VALUES (?, ?, ?, ?)`, [id, email, password, role], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Registered",
                data: results,
            });
        }
    });
});

/* 
$POST => http://localhost:8080/api/v1/auth/login 
body = {email, password}
*/
router.post("/login", async (req, res, next) => {
    var { email, password } = req.body;
    email = email.toLowerCase();
	
    db.query(`SELECT * FROM ${userTable} WHERE email = ?`, [email],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null,
                });
            } else {
                if (results.length == 0) {
                    return res.status(500).json({
                        error: true,
                        message: "Email or password did not match.",
                        data: null,
                    });
                }
                const result = results[0];
                const isPasswordMatched = await verifyPassword(password, result.password);
                if (!isPasswordMatched) {
                    return res.status(500).json({
                        error: true,
                        message: "Email or password did not match.",
                        data: null,
                    })
                } else {
                    result.password = null;
                    return res.status(200).json({
                        error: false,
                        message: "Successfully Fetched",
                        data: {
                            token: await parseToken({ id: result.id, email: result.email, accessLevel: result.accessLevel, isApproved: result.isApproved }),
                            user: result
                        },
                    });
                }
            }
        });
});


/* (old code from past team)
$POST => http://localhost:8080/api/v1/auth/forgot-password 
body = {email}

router.post("/forgot-password", async (req, res, next) => {
    var { email } = req.body;
    email = email.toLowerCase();

    db.query(`SELECT * FROM ${userTable} WHERE email = ?`, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null,
            })
        } else {
            if (results.length > 0 && results) {

                return res.status(200).json({
                    error: false,
                    message: "Password reset link is sent to your email " + email,
                    data: null,
                })
            } else {
                return res.status(500).json({
                    error: true,
                    message: "Email address not exists",
                    data: null,
                });
            }
        }
    });
});
*/


/* 
$POST => http://localhost:8080/api/v1/auth/update-user
body = {email}
*/
router.post("/update-user", async (req, res, next) => {
    var email = req.body.email;
    email = email.toLowerCase();

    db.query(`SELECT * FROM ${userTable} WHERE email = ?`, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null,
            })
        } else {

            if (results.length == 0) {
                return res.status(500).json({
                    error: true,
                    message: "Email or password did not match.",
                    data: null,
                })
            } else {

                const result = results[0];

                result.password = null;
                return res.status(200).json({
                    error: false,
                    message: "Successfully fetched",
                    data: {
                        token: await parseToken({ id: result.id, email: result.email, accessLevel: result.accessLevel, isApproved: result.isApproved }),
                        user: result
                    },
                });
            }
        }
    });
});

/* 
$POST => http://localhost:8080/api/v1/auth/update-user-status
body = {id, status}
*/
router.post("/update-user-status", async (req, res, next) => {

    db.query(`UPDATE ${userTable} SET status = ? WHERE id = ?`, [req.body.status, req.body.id], async (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null,
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully updated user status",
                data: null,
            });
        }
    });
});

/* 
$POST => http://localhost:8080/api/v1/auth/password
body = {email}
*/
// Used to check if an email address exists in the user table. If
//   it does, it gets the password.
router.post("/password", async (req, res, next) => {
    var { email } = req.body;
    email = email.toLowerCase();

    db.query(`SELECT * FROM ${userTable} WHERE email = ?`, [email],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null,
                });
            } else {
                if (results.length == 0) {
                    return res.status(500).json({
                        error: true,
                        message: "Email not found",
                        data: null,
                    });
                }
                const databasePassword = results[0].password;
                if (!databasePassword) {
                    return res.status(500).json({
                        error: true,
                        message: "Password not found",
                        data: null,
                    })
                } else {
                    return res.status(200).json({
                        error: false,
                        message: "Successly found password",
                        data: {
                            password: databasePassword
                        },
                    });
                }
            }
        });
});

/*
$POST => http://localhost:8080/api/v1/auth/save-reset-password-token
body = { token, email, expirationDate, expirationTime }
*/
// Store the token used for resetting the user's password
router.post("/save-reset-password-token", async (req, res, next) => {
    var { token, email, expirationDate, expirationTime, link } = req.body;
    email = email.toLowerCase();
	
	var queryResults = null;
	
	// First check if an active token already exists for the email address.
	db.query(`SELECT expirationDate, expirationTime FROM ${resetPasswordTokenTable} WHERE email = ?`,
		[email], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: 'Error: Could not establish a connection with the database. Please contact server admins.',
                data: null
            })
        } else {
			queryResults = results;
        }
    });
	
	// If there wasn't a token found in the database for the email address, then create a new one.
	if (!queryResults || (Array.isArray(queryResults) && queryResults.length == 0))
	{
		db.query(`INSERT INTO ${resetPasswordTokenTable} VALUES (?, ?, ?, ?)`, [token, email, expirationDate, expirationTime], (err, results) => {
			if (err) {
				return res.status(500).json({
					error: true,
					message: err.message,
					data: null
				})
			}
		});
		
		// Send the link
		const success = /*await */sendLink(email, link);
		if (!success)
		{
			return res.status(500).json({
				error: true,
				message: 'Error: Could not send email',
				data: null,
			});
		}
		else
		{
			return res.status(200).json({
				error: false,
				message: "Successfully sent link",
				data: true,
			});
		}
	}
	// If there was a token in the database for the email address, check if it's expired.
	else
	{
		const dateTemp = (queryResults[0].expirationDate).substring(0, 4) + '-' + (queryResults[0].expirationDate).substring(5, 7)
			+ '-' + (queryResults[0].expirationDate).substring(8, 10)
					
		const tokenDateTime = dateTemp + 'T' + queryResults[0].expirationTime;
		const currentDate = new Date();
		const storedDate = new Date(tokenDateTime);
		const createNew = currentDate.getTime() > storedDate.getTime();
		
		// Token has expired, so create a new one
		if (createNew)
		{
			// If creating a new token, first delete the old one
			db.query(`DELETE ${resetPasswordTokenTable} WHERE email = ?`,
				[email], (err, results) => {
				if (err) {
					return res.status(500).json({
						error: true,
						message: 'Error: Error deleting old password. Please contact server admins for assistance.',
						data: null
					})
				}
			});
			
			db.query(`INSERT INTO ${resetPasswordTokenTable} VALUES (?, ?, ?, ?)`, [token, email, expirationDate, expirationTime], (err, results) => {
				if (err) {
					return res.status(500).json({
						error: true,
						message: err.message,
						data: null
					})
				}
			});
			
			const success = /*await */sendLink(email, link);
			if (!success)
			{
				return res.status(500).json({
					error: true,
					message: 'Error: Could not send email',
					data: null,
				});
			}
			else
			{
				return res.status(200).json({
					error: false,
					message: "Successfully sent link",
					data: true,
				});
			}
		}
		// If it hasn't expired, don't create a new one or send an email (to prevent spam)
		else
		{
			return res.status(200).json({
				error: false,
				message: "Email has already been sent",
				data: true,
			});
		}
	}
});

/*
$POST => http://localhost:8080/api/v1/auth/get-reset-password-token
body = { email }
*/
// Used to get the email address, expiration date, and expiration time associated with
// a reset password token
router.post("/get-reset-password-token", async (req, res, next) => {
    var { token } = req.body;

    db.query(`SELECT * FROM ${resetPasswordTokenTable} WHERE token = (?)`, [token],
        async (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null,
                });
            } else {
                if (results.length == 0) {
                    return res.status(500).json({
                        error: true,
                        message: "Token not found",
                        data: null,
                    });
                } else {
					const databaseEmail = results[0].email;
					const databaseExpirationDate = results[0].expirationDate;
					const databaseExpirationTime = results[0].expirationTime;
					if (!databaseEmail || !databaseExpirationDate || !databaseExpirationTime)
					{
						return res.status(500).json({
							error: true,
							message: "Token found but not email, expirationDate, and expirationTime",
							data: null,
						})
					}
					else
					{
						return res.status(200).json({
							error: false,
							message: "Successly retrieved token",
							data: {
								email: databaseEmail,
								expirationDate: databaseExpirationDate,
								expirationTime: databaseExpirationTime
							},
						});
					}
				}
            }
        });
});

/* 
$POST => http://localhost:8080/api/v1/auth/change-password
body = { email }
*/
// Used to change the password of a user, given their email address and new password
router.post("/change-password", async (req, res) =>
{
    var { email, password } = req.body;
    email = email.toLowerCase();
	password = await hashedPassword(password);
    db.query(`UPDATE ${userTable} SET password = ? WHERE email = ?`, [password, email],
        async (err, results) =>
	{
        if (err)
		{
            return res.status(500).json(
			{
                error: true,
                message: err.message,
                data: null,
            });
        }
		else
		{
            return res.status(200).json(
			{
                error: false,
                message: "Successfully updated password",
                data: null,
            });
        }
    });
});

/* 
$POST => http://localhost:8080/api/v1/auth/id-search
body = { id }
*/
// Check if an account already exists with a certain id and return the email
//   address if it does
router.post("/id-search", async (req, res) =>
{
    var { id } = req.body;
    db.query(`SELECT * FROM ${userTable} WHERE id = ?`, [id], async (err, results) =>
	{
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null,
            });
        } else {
            if (results.length == 0) {
                return res.status(200).json({
                    error: false,
                    message: "Account not found",
                    data: {
                        email: false
                    },
                });
            }
			else
			{
				return res.status(200).json({
					error: false,
					message: "Account found",
					data: {
						email: results[0].email,
					},
				});
			}
        }
    });
});

/* 
$POST => http://localhost:8080/api/v1/auth/email-search
body = { email }
*/
// Check if an account already exists with a certain email and return the id
//   address if it does
router.post("/email-search", async (req, res) =>
{
    var { email } = req.body;
    db.query(`SELECT * FROM ${userTable} WHERE email = ?`, [email], async (err, results) =>
	{
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null,
            });
        } else {
            if (results.length == 0) {
                return res.status(200).json({
                    error: false,
                    message: "Account not found",
                    data: {
                        id: false
                    },
                });
            }
			else
			{
				return res.status(200).json({
					error: false,
					message: "Account found",
					data: {
						id: results[0].id,
					},
				});
			}
        }
    });
});

module.exports = router;