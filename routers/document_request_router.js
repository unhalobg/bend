// @ts-check

const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { documentRequestTable } = require("../database/db_table");

/* 
Create a new document request
$POST =>  http://localhost:8080/api/v1/document/request/create
body = { agencyId, studentId, documentName  }
*/
router.post("/create", async (req, res) => {
    const { agencyId, studentId, documentName } = req.body
    db.query(`INSERT INTO ${documentRequestTable} (agencyId, studentId, documentName)
		VALUES (?, ?, ?)`, [agencyId, studentId, documentName], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully created document request",
                data: true,
            })
        }
    })
})

/* 
Retrieve all document requests to a specific student
$POST =>  http://localhost:8080/api/v1/document/request/retrieve/studentid
body = { studentId }
*/
router.post("/retrieve/studentid", async (req, res) => {
    const { studentId } = req.body;

    db.query(`SELECT * FROM ${documentRequestTable} WHERE studentId = ?`, [studentId], (err, results) => {
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
                    message: "Successfully retrieved document requests for student " + studentId.toString(),
                    data: results,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "No requests found",
                    data: [],
                });
            }
        }
    })
})

module.exports = router