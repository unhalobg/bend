CREATE DATABASE smart_placement;

USE smart_placement;

CREATE TABLE IF NOT EXISTS agency_application (
  formId int NOT NULL AUTO_INCREMENT,
  agencyId int NOT NULL,
  ein varchar(45) NOT NULL,
  name varchar(45) NOT NULL,
  type varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  phone varchar(45) NOT NULL,
  fax varchar(45) NOT NULL,
  website varchar(45) NOT NULL,
  businessAddress json NOT NULL,
  mailingAddress json NOT NULL,
  prefferedContacts json NOT NULL,
  agentTitle varchar(45) NOT NULL,
  agentFirstName varchar(45) NOT NULL,
  agentMiddleName varchar(45) DEFAULT NULL,
  agentLastName varchar(45) NOT NULL,
  agentEmail varchar(45) DEFAULT NULL,
  agentPhone varchar(45) DEFAULT NULL,
  applicationStatus varchar(45) NOT NULL DEFAULT 'pending',
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formId),
  UNIQUE KEY formId_UNIQUE (formId),
  UNIQUE KEY agencyId_UNIQUE (agencyId),
  UNIQUE KEY ein_UNIQUE (ein),
  UNIQUE KEY email_UNIQUE (email),
  UNIQUE KEY phone_UNIQUE (phone),
  UNIQUE KEY fax_UNIQUE (fax),
  UNIQUE KEY website_UNIQUE (website)
);

CREATE TABLE IF NOT EXISTS agency_student_request_application (
  formId int NOT NULL AUTO_INCREMENT,
  agencyId int NOT NULL,
  email varchar(45) NOT NULL,
  ein int NOT NULL,
  degreeLevel varchar(45) NOT NULL DEFAULT 'any',
  numberOfVacancy int NOT NULL DEFAULT 1,
  requirements varchar(255) DEFAULT NULL,
  immunizationRequirements json NOT NULL,
  otherReports json NOT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formId),
  UNIQUE KEY formId_UNIQUE (formId)
);

CREATE TABLE IF NOT EXISTS field_instructor (
  id int NOT NULL AUTO_INCREMENT,
  firstName varchar(45) NOT NULL,
  middleName varchar(45) DEFAULT NULL,
  lastName varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  phone varchar(45) NOT NULL,
  resumeLink varchar(45) DEFAULT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  agencyId int NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id int NOT NULL AUTO_INCREMENT,
  formId int NOT NULL,
  userId int NOT NULL,
  type varchar(45) NOT NULL,
  message varchar(255) DEFAULT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  #UNIQUE KEY id_UNIQUE (id)
  UNIQUE (id, formId, userId, type)
);

CREATE TABLE IF NOT EXISTS placements (
  id int NOT NULL AUTO_INCREMENT,
  agencyId int NOT NULL,
  studentId int NOT NULL,
  formId int NOT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fieldInstructorId int default NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY studentId_UNIQUE (studentId)
);

CREATE TABLE IF NOT EXISTS student_application (
  formId int NOT NULL AUTO_INCREMENT,
  studentId int NOT NULL,
  title varchar(45) NOT NULL,
  firstName varchar(45) NOT NULL,
  middleName varchar(45) DEFAULT NULL,
  lastName varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  phone varchar(45) DEFAULT NULL,
  mobile varchar(45) NOT NULL,
  degreeLevel varchar(45) NOT NULL DEFAULT 'bsw',
  agencyTypeOne varchar(45) NOT NULL,
  agencyTypeTwo varchar(45) NOT NULL,
  agencyTypeThree varchar(45) NOT NULL,
  mailingAddress json NOT NULL,
  prefferedContacts json NOT NULL,
  applicationStatus varchar(45) NOT NULL DEFAULT 'pending',
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (formId),
  UNIQUE KEY formId_UNIQUE (formId),
  UNIQUE KEY studentId_UNIQUE (studentId),
  UNIQUE KEY email_UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS user (
  id int NOT NULL,
  firstName varchar(45) DEFAULT NULL,
  middleName varchar(45) DEFAULT NULL,
  lastName varchar(45) DEFAULT NULL,
  email varchar(125) NOT NULL,
  password varchar(255) NOT NULL,
  role varchar(20) NOT NULL DEFAULT 'student',
  status varchar(45) NOT NULL DEFAULT 'new',
  agencyId int default NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY email_UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS reset_password_token (
  token char(8) PRIMARY KEY,
  email varchar(200) NOT NULL,
  expirationDate char(10) NOT NULL,
  expirationTime char(8) NOT NULL
);

CREATE TABLE IF NOT EXISTS timesheet (
  id int AUTO_INCREMENT PRIMARY KEY,
  studentId int NOT NULL,
  fieldInstructorId int NOT NULL,
  description varchar(10000) NOT NULL,
  hours float(5) NOT NULL,
  startDate char(10),
  endDate char(10),
  status varchar(10) NOT NULL DEFAULT 'pending',
  instructorMessage varchar(1000) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS instructor_application (
  formId int AUTO_INCREMENT PRIMARY KEY,
  instructorId int NOT NULL,
  agencyId int NOT NULL,
  agencyName varchar(125) NOT NULL,
  firstName varchar(45) NOT NULL,
  middleName varchar(45) DEFAULT NULL,
  lastName varchar(45) NOT NULL,
  email varchar(45) NOT NULL,
  phone varchar(45) DEFAULT NULL,
  mobile varchar(45) NOT NULL,
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status varchar(10) NOT NULL DEFAULT 'pending',
  agencyMessage varchar(1000) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS document_request (
  id int AUTO_INCREMENT PRIMARY KEY,
  agencyId int DEFAULT NULL,
  studentId int NOT NULL,
  documentName varchar(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS document (
  id int AUTO_INCREMENT PRIMARY KEY,
  studentId int NOT NULL,
  documentName varchar(60) NOT NULL,
  documentData mediumblob NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_contract (
  id int AUTO_INCREMENT PRIMARY KEY,
  studentId int NOT NULL,
  learningContractName varchar(60) NOT NULL,
  learningContractData mediumblob NOT NULL,
  FOREIGN KEY (studentId) REFERENCES student_application(studentId)
);

CREATE TABLE IF NOT EXISTS agency_contract (
  id int AUTO_INCREMENT PRIMARY KEY,
  agencyId int NOT NULL,
  agencyContractName varchar(60) NOT NULL,
  agencyContractData mediumblob NOT NULL,
  FOREIGN KEY (agencyId) REFERENCES agency_application(agencyId)
);