import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  year = new Date().getFullYear();
  user;
  patients = [];
  prescriptions = [];
  pPrescriptions = [];
  patientView = false;
  patient;
  patientsAppointments = [];
  allDoctors = [];
  allAppointments = [];

  constructor(private _title: Title, private _auth: UserService, private _afAuth: AngularFireAuth, private _afs: AngularFirestore) { 
    this._title.setTitle("Application Dashboard - Medication Management System");
  }

  async ngOnInit() {
    await this._afAuth.auth.onAuthStateChanged((auth) => {
      if (auth) {
        this._afs.doc(`users/${auth.uid}`).valueChanges().subscribe((user) => {
          if (user) {
            this.user = user;

            this._afs.collection("prescriptions").ref.where("patient", "==", `${this.user.fullName}`).onSnapshot((querySnapshot) => {
              var data = querySnapshot.docs.map(d => d.data());
              this.pPrescriptions = data;
            });
          }
        });
      }
    });

    await this._afs.collection("users").ref.where("role", "==", "patient").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.patients = data;
    });

    await this._afs.collection("users").ref.where("role", "==", "doctor").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.allDoctors = data;
    });

    await this._auth.getAllPrescriptions().subscribe((pres) => {
      this.prescriptions = pres
    });

    await this._auth.getAllAppointments().subscribe((data) => {
      if (data) {
        this.allAppointments = data;
      }
    });
  }

  async viewPatient(p){
    await this._afs.collection("users").ref.where("role", "==", "patient").where("fullName", "==", `${p}`).onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.patient = data;
    });
    this.patientView = true;
  }

  makeAdmin(doctor){
    this._auth.makeAdmin(doctor);
  }

  cancel(id) {
    this._afs.collection("appointments").ref.where("doctor", "==", `${this.user.fullName}`).where("date", '==', `${id.date}`).where("time", '==', `${id.time}`).where("bookedBy", '==', `${id.bookedBy}`).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists) {
          this._afs.collection("appointments").doc(doc.id).update({ accepted: false, cancelled: true });
        }
      });
    });

    this._auth.cancelAppointment();
  }

}
