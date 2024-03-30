// @ts-check

const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { studentApplicationTable } = require("../database/db_table");


/* 
Create student request application form
$POST => http://localhost:8080/api/v1/application/student/create
body = { studentId, title, firstName, middleName, lastName, email, phone, mobile,
        degreeLevel, agencyTypeOne, agencyTypeTwo, agencyTypeThree, mailingAddress, prefferedContacts }
*/
router.post("/create", async (req, res) => {
    const { studentId, title, firstName, middleName, lastName, email, phone, mobile,
        degreeLevel, agencyTypeOne, agencyTypeTwo, agencyTypeThree, mailingAddress, prefferedContacts } = req.body

    db.query(`INSERT INTO ${studentApplicationTable} 
    (studentId, title, firstName, middleName, lastName, email, phone, mobile,
        degreeLevel, agencyTypeOne, agencyTypeTwo, agencyTypeThree, mailingAddress, prefferedContacts ) VALUES 
    ('${studentId}', '${title}', '${firstName}', '${middleName}', '${lastName}', '${email}', '${phone}', '${mobile}', '${degreeLevel}', 
    '${agencyTypeOne}', '${agencyTypeTwo}', '${agencyTypeThree}', '${JSON.stringify(mailingAddress)}', '${JSON.stringify(prefferedContacts)}' )`,
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
                    message: "Successfully Submitted Student Application Request",
                    data: results,
                })
            }
        })
})

/* 
Update status of student application form using form Id
$POST => http://localhost:8080/api/v1/application/student/update
body = { formId, status }
*/
router.post("/update", async (req, res) => {
    const formId = req.body.formId
    const status = req.body.status
    db.query(`UPDATE ${studentApplicationTable} SET applicationStatus = ? WHERE formId = ?`,
        [status, formId], (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Successfully Updated Agency Application Request Status to " + status,
                    data: results,
                })
            }
        })
})

/* 
Retrieve student application form by form Id
$POST => http://localhost:8080/api/v1/application/student/retrieve/formid
body => { formId }
*/
router.post("/retrieve/formid", async (req, res) => {
    const formId = req.body.formId
    db.query(`SELECT * FROM ${studentApplicationTable} WHERE formId = ?`, [formId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            if (results.length > 0 && results) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully Fetched Student Application Form",
                    data: results[0],
                })
            } else {
                return res.status(500).json({
                    error: true,
                    message: "Cannot find any application form for this agency",
                    data: null
                })
            }
        }
    })
})

/* 
Retrieve student application form for logged in student using student Id
$POST => http://localhost:8080/api/v1/application/student/retrieve
body => {}
*/
router.post("/retrieve", async (req, res) => {
    const studentId = req.payload.id  // might need to change from payload to body
    db.query(`SELECT * FROM ${studentApplicationTable} WHERE studentId = ?`, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            if (results && results.length > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully Fetched Student Application Form",
                    data: results[0],
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Cannot find any application form for this student",
                    data: null
                })
            }
        }
    })
})

/* 
Retrieve all student request applications forms
$POST => http://localhost:8080/api/v1/application/student/retrieve/all
body => {}
*/
router.post("/retrieve/all", async (req, res) => {
    db.query(`SELECT * FROM ${studentApplicationTable}`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Fetched All Student Application Form",
                data: results,
            })
        }
    })
})

/* 
Retrieve student request applications form using student Id
$POST => http://localhost:8080/api/v1/application/student/retrieve/studentid
body => { studentId }
*/
router.post("/retrieve/studentid", async (req, res) => {
    const { studentId } = req.body

    db.query(`SELECT * FROM ${studentApplicationTable} WHERE studentId = ?`, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            if (results.length > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully Fetched Student Application Form",
                    data: results[0],
                })
            } else {
                return res.status(500).json({
                    error: true,
                    message: "Cannot find any application form for this student",
                    data: null
                })
            }
        }
    })
})




module.exports = router;