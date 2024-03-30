// @ts-check

const express = require("express")
const router = express.Router()

const db = require("../database/db");
const { agencyStudentRequestApplicationTable } = require("../database/db_table");

/* 
Create new student request placement form for agency
$POST => http://localhost:8080/api/v1/application/agency/student/create
body => { agencyId, email, ein, degreeLevel, numberOfVacancy, requirements, immunizationRequirements, otherReports }
*/
router.post("/create", async (req, res) => {
    const { agencyId, email, ein, degreeLevel, numberOfVacancy, requirements, immunizationRequirements, otherReports } = req.body
    db.query(`INSERT INTO ${agencyStudentRequestApplicationTable} ( agencyId, email, ein, degreeLevel, numberOfVacancy, requirements, immunizationRequirements, otherReports )
        VALUES ('${agencyId}', '${email}', '${ein}', '${degreeLevel}', '${numberOfVacancy}', '${requirements}', '${JSON.stringify(immunizationRequirements)}', '${JSON.stringify(otherReports)}')`,
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
                    message: "Successfully Submitted Agency Student Application Request",
                    data: results,
                });
            }
        });
});

/* 
Retrieve student request placement form by form Id
$POST => http://localhost:8080/api/v1/application/agency/student/retrieve/formid
body => { formId }
*/
router.post("/retrieve/formid", async (req, res) => {
    /**
     * formId @type {int}
     */
    const formId = req.body.formId;

    db.query(`SELECT * FROM ${agencyStudentRequestApplicationTable} WHERE formId = ? `, [formId], (err, results) => {
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
                    message: "Successfully Fetched Agency Student Request Application Form",
                    data: results[0],
                })
            } else {
                return res.status(500).json({
                    error: true,
                    message: "Cannot find any application form for this agency",
                    data: null
                });
            }
        }
    });
});

/* 
Retrieve All  student request placement form for logged in agency by using agency Id
$POST => http://localhost:8080/api/v1/application/agency/student/retrieve/all
body => {}
*/
router.post("/retrieve/all", async (req, res) => {
    /**
     * agencyId @type {int}
     */
    const agencyId = req.body.agencyId;  // changed from payload to body

    db.query(`SELECT * FROM ${agencyStudentRequestApplicationTable} WHERE agencyId = ? `, [agencyId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Fetched Agency Student Request Application Form for agency " + agencyId,
                data: results,
            });
        }
    });
});

/* 
Retrieve all placement request forms created by agencies that still have vacancies
$POST => http://localhost:8080/api/v1/application/agency/student/admin/retrieve/all
body => {}
*/
router.post("/admin/retrieve/all", async (req, res) => {

    db.query(`SELECT * FROM ${agencyStudentRequestApplicationTable} WHERE numberOfVacancy > 0 `, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully fetched placement request forms with more than 0 vacancies",
                data: results,
            });
        }
    });
});

/* 
Update number of vacancy of an agency's student placement application form using form Id
$POST => http://localhost:8080/api/v1/application/agency/student/update/vacancy
body = { formId, numberOfVacancy }
*/
router.post("/update/vacancy", async (req, res) => {
    const formId = req.body.formId
    const numberOfVacancy = req.body.numberOfVacancy
    db.query(`UPDATE ${agencyStudentRequestApplicationTable} SET numberOfVacancy = ? WHERE formId = ?`,
        [numberOfVacancy, formId], (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Successfully Updated Agency Application Number of Vacancy to " + numberOfVacancy,
                    data: results,
                })
            }
        })
})


module.exports = router;