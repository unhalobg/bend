// @ts-check

const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { agencyStudentRequestApplicationTable, agencyApplicationTable, placementsTable, studentApplicationTable } = require("../database/db_table");


/* 
Retrieve all best possible matching agency for student
$POST =>  http://localhost:8080/api/v1/placement/retrieve/all
body = { agencyTypeOne, agencyTypeTwo, agencyTypeThree, degreeLevel }
*/
router.post("/retrieve/all", async (req, res) => {
    const { agencyTypeOne, agencyTypeTwo, agencyTypeThree, degreeLevel } = req.body;

    db.query(`SELECT a.formId, b.formId as agencyFormId, a.numberOfVacancy, b.agencyId, b.type, b.name, b.ein, b.businessAddress 
    FROM ${agencyStudentRequestApplicationTable} a, ${agencyApplicationTable} b
    WHERE a.numberOfVacancy > 0 AND 
    b.agencyId = a.agencyId AND (b.type = '${agencyTypeOne}' OR b.type = '${agencyTypeTwo}' OR b.type = '${agencyTypeThree}') AND (a.degreeLevel = "any" OR a.degreeLevel = '${degreeLevel}')
    ORDER by a.numberOfVacancy`,
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: err.message,
                    data: null
                });
            } else {
                var items = results.map(item => Object.assign({}, item))
                items.filter((item) => item.type == agencyTypeOne)
                items.filter((item) => item.type == agencyTypeTwo)
                items.filter((item) => item.type == agencyTypeThree)

                if (items.length == 0) {
                    return db.query(`SELECT a.formId, b.formId as agencyFormId, a.numberOfVacancy, b.agencyId, b.type, b.name, b.ein, b.businessAddress FROM ${agencyStudentRequestApplicationTable} a, ${agencyApplicationTable} b
                    WHERE a.numberOfVacancy > 0 AND b.agencyId = a.agencyId ORDER by a.numberOfVacancy`, (err, results) => {
                        if (err) {
                            return res.status(500).json({
                                error: true,
                                message: err.message,
                                data: null
                            });
                        } else {
                            return res.status(200).json({
                                error: false,
                                message: "Successfully Updated Matchings",
                                data: results,
                            });
                        }
                    })
                } else {
                    return res.status(200).json({
                        error: false,
                        message: "Successfully Updated Matchings",
                        data: items,
                    });
                }
            }
        })
})

/* 
Create a new placement for the student
$POST =>  http://localhost:8080/api/v1/placement/create
body = { formId, agencyId, studentId  }
*/
router.post("/create", async (req, res) => {
    const { formId, agencyId, studentId } = req.body;
    const fieldInstructorId = null;
    db.query(`INSERT INTO ${placementsTable} 
    (formId, agencyId, studentId, fieldInstructorId ) VALUES 
    (${formId}, ${agencyId}, ${studentId}, ${fieldInstructorId} )`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Submitted Agency Application Request",
                data: results,
            });
        }
    })
})

/* 
Retrieve placement for the student using student Id
$POST =>  http://localhost:8080/api/v1/placement/retrieve/studentid
body = { studentId }
*/
router.post("/retrieve/studentid", async (req, res) => {
    const { studentId } = req.body
    db.query(`SELECT * FROM ${placementsTable} WHERE studentId = ?`, [studentId], (err, results) => {
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
                    message: "Successfully fetched placment for given student",
                    data: results[0],
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "No placement found for given student",
                    data: [],
                });
            }
        }
    })
})

/* 
Retrieve agency detail, placement detail using placement id
$POST =>  http://localhost:8080/api/v1/placement/retrieve/placementid
body = { placementId }
*/
router.post("/retrieve/placementid", async (req, res, next) => {
    var placementId = req.body.placementId;

    db.query(`SELECT a.agencyId, a.name as agencyName, a.email as agencyEmail, a.type as agencyType, a.phone as agencyPhone, a.businessAddress as agencyAddress,
    c.degreeLevel, c.numberOfVacancy, c.immunizationRequirements, c.otherReports, b.createdAt
    FROM ${agencyApplicationTable} a, ${placementsTable} b, ${agencyStudentRequestApplicationTable} c
    WHERE b.id = ${placementId} and b.agencyId = a.agencyId and c.formId = b.formId`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                // It said cannot find name 'id', so I changed it to placementId
                message: "Successfully Fetched Placement for " + placementId, 
                data: results.length > 0 ? results[0] : [],
            });
        }
    })
})

/* 
Retrieve the students placed by the placement form id
$POST =>  http://localhost:8080/api/v1/placement/retrieve/students/formid
body = { formId }
*/
router.post("/retrieve/students/formid", async (req, res, next) => {
    var formId = req.body.formId
    db.query(`SELECT a.studentId, a.email, a.firstName, a.lastName, a.mailingAddress, b.createdAt
    FROM ${studentApplicationTable} a, ${placementsTable} b
    WHERE b.formId = ${formId} and a.studentId = b.studentId`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully fetched list of students for form number " + formId,
                data: results,
            });
        }
    })
})

/* 
Retrieve the row in the agency_application table given the agency's id
$POST =>  http://localhost:8080/api/v1/placement/retrieve/agency/agencyid
body = { agencyId }
*/
router.post("/retrieve/agency/agencyid", async (req, res, next) => {
    var agencyId = req.body.agencyId;
    db.query(`SELECT * FROM ${agencyApplicationTable} WHERE agencyId = ?`, [agencyId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully fetched agency given ID " + agencyId,
                data: results,
            })
        }
    })
})

/* 
Retrieve student information of every student placed in the given agency
$POST =>  http://localhost:8080/api/v1/placement/retrieve/student/agencyid
body = { agencyId }
*/
router.post("/retrieve/student/agencyid", async (req, res, next) => {
    const agencyId = req.body.agencyId;
    db.query(`SELECT s.studentId, s.title, s.firstName, s.middleName, s.lastName, s.degreeLevel, s.email,
        s.phone, s.mobile, s.mailingAddress, p.fieldInstructorId FROM ${placementsTable} p, 
        ${studentApplicationTable} s WHERE p.agencyId = ? AND p.studentId = s.studentId`, 
        [agencyId], (err, results) => {
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
                    message: "Successfully fetched students placed with " + agencyId,
                    data: results,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "Successfully fetched students placed with " + agencyId,
                    data: [],
                });
            }
        }
    })
})

/* 
Retrieve all placements using a specific field instructor ID
$POST =>  http://localhost:8080/api/v1/placement/retrieve/instructorid
body = { instructorId }
*/
router.post("/retrieve/instructorid", async (req, res, next) => {
    var instructorId = req.body.instructorId;

    db.query(`SELECT * FROM ${placementsTable} WHERE fieldInstructorId = ?`, [instructorId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully fetched placements for instructor ID " + instructorId, 
                data: results.length > 0 ? results : [],
            });
        }
    })
})

/* 
Set the field instructor ID of the placement containing a specific student ID
$POST =>  http://localhost:8080/api/v1/placement/set/instructorid
body = { instructorId, studentId }
*/
router.post("/set/instructorid", async (req, res, next) => {
    const instructorId = req.body.instructorId;
    const studentId = req.body.studentId;

    db.query(`UPDATE ${placementsTable} SET fieldInstructorId = ? WHERE studentId = ?`,
        [instructorId, studentId], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully changed instructorId of placement", 
                data: results.length > 0 ? results : [],
            });
        }
    })
})

module.exports = router;