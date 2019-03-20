# Patient's Medical Medication Management System

This project handles a patients medication system, it's a platform where a hospital or clinic admin can add doctors and assign them to various departments including adding a patient. The plaform uses a central authentication system for both admin, patient and doctor.  

## Patients

Patients will be able to book appointment, cancel appointments, view appointment history and view doctor's prescription.


## Doctors

Doctors will be able to add a patients medical prescription, view prescriptions, accept or decline an appointment and view appointments.

## Admin

Admin can add a new patient or doctor with login automatically created for the new patient or doctor as well as viewing all appointments and prescription. Admins can also deny or grant login access to doctors and patients.

## Built With

Angular 7 and Firebase.

## Setup

Clone the application and run `npm install` on the root folder to get all the dependencies [ make sure you have nodejs and angular installed ]

Create a firebase account if you don't already have one and create a new project

Open `environment.prod.ts` and `environment.ts` files in the environments folder and enter your project configuration.

run `ng serve` to start the application.

Developed By [Samuelson Okoi](https://samuelsonokoi.com)
