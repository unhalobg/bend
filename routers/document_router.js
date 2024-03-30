// @ts-check

const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { documentTable } = require("../database/db_table");

/* 
Create a new document
$POST =>  http://localhost:8080/api/v1/document/create
body = { studentId, documentName, documentData }
*/
router.post("/create", async (req, res) => {
    const { studentId, documentName, documentData } = req.body;
    db.query(`INSERT INTO ${documentTable} (studentId, documentName, documentData)
    	VALUES (?, ?, ?)`, [studentId, documentName, documentData], (err, results) => {
    	//VALUES (?, ?, '${documentData}')`, [studentId, documentName], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully created document",
                data: true,
            });
        }
    })
})

/* 
Retrieve all documents belonging to a specific student
$POST =>  http://localhost:8080/api/v1/document/retrieve/studentid
body = { studentId }
*/
router.post("/retrieve/studentid", async (req, res) => {
    const { studentId } = req.body;

    db.query(`SELECT * FROM ${documentTable} WHERE studentId = ?`, [studentId], (err, results) => {
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
					message: "Successfully retrieved documents",
					data: results,
				});
			} else {
				return res.status(200).json({
					error: false,
					message: "No documents found",
					data: [],
				});
			}
        }
    })
})

/* 
Update a document's studentId, name and data by its ID (when called, can just
   pass in the same arguments for the columns you don't want to change)
$POST =>  http://localhost:8080/api/v1/document/update
body = { id, studentId, documentName, documentData }
*/
router.post("/update", async (req, res) => {
    const { id, studentId, documentName, documentData } = req.body

    db.query(`UPDATE ${documentTable} SET studentId = ?, documentName = ?, documentData = ?,
		WHERE id = ?`, [documentName, documentData, id], (err, results) => {
		if (err) {
			return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
			return res.status(200).json({
				error: false,
				message: "Successfully updated document",
				data: results,
			});
        }
    })
})

/* 
Delete a document by its ID
$POST =>  http://localhost:8080/api/v1/document/delete
body = { id }
*/
router.post("/delete", async (req, res) => {
    const { id } = req.body

    db.query(`DELETE FROM ${documentTable} WHERE id = ?`,
		// @ts-ignore
		[documentName, documentData, id], (err, results) => {
		if (err) {
			return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
			return res.status(200).json({
				error: false,
				message: "Successfully updated document",
				data: results,
			});
        }
    })
})

module.exports = router;