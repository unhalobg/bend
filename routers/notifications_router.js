// @ts-check

const express = require("express");
const router = express.Router();

const db = require("../database/db");
const { notificationsTable, userTable, agencyApplicationTable, studentApplicationTable, learningContractTable, agencyContractTable } = require("../database/db_table");


/*
Retrieve all notifications for user by using userId
$POST => http://localhost:8080/api/v1/notifications/retrieve/all
body => { userId }
*/
router.post("/retrieve/all", async (req, res, next) => {
    var userId = req.body.userId

    db.query(`SELECT * FROM ${notificationsTable} WHERE userId = ${userId}`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully fetched all notifications",
                data: results,
            })
        }
    })

})

/*
Delete notification by using id
$POST => http://localhost:8080/api/v1/notifications/delete
body => { id }
*/
router.post("/delete", async (req, res, next) => {
    var id = req.body.id

    db.query(`DELETE FROM ${notificationsTable} WHERE id = ${id}`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully deleted notification with id=" + id,
                data: results,
            })
        }
    })

})

/* 
Create a notification for all admin users about the submitted agency application for review
$POST => http://localhost:8080/api/v1/notifications/notify/admins/agency_application
body => { agencyId }
*/
router.post("/notify/admins/agency_application", async (req, res, next) => {
    var agencyId = req.body.agencyId

    db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
    SELECT aa.formId, u.id, "agency_application", CONCAT("Agency ", aa.name, " has applied. Please review and make a decision.")
    FROM ${agencyApplicationTable} AS aa, ${userTable} as u
    WHERE u.role="admin" AND aa.agencyId=${agencyId};`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified All Admins About Agency Application",
                data: results,
            });
        }
    });

})

/* 
Create a notification for the agency whose Smart Placement application has been approved or denied by an admin
$POST => http://localhost:8080/api/v1/notifications/notify/agency/agency_application
body => { formData, status }
*/
router.post("/notify/agency/agency_application", async (req, res, next) => {
    var formId = req.body.formData.formId
    var agencyId = req.body.formData.agencyId
    var status = req.body.status

    db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
    VALUES (${formId}, ${agencyId}, "agency_application", CONCAT("Your application for Smart Placement is ", ?, "."));`, [status], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified Agency About Application Status",
                data: results,
            });
        }
    });
})

/* 
Create a notification for all admin users about the submitted student application for review
$POST => http://localhost:8080/api/v1/notifications/notify/admins/student_application
body => { studentId }
*/
router.post("/notify/admins/student_application", async (req, res, next) => {
    var studentId = req.body.studentId

    db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
    SELECT sa.formId, u.id, "student_application", CONCAT("Student ", sa.firstName, " ", sa.lastName, " has applied. Please review and make a decision.")
    FROM ${studentApplicationTable} AS sa, ${userTable} as u
    WHERE u.role="admin" AND sa.studentId=${studentId};`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified All Admins About Student Application",
                data: results,
            });
        }
    });

})

/* 
Create a notification for the student whose Smart Placement application has been approved or denied by an admin
$POST => http://localhost:8080/api/v1/notifications/notify/student/student_application
body => { formData, status }
*/
router.post("/notify/student/student_application", async (req, res, next) => {
    var formId = req.body.formData.formId
    var studentId = req.body.formData.studentId
    var status = req.body.status

    db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
    VALUES (${formId}, ${studentId}, "student_application", CONCAT("Your application for Smart Placement is ", ?, "."));`, [status], (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified Student About Application Status",
                data: results,
            });
        }
    });
})

/* 
Create a notification for the agency whose student request application has been matched with a student
$POST => http://localhost:8080/api/v1/notifications/notify/agency/placement
body => { formId, agencyId }
*/
router.post("/notify/agency/placement", async (req, res, next) => {
    var formId = req.body.formId
    var agencyId = req.body.agencyId

    db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
    VALUES (${formId}, ${agencyId}, "agency_student_request_application", "A student has been matched with your agency!");`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified Agency About Student Placement",
                data: results,
            });
        }
    });
})


/* 
Create a notification for the student who has been matched with an agency 
$POST => http://localhost:8080/api/v1/notifications/notify/student/placement
body => { formData}
*/
router.post("/notify/student/placement", async (req, res, next) => {
    var formId = req.body.formData.studentId 
    var studentId = req.body.formData.studentId
    

    db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
    VALUES (${formId}, ${studentId},  "agency_student_request_application", "Congragulations, you have matched with an agency!");`,  (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            })
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified Student About Placement",
                data: results,
            });
        }
    });
})


/* 
Create a notification for all admin users about the uploaded student learning contract
$POST => http://localhost:8080/api/v1/notifications/notify/admins/learning_contract_upload
body => { studentId }
*/
// router.post("/notify/admins/learning_contract_upload", async (req, res, next) => {
//     var studentId = req.body.studentId

//     db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
//     SELECT lc.id, u.id, "learning_contract", CONCAT("Student ", s.firstName, " ", s.lastName, " has uploaded a learning contract.")
//     FROM ${learningContractTable} AS lc, ${userTable} as u, ${studentApplicationTable} as s
//     WHERE u.role="admin" AND lc.studentId=${studentId} AND s.studentId=lc.studentId;`, (err, results) => {
//         if (err) {
//             return res.status(500).json({
//                 error: true,
//                 message: err.message,
//                 data: null
//             })
//         } else {
//             return res.status(200).json({
//                 error: false,
//                 message: "Successfully Notified All Admins About Student Learning Contract Upload",
//                 data: results,
//             });
//         }
//     });

// })

router.post("/notify/admins/learning_contract_upload", async (req, res, next) => {
    var studentId = req.body.studentId;

    const sql = `
        INSERT INTO ${notificationsTable} (formId, userId, type, message)
        SELECT lc.id, u.id, "learning_contract", CONCAT("Student ", s.firstName, " ", s.lastName, " has uploaded a learning contract.")
        FROM ${learningContractTable} AS lc, ${userTable} as u, ${studentApplicationTable} as s
        WHERE u.role="admin" AND lc.studentId=${studentId} AND s.studentId=lc.studentId
        ON DUPLICATE KEY UPDATE message = VALUES(message);
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified All Admins About Learning Contract Upload",
                data: results,
            });
        }
    });
});



/* 
Create a notification for all admin users about the uploaded agency contract
$POST => http://localhost:8080/api/v1/notifications/notify/admins/agency_contract_upload
body => { agencyId }
*/

router.post("/notify/admins/agency_contract_upload", async (req, res, next) => {
    var agencyId = req.body.agencyId

    db.query(`INSERT INTO ${notificationsTable} (formId, userId, type, message)
    SELECT ac.id, u.id, "agency_contract", CONCAT("Agency ", a.name, " has uploaded a contract.")
    FROM ${agencyContractTable} AS ac, ${userTable} as u, ${agencyApplicationTable} as a
    WHERE u.role="admin" AND ac.agencyId=${agencyId} AND a.agencyId=ac.agencyId;`, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: true,
                message: err.message,
                data: null
            });
        } else {
            return res.status(200).json({
                error: false,
                message: "Successfully Notified All Admins About Agency Contract Upload",
                data: results,
            });
        }
    });
})


module.exports = router;
