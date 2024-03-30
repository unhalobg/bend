// @ts-check
// TODO: Still need to link this with the front end... and make a database for this
const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { learningContractTable } = require("../database/db_table");

/* 
Create a new document
$POST =>  http://localhost:8080/api/v1/learning_contract/create
body = { studentId, learningContractName, learningContractData }
*/
router.post("/create", async (req, res) => {
    const { studentId, learningContractName, learningContractData } = req.body;
    db.query(`INSERT INTO ${learningContractTable} (studentId, learningContractName, learningContractData)
    	VALUES (?, ?, ?)`, [studentId, learningContractName, learningContractData], (err, results) => {
    	//VALUES (?, ?, '${learningContractData}')`, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully uploaded learning contract",
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

    db.query(`SELECT * FROM ${learningContractTable} WHERE studentId = ?`, [studentId], (err, results) => {
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
					message: "Successfully retrieved Learning Contract",
					data: results,
				});
			} else {
				return res.status(200).json({
					error: false,
					message: "No Learning Contract found",
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
/* router.post("/update", async (req, res) => {
    const { id, studentId, learningContractName, learningContractData } = req.body

    db.query(`UPDATE ${learningContractTable} SET studentId = ?, learningContractName = ?, learningContractData = ?,
		WHERE id = ?`, [learningContractName, learningContractData, id], (err, results) => {
		if (err) {
			return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
			return res.status(200).json({
				error: false,
				message: "Successfully updated Learning Contract Data",
				data: results,
			});
        }
    })
}) */

router.post("/update", async (req, res) => {
    const { studentId, learningContractName, learningContractData } = req.body;

    db.query(`UPDATE ${learningContractTable} SET learningContractName = ?, learningContractData = ? WHERE studentId = ?`, 
    [learningContractName, learningContractData, studentId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            if (results.affectedRows === 0) {
                return res.status(400).json({
                    error: true,
                    message: "No learning contract exists with the provided studentId",
                    data: null
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Successfully updated Learning Contract Data",
                    data: results,
                });
            }
        }
    });
});



/* 
Delete a document by its ID
$POST =>  http://localhost:8080/api/v1/document/delete
body = { id }
*/
router.post("/delete", async (req, res) => {
    const { id } = req.body

    db.query(`DELETE FROM ${learningContractTable} WHERE id = ?`,
		// @ts-ignore
		[learningContractName, learningContractData, id], (err, results) => {
		if (err) {
			return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
			return res.status(200).json({
				error: false,
				message: "Successfully deleted Learning Contract",
				data: results,
			});
        }
    })
})

module.exports = router;