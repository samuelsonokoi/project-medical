import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.css']
})
export class PatientAppointmentsComponent implements OnInit {

  user;
  appointments = [];

  constructor(private _title: Title, private _auth: UserService, private _afAuth: AngularFireAuth, private _afs: AngularFirestore) {
    this._title.setTitle("Patients Appointments - Medication Management System");
  }

  async ngOnInit() {
    await this._afAuth.auth.onAuthStateChanged((auth) => {
      if (auth) {
        this._afs.doc(`users/${auth.uid}`).valueChanges().subscribe((user) => {
          if (user) {
            this.user = user;

            this._afs.collection("appointments").ref.where("doctor", "==", `${this.user.fullName}`).onSnapshot((querySnapshot) => {
              var data = querySnapshot.docs.map(d => d.data());
              this.appointments = data;
            });
          }
        });
      }
    });

  }

  accept(id){
    this._afs.collection("appointments").ref.where("doctor", "==", `${this.user.fullName}`).where("date", '==', `${id.date}`).where("time", '==', `${id.time}`).where("bookedBy", '==', `${id.bookedBy}`).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists) {
          this._afs.collection("appointments").doc(doc.id).update({ accepted: true });
        }
      });
    });

    this._auth.acceptAppointment();
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
