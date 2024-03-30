// @ts-check

const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { fieldInstructorTable, notificationsTable } = require("../database/db_table");

/*
Retrieve all notifications for user by using userId
$POST => http://localhost:8080/api/v1/field-instructor/create
body => { userId }
*/
router.post("/retrieve/all", async (req, res, next) => {
    /**
     * @type {{firstName: string, middleName: string, lastName: string, email: string, phone: string, resumeLink: string}}
     */
    var { firstName, middleName, lastName, email, phone, resumeLink } = req.body;

    db.query(`INSERT INTO ${fieldInstructorTable} (firstName, middleName, lastName, email, phone, resumeLink)
     VALUES (?, ?, ?, ?, ?, ?)`, [firstName, middleName, lastName, email, phone, resumeLink], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Created New Field Instructor",
                data: results,
            });
        }
    });
});


/*
Retrieve all notifications for user by using userId
$POST => http://localhost:8080/api/v1/notifications/retrieve/all
body => { userId }
*/
router.post("/retrieve/all", async (req, res, next) => {
    /**
     * userId
     * @type {number}
     */
    var userId = req.body.userId
    db.query(`SELECT * FROM ${notificationsTable} WHERE userId = ${userId}`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully fetched all notifications",
                data: results,
            });
        }
    });
});



module.exports = router;