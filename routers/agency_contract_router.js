// @ts-check
// TODO: Modify to be the agency contract
const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { agencyContractTable } = require("../database/db_table");

/* 
Create a new document
$POST =>  http://localhost:8080/api/v1/learning_contract/create
body = { studentId, learningContractName, learningContractData }
*/
router.post("/create", async (req, res) => {
    const { agencyId, agencyContractName, agencyContractData } = req.body;
    db.query(`INSERT INTO ${agencyContractTable} (agencyId, agencyContractName, agencyContractData)
    	VALUES (?, ?, ?)`, [agencyId, agencyContractName, agencyContractData], (err, results) => {
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
                message: "Successfully uploaded agency contract",
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
router.post("/retrieve/agencyid", async (req, res) => {
    const { agencyId } = req.body;

    db.query(`SELECT * FROM ${agencyContractTable} WHERE agencyId = ?`, [agencyId], (err, results) => {
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
					message: "Successfully retrieved Agency Contract",
					data: results,
				});
			} else {
				return res.status(200).json({
					error: false,
					message: "No Agency Contract found",
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
// router.post("/update", async (req, res) => {
//     const { id, agencyId, agencyContractName, agencyContractData } = req.body

//     db.query(`UPDATE ${agencyContractTable} SET agencyId = ?, agencyContractName = ?, agencyContractData = ?,
// 		WHERE id = ?`, [agencyContractName, agencyContractData, id], (err, results) => {
// 		if (err) {
// 			return res.status(500).json({
//                 error: true,
//                 message: err.message,
//                 data: null
//             });
//         } else {
// 			return res.status(200).json({
// 				error: false,
// 				message: "Successfully updated Agency Contract Data",
// 				data: results,
// 			});
//         }
//     })
// })

router.post("/update", async (req, res) => {
    const { agencyId, agencyContractName, agencyContractData } = req.body

    db.query(`UPDATE ${agencyContractTable} SET agencyContractName = ?, agencyContractData = ? WHERE agencyId = ?`, 
    [agencyContractName, agencyContractData, agencyId], 
    (err, results) => {
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
                    message: "No agency contract exists with the provided agencyId",
                    data: null
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Successfully updated Agency Contract Data",
                    data: results,
                });
            }
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

    db.query(`DELETE FROM ${agencyContractTable} WHERE id = ?`,
		// @ts-ignore
		[agencyContractName, agencyContractData, id], (err, results) => {
		if (err) {
			return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
			return res.status(200).json({
				error: false,
				message: "Successfully deleted Agency Contract",
				data: results,
			});
        }
    })
})

module.exports = router;