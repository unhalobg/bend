// @ts-check

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const db = require("../database/db");
const bcrypt = require("bcrypt");
const { timesheetTable } = require("../database/db_table");
//const { connect } = require("./student_application_router");


/* 
$POST => http://localhost:8080/api/v1/timesheet/create
body = {studentId, fieldInstructorId, desc, hours, startDate, endDate}
*/
router.post("/create", async (req, res, next) => {
    var { studentId, fieldInstructorId, desc, hours, startDate, endDate } = req.body;
     
    db.query(`INSERT INTO ${timesheetTable} 
        (studentId, fieldInstructorId, description, hours, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)`,
        [studentId, fieldInstructorId, desc, hours, startDate, endDate],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Successfully stored timesheet entry",
                    data: results,
                });
            }
        });
});

/* 
$POST => http://localhost:8080/api/v1/timesheet/retrieve/instructorid
body = {studentId, fieldInstructorId, desc, hours, startDate, endDate}
*/
router.post("/retrieve/instructorid", async (req, res, next) => {
    var { fieldInstructorId } = req.body;
     
    db.query(`SELECT * FROM ${timesheetTable} WHERE fieldInstructorId = ?`, [fieldInstructorId],
        (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            if (results.length > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully retrieved timesheets",
                    data: results,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "No timesheets found",
                    data: [],
                });
            }  
        }
    });
});

/* 
$POST => http://localhost:8080/api/v1/timesheet/set/status
body = {id, status, message}
*/
router.post("/set/status", async (req, res, next) => {
    var { id, status, message } = req.body;
     
    db.query(`UPDATE ${timesheetTable} SET status = ?, instructorMessage = ? WHERE id = ?`, [status, message, id],
    (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully set timesheet status and message",
                data: results,
            });
        }
    });
});

module.exports = router;