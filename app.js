const express = require("express")
const app = express()

const bodyParser = require("body-parser")

// Limit to 12mb for uploading documents
app.use(bodyParser.json({limit: '12mb'}))
app.use(bodyParser.urlencoded({ extended: false, limit: '12mb' }))

const cors = require("cors")
app.use(cors())

const { apiMiddleware, authMiddleware } = require("./middlewares/auth_middleware")
app.use("*", apiMiddleware)

const authRouter = require("./routers/auth_router")
const agencyApplicationRouter = require("./routers/agency_application_router")
const studentApplicationRouter = require("./routers/student_application_router")
const instructorApplicationRouter = require("./routers/instructor_application_router")
const agencyStudentApplicationRouter = require("./routers/agency_student_application_router")
const placementRouter = require("./routers/placement_router")
const timesheetRouter = require("./routers/timesheet_router")
const documentRouter = require("./routers/document_router")
const documentRequestRouter = require("./routers/document_request_router")
const notificaitonsRouter = require("./routers/notifications_router")
const learningContractRouter = require("./routers/learning_contract_router")
const agencyContractRouter = require("./routers/agency_contract_router")

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/application/agency",/* authMiddleware,*/ agencyApplicationRouter)
app.use("/api/v1/application/student", authMiddleware, studentApplicationRouter)
app.use("/api/v1/application/agency/student", authMiddleware, agencyStudentApplicationRouter)
app.use("/api/v1/placement", authMiddleware, placementRouter)
app.use("/api/v1/notifications", authMiddleware, notificaitonsRouter)
app.use("/api/v1/timesheet", timesheetRouter)
app.use("/api/v1/application/instructor", instructorApplicationRouter)
app.use("/api/v1/document", documentRouter)
app.use("/api/v1/document/request", documentRequestRouter)
app.use("/api/v1/learning_contract", learningContractRouter)
app.use("/api/v1/agency_contract", agencyContractRouter)

module.exports = app