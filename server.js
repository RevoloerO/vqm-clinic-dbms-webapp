'use strict';
var http = require('http');
const fs = require('fs');
var express = require('express')
const cors = require('cors');

//Change the Path to dababase - NOTE: the path need to be separated by double slash "\\" instead of single slash "\"
var db_file_path = "Database clinic.mdb";

var port = process.env.PORT || 1337;
const ADODB = require('node-adodb');
const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=' + db_file_path + ';')

var app = express()
app.use(cors())
app.use(express.json())

//Test Database connection
var patients;
connection
    .query('SELECT * FROM Patients ')
    .then(data => {
        patients = JSON.stringify(data, null, 2);
        //console.log(doctors);
    })
    .catch(error => {
        console.error(error);
    });

//retrieve Table data from database using SELECT
function getTable(connection, res, tableName, field) {
    connection
        .query(`SELECT * FROM ${tableName} ORDER BY ${field} ASC`)
        .then(data => {
            res.json(JSON.stringify(data, null, 2));
        }).catch(error => {
            console.error(error);
        });
}
function deleteData(connection, res, tableName, field, id) {
    connection
        .execute(`DELETE FROM ${tableName} WHERE ${field} = ${id}`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return res.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            res.status(400).send(error);
            console.error(error);
            return
        });
}

/** 
var data = '3, "Flu", "12/13/2023","",7';
connection
    .execute('INSERT INTO VaccinationTypes(VaccinationTypeID, VaccinationName, VaccinationDate, VaccinationDescription, RecommendedAge) VALUES ('+data+')')
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(error => {
        console.error(error);
    });
*/

 //Make GET API for retrive data from DB
app.get('/', (request, response) => {
    response.send(`<h1>The Server is running</h1> <br>
    <p>If the database connnetion succeed, the Patient data will be showed</p><br> ${patients}`)
})

app.get('/api/doctors', (request, response) => {
    getTable(connection, response, "doctors", "DoctorID")
})
app.get('/api/patients', (request, response) => {
    getTable(connection, response, "patients", "PatientID")
})
app.get('/api/insurances', (request, response) => {
    getTable(connection, response, "insurances", "InsuranceID")
})
app.get('/api/billDetails', (request, response) => {
    getTable(connection, response, "billDetailes", "BillDetailesID")
})
app.get('/api/bills', (request, response) => {
    getTable(connection, response, "bills", "BillNumber")
})
app.get('/api/appointments', (request, response) => {
    getTable(connection, response, "appointments", "AppointmentID" )
})
app.get('/api/labTest', (request, response) => {
    getTable(connection, response, "labTest", "LabTestID")
})
app.get('/api/medicalHistory', (request, response) => {
    getTable(connection, response, "medicalHistory","MedicalHistoryID")
})
app.get('/api/medicalRecords', (request, response) => {
    getTable(connection, response, "medicalRecords","MedicalRecordID")
})
app.get('/api/prescriptions', (request, response) => {
    getTable(connection, response, "prescriptions", "PrescriptionID" )
})
app.get('/api/services', (request, response) => {
    getTable(connection, response, "services", "ServiceID")
})
app.get('/api/serviceType', (request, response) => {
    getTable(connection, response, "serviceType", "ServiceTypeID" )
})
app.get('/api/vaccinationTypes', (request, response) => {
    getTable(connection, response, "vaccinationTypes", "VaccinationTypeID")
})
app.get('/api/singlePatient/:id', (request, response) => {
    let f1 = request.params.id;
    connection
        .query(`SELECT * FROM ((Patients 
        LEFT JOIN Insurances ON Patients.PatientID = Insurances.PatientID)
        LEFT JOIN MedicalHistory ON Patients.PatientID = MedicalHistory.PatientID) 
        WHERE Patients.PatientID = ${f1}`)
        .then(data => {
            //console.log(data)
            response.json(JSON.stringify(data, null, 2));
        }).catch(error => {
            console.error(error);
        });
})
//DELETE API
app.post('/delete/doctors', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'doctors', 'DoctorID', id)
})
app.post('/delete/patients', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'patients', 'PatientID', id)
})
app.post('/delete/insurances', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'insurances', 'InsuranceID', id)
})
app.post('/delete/billDetails', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'billDetailes', 'BillDetailesID', id)
})
app.post('/delete/bills', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'bills', 'BillNumber', id)
})
app.post('/delete/appointments', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'appointments', 'AppointmentID', id)
})
app.post('/delete/labTest', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'labTest', 'LabTestID', id)
})
app.post('/delete/medicalHistory', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'medicalHistory', 'MedicalHistoryID', id)
})
app.post('/delete/medicalRecords', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'medicalRecords', 'MedicalRecordID', id)
})
app.post('/delete/prescriptions', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'prescriptions', 'PrescriptionID', id)
})
app.post('/delete/services', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'services', 'ServiceID', id)
})
app.post('/delete/serviceType', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'serviceType', 'ServiceTypeID', id)
})
app.post('/delete/vaccinationTypes', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let id = body[1].toString();
    deleteData(connection, response, 'vaccinationTypes', 'VaccinationTypeID', id)
})

//INSERT TO TABLE

app.post('/api/doctors', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString(); let field4 = body[4].toString();
    let field5 = body[5].toString(); let field6 = body[6].toString();
    let field7 = body[7].toString(); let field8 = body[8].toString();
    let field9 = body[9].toString(); let field10 = body[10].toString();
    let field11 = body[11].toString();

    connection
        .execute(`INSERT INTO Doctors (DoctorID, DoctorFirstName,DoctorLastName, DoctorEmail,
        DoctorPhone,DoctorAddress, DoctorCity, DoctorState, DoctorZipCode,
        DoctorSpecialization,DoctorGender)
            VALUES (${field1},"${field2}","${field3}","${field4}","${field5}","${field6}",
            "${field7}","${field8}","${field9}","${field10}","${field11}")`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/patients', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString(); let field4 = body[4].toString();
    let field5 = body[5].toString(); let field6 = body[6].toString();
    let field7 = body[7].toString(); let field8 = body[8].toString();
    let field9 = body[9].toString(); let field10 = body[10].toString();
    let field11 = body[11].toString(); let field12 = body[12].toString();

    connection
        .execute(`INSERT INTO Patients (PatientID, PatientFirstName,PatientLastName, PatientDateBirth,
        PatientGender,PatientAge, PatientEmail, PatientAddress, PatientCity,
        PatientState,PatientZipCode, PatientPhone)
            VALUES (${field1},"${field2}","${field3}","${field4}","${field5}",${field6},
            "${field7}","${field8}","${field9}","${field10}","${field11}","${field12}")`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/insurances', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString(); let field4 = body[4].toString();
 
    connection
        .execute(`INSERT INTO Insurances (InsuranceID, InsuranceProvider,PolicyNumber,PatientID)
            VALUES (${field1},"${field2}","${field3}",${field4})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/billDetails', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString();

    connection
        .execute(`INSERT INTO BillDetailes (BillDetailesID, BillNumber,ServiceID)
            VALUES (${field1},${field2},${field3})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/bills', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString();

    connection
        .execute(`INSERT INTO Bills (BillNumber, BillDate,PatientID)
            VALUES (${field1},"${field2}",${field3})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/appointments', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    //console.log(body);
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString(); let field4 = body[4].toString();
    let field5 = body[5].toString(); let field6 = body[6].toString();
    let field7 = body[7].toString(); let field8 = body[8].toString();
    
    connection
        .execute(`INSERT INTO appointments (AppointmentID, AppointmentTime,VisitReason,
        AppointmentNotes,AppointmentStatues, AppointmentDate, DoctorID, PatientID)
            VALUES (${field1},"${field2}","${field3}",
            "${field4}","${field5}","${field6}",${field7},${field8})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})

app.post('/api/labTest', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString(); let field3 = body[3].toString();
    let field4 = body[4].toString(); let field5 = body[5].toString();

    connection
        .execute(`INSERT INTO labTest (LabTestID, TestName,
            Ordering, TestResult, AppointmentID)
            VALUES (${field1},"${field2}","${field3}","${field4}",${field5})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200)
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/medicalHistory', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString(); let field4 = body[4].toString();
    let field5 = body[5].toString(); 

    connection
        .execute(`INSERT INTO medicalHistory (MedicalHistoryID, Medications,Allergies,
        ChronicConditions, PatientID)
            VALUES (${field1},"${field2}","${field3}",
            "${field4}",${field5})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/medicalRecords', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString(); let field4 = body[4].toString();
    let field5 = body[5].toString(); let field6 = body[6].toString();
    let field7 = body[7].toString(); let field8 = body[8].toString();

    connection
        .execute(`INSERT INTO medicalRecords (MedicalRecordID, MedicalDate,Diagnosis,
        TreatmentPlan,MedicationName, VaccinationTypeID, MedicalHistoryID, PatientID)
            VALUES (${field1},"${field2}","${field3}",
            "${field4}","${field5}",${field6},${field7},${field8})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/prescriptions', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString(); let field4 = body[4].toString();
    let field5 = body[5].toString(); let field6 = body[6].toString();
    let field7 = body[7].toString();

    connection
        .execute(`INSERT INTO prescriptions (PrescriptionID, PrescriptionDate,Dosage,
        Form,Instructions, DoctorID, PatientID)
            VALUES (${field1},"${field2}","${field3}",
            "${field4}","${field5}",${field6},${field7})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/services', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString();
    let field3 = body[3].toString();

    connection
        .execute(`INSERT INTO Services (ServiceID, ServiceTypeID,ServiceCost)
            VALUES (${field1},${field2},${field3})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/serviceType', (request, response) => {
    const body = JSON.parse(JSON.stringify(request.body));
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString(); 

    connection
        .execute(`INSERT INTO ServiceType (ServiceTypeID, ServiceName)
            VALUES (${field1},"${field2}")`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200).json({ sucess: "sucess" })
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return
        });
})
app.post('/api/vaccinationTypes', (request, response) => {
   
    const body = JSON.parse(JSON.stringify(request.body));
    //console.log("body: " + body); '3, "Flu", "12/13/2023","",7';
    if (!body) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    let field1 = body[1].toString(); let field2 = body[2].toString(); let field3 = body[3].toString();
    let field4 = body[4].toString(); let field5 = body[5].toString();
    
    connection
        .execute(`INSERT INTO VaccinationTypes(VaccinationTypeID, VaccinationName,
            VaccinationDate, VaccinationDescription, RecommendedAge)
            VALUES (${field1},"${field2}","${field3}","${field4}",${field5})`)
        .then(data => {
            //console.log(JSON.stringify(data, null, 2));
            return response.status(200)
        })
        .catch(error => {
            response.status(400).send(error);
            console.error(error);
            return 
        });
})

app.listen(port, () => {
    console.log(`Server running on port ${port} or http://localhost:${port}/`)
})

