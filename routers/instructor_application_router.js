const express = require("express");
const router = express.Router();


const db = require("../database/db");
const { userTable, instructorApplicationTable } = require("../database/db_table");

/* 
Create new instructor application
$POST => http://localhost:8080/api/v1/application/instructor/create
body => { instructorId, agencyId, agencyName }
*/
router.post("/create", async (req, res) => {
    const { instructorId, agencyId, agencyName, firstName, middleName, lastName, email, phone, mobile } = req.body;
    db.query(`INSERT INTO ${instructorApplicationTable} (instructorId, agencyId, agencyName, firstName, middleName, lastName, email, phone, mobile)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [instructorId, agencyId, agencyName, firstName, middleName, lastName, email, phone, mobile ], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully created instructor application",
                data: results,
            });
        }
    });
});

/* 
Update the status of the an application
$POST => http://localhost:8080/api/v1/application/instructor/update
body => { formId, status, message }
*/
router.post("/update", async (req, res) => {
    const formId = req.body.formId;
    const status = req.body.status;
    const message = req.body.message;
    db.query(`UPDATE ${instructorApplicationTable} SET status = ?, agencyMessage = ? WHERE formId = ?`,
        [status, message, formId], (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Successfully Updated Instructor Application Request Status to " + status,
                    data: results,
                });
            }
        });
});

/* 
Retrieve instructor applications by form ID
$POST => http://localhost:8080/api/v1/application/instructor/retrieve/formid
body => { formId }
*/
router.post("/retrieve/formid", async (req, res) => {
    const formId = req.body.formId
    db.query(`SELECT * FROM ${instructorApplicationTable} WHERE formId = ?`, [formId], (err, results) => {
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
                    message: "Successfully Fetched Instructor Application Form",
                    data: results[0],
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Cannot find any application form for this instructor",
                    data: null
                });
            }
        }
    });
});

/* 
Retrieve instructor application request form for logged in instructor by using agency Id
$POST => http://localhost:8080/api/v1/application/instructor/retrieve/instructorid
body => { instructorId }
*/
router.post("/retrieve/instructorid", async (req, res) => {
    const instructorId = req.body.instructorId;
    db.query(`SELECT * FROM ${instructorApplicationTable} WHERE instructorId = ?`, [instructorId], (err, results) => {
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
					message: "Successfully fetched instructor application by instructor ID",
					data: results[0],
				});
			} else {
				return res.status(200).json({
					error: false,
					message: "Instructor application not found",
					data: null,
				});
			}
        }
    });
});


/* 
Retrieve all instructor application request forms
$POST => http://localhost:8080/api/v1/application/instructor/retrieve/all
body => { }
*/
router.post("/retrieve/all", async (req, res) => {
    db.query(`SELECT * FROM ${instructorApplicationTable}`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Fetched All Instructor Applications",
                data: results,
            })
        }
    })
})

/* 
Retreive all field instructors applications to a specific agency
$POST => http://localhost:8080/api/v1/application/instructor/retrieve/agencyid
body => { agencyId }
*/
router.post("/retrieve/agencyid", async (req, res) => {
    const agencyId = req.body.agencyId;
    db.query(`SELECT * FROM ${instructorApplicationTable} WHERE agencyId = ?`,
        [agencyId], (err, results) => {
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
					message: "Successfully retrieved instructor applications to agency with id " + agencyId,
					data: results,
				});
			} else {
				return res.status(200).json({
					error: false,
					message: "Could not find any instructor applications to agency with id " + agencyId,
					data: [],
				});
			} 
        }
    });
});

module.exports = router;