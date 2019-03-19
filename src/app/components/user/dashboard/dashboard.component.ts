import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  allAdmins = [];
  editPatientForm: FormGroup;
  editp = false;
  userUID;

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

    this.editPatientForm = new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      dob: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
      emeContactName: new FormControl("", [Validators.required]),
      emeContactPhone: new FormControl("", [Validators.required]),
    });

    await this._afs.collection("users").ref.where("role", "==", "patient").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.patients = data;
    });

    await this._afs.collection("users").ref.where("role", "==", "doctor").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.allDoctors = data;
    });

    await this._afs.collection("users").ref.where("role", "==", "admin").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.allAdmins = data;
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
    await this._afs.collection("users").ref.where("role", "==", "patient").where("fullName", "==", `${p}`).get().then((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.patient = data;
    });
    this.patientView = true;
  }

  async edit(uid, email, phone){
    await this._afs.collection("users").ref.where("uid", "==", `${uid}`).where("email", "==", `${email}`).where("phone", "==", `${phone}`).where("role", "==", "patient").get().then((querySnapshot) => {
      if (querySnapshot) {
        // var data = querySnapshot.docs[0].data();
        // this.editP = data;
        var data = querySnapshot.docs.map(d => d.data());
        this.patient = data;
        var p = querySnapshot.docs[0].data();
        this.editPatientForm = new FormGroup({
          fullName: new FormControl(p.fullName, [Validators.required]),
          dob: new FormControl(p.dob, [Validators.required]),
          email: new FormControl(p.email, [Validators.required, Validators.email]),
          address: new FormControl(p.address, [Validators.required]),
          country: new FormControl(p.country, [Validators.required]),
          phone: new FormControl(p.phone, [Validators.required]),
          emeContactName: new FormControl(p.emeContactName, [Validators.required]),
          emeContactPhone: new FormControl(p.emeContactPhone, [Validators.required]),
        });
      }
    });
    this.userUID = uid;
    this.editp = true;    
  }

  get fullName() { return this.editPatientForm.get('fullName') }
  get email() { return this.editPatientForm.get('email') }
  get dob() { return this.editPatientForm.get('dob') }
  get address() { return this.editPatientForm.get('address') }
  get country() { return this.editPatientForm.get('country') }
  get phone() { return this.editPatientForm.get('phone') }
  get emeContactName() { return this.editPatientForm.get('emeContactName') }
  get emeContactPhone() { return this.editPatientForm.get('emeContactPhone') }
  

  async updatePatient(){
    const { fullName, email, phone, address, dob, country, emeContactName, emeContactPhone } = this.editPatientForm.value;

    let data = { fullName, email, phone, address, dob, country, emeContactName, emeContactPhone };
  
    this._auth.updatePatient(await this.userUID, data);

    this.editp = false;
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
