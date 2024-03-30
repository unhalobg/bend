Abbreviation: 
1. PK - Primary Key
2. UQ - Unique
3. AI - Auto Increment
4. NN - Not Null

- AUTH (id, email, password, firstName, middleName, lastName, role, status)
id - PK, UQ, NN (Integer)
email - UQ, NN (String)
firstName - NN (String)
middleName (String)
lastName - NN (String)
role - NN, Default: "student", (String) { "admin", "agency", "student", "fieldInstructor" }
status - NN, Default: "pending", (String) { 
                        Student: { "pending", "matched", "approved", "rejected" },
                        Admin: { "approved" },
                        FieldInstructor: { "pending", "approved", "rejected" },
                     }

Note: Agency, Field Instructor, Student status can be updated by admin.
On change on status, respective users should get notifications regarding the change of status.