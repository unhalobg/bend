const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { agencyApplicationTable } = require("../database/db_table");

/* 
Create new agency request application form
$POST => http://localhost:8080/api/v1/application/agency/create
body => { agencyId, ein, name, type, email, phone, fax, website, businessAddress, mailingAddress, prefferedContacts, agentTitle, agentFirstName, agentMiddleName, agentLastName, agentPhone, agentEmail }
*/
router.post("/create", async (req, res) => {
    const { agencyId, ein, name, type, email, phone, fax, website, businessAddress, mailingAddress, prefferedContacts, agentTitle, agentFirstName, agentMiddleName, agentLastName, agentPhone, agentEmail } = req.body

    db.query(`INSERT INTO ${agencyApplicationTable} 
    (agencyId, ein, name, type, email, phone, fax, website, businessAddress, mailingAddress, prefferedContacts, agentTitle, agentFirstName, agentMiddleName, agentLastName, agentPhone, agentEmail ) VALUES 
    (${agencyId}, ${ein}, '${name}', '${type}', '${email}', '${phone}', '${fax}', '${website}', '${JSON.stringify(businessAddress)}', '${JSON.stringify(mailingAddress)}', 
    '${JSON.stringify(prefferedContacts)}', '${agentTitle}', '${agentFirstName}', '${agentMiddleName}', '${agentLastName}', '${agentPhone}', '${agentEmail}' )`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Submitted Agency Application Request",
                data: results,
            });
        }
    });
});

/* 
Update the status of the Agency Request Form Application
$POST => http://localhost:8080/api/v1/application/agency/update
body => { status, formId }
*/
router.post("/update", async (req, res) => {
    const formId = req.body.formId
    const status = req.body.status
    db.query(`UPDATE ${agencyApplicationTable} SET applicationStatus = ? WHERE formId = ?`,
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
                });
            }
        });
});

/* 
Retrieve agency request application form by form Id
$POST => http://localhost:8080/api/v1/application/agency/retrieve/formid
body => {formId}
*/
router.post("/retrieve/formid", async (req, res) => {
    const formId = req.body.formId
    db.query(`SELECT * FROM ${agencyApplicationTable} WHERE formId = ?`, [formId], (err, results) => {
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
                    message: "Successfully Fetched Agency Application Form",
                    data: results[0],
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Cannot find any application form for this agency",
                    data: null
                });
            }
        }
    });
});

/* 
Retrieve agency application request form for logged in agency by using agency ID
$POST => http://localhost:8080/api/v1/application/agency/retrieve
body => { id }
*/
router.post("/retrieve", async (req, res) => {
    const agencyId = req.payload.id
    db.query(`SELECT * FROM ${agencyApplicationTable} WHERE agencyId = ?`, [agencyId], (err, results) => {
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
                    message: "Successfully Fetched Agency Application Form",
                    data: results[0],
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Cannot find any application form for this agency",
                    data: null
                });
            }
        }
    });
});


/* 
Retrieve all agency application request forms
$POST => http://localhost:8080/api/v1/application/agency/retrieve/all
body => {}
*/
router.post("/retrieve/all", async (req, res) => {
    db.query(`SELECT * FROM ${agencyApplicationTable}`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Fetched All Agency Application Form",
                data: results,
            })
        }
    })
})

/* 
Retreive agency application request form by agencyId
$POST => http://localhost:8080/api/v1/application/agency/retrieve/agencyid
body => {agencyId}
*/
router.post("/retrieve/agencyid", async (req, res) => {
    const agencyId = req.body.agencyId;
    db.query(`SELECT * FROM ${agencyApplicationTable} WHERE agencyId = ?`, [agencyId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            if (results && results.length > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully Fetched Agency Application Form",
                    data: results[0],
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Cannot find any application form for this agency",
                    data: null
                });
            }
        }
    });
});

/* 
Retreive agency application request form by agencyId
$POST => http://localhost:8080/api/v1/application/agency/retrieve/approved
body => {agencyId}
*/
router.post("/retrieve/approved", async (req, res) =>
{
    db.query(`SELECT * FROM ${agencyApplicationTable} WHERE applicationStatus = 'approved'`, async (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null,
            });
        } else {
			if (results.length > 0) {
				return res.status(200).json({
					error: false,
					message: "Successfully retrieved approved agency applications",
					data: results
				});
			} else {
				return res.status(200).json({
					error: false,
					message: "No approved agency applications yet",
					data: []
				});
			}
        }
    });
});

module.exports = router;