import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import randomize from 'randomatic';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-prescribe-medication',
  templateUrl: './prescribe-medication.component.html',
  styleUrls: ['./prescribe-medication.component.css']
})
export class PrescribeMedicationComponent implements OnInit {

  user;
  prescriptionForm: FormGroup;
  patients = [];
  id;
  u = [];
  data;

  constructor(private _title: Title, private _auth: UserService, private _afAuth: AngularFireAuth, private _afs: AngularFirestore) {
    this._title.setTitle("Book An Appointment - Medication Management System");

    this.id = randomize('0A', 10);

    this.prescriptionForm = new FormGroup({
      medicationCode: new FormControl({ value: this.id, disabled: true }, [Validators.required]),
      startDate: new FormControl("", [Validators.required]),
      endDate: new FormControl("", [Validators.required]),
      medRoutine: new FormControl("", [Validators.required]),
      doctorRemark: new FormControl("", [Validators.required]),
      prescription: new FormControl("", [Validators.required]),
      patient: new FormControl("", [Validators.required]),
    });
  }

  get medicationCode() { return this.prescriptionForm.get('medicationCode') }
  get startDate() { return this.prescriptionForm.get('startDate') }
  get endDate() { return this.prescriptionForm.get('endDate') }
  get medRoutine() { return this.prescriptionForm.get('medRoutine') }
  get doctorRemark() { return this.prescriptionForm.get('doctorRemark') }
  get prescription() { return this.prescriptionForm.get('prescription') }
  get patient() { return this.prescriptionForm.get('patient') }

  async ngOnInit() {
    await this._afAuth.auth.onAuthStateChanged((auth) => {
      if (auth) {
        this._afs.doc(`users/${auth.uid}`).valueChanges().subscribe((user) => {
          if (user) {
            this.user = user;
          }
        });
      }
    });
    
    await this._afs.collection("users").ref.where("role", "==", "patient").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.patients = data;
    });
    

  }

  async onSubmit() {
    const { startDate, endDate, medRoutine, doctorRemark, prescription, patient } = this.prescriptionForm.value;
    const prescriptionDate = Date.now(), doctorRemarkDate = Date.now(), prescribedBy = await this.user.fullName, medicationCode = this.id;

    let data = { medicationCode, startDate, endDate, medRoutine, doctorRemark, prescription, patient, prescriptionDate, doctorRemarkDate, prescribedBy };

    this._auth.addPrescription(data);

    this.prescriptionForm.reset();
  }

}
