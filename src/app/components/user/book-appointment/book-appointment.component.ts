import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {

  user;
  bookAppointmentForm: FormGroup;
  doctors = [];

  constructor(private _title: Title, private _auth: UserService, private _afAuth: AngularFireAuth, private _afs: AngularFirestore) {
    this._title.setTitle("Book An Appointment - Medication Management System");

    this.bookAppointmentForm = new FormGroup({
      date: new FormControl("", [Validators.required]),
      time: new FormControl("", [Validators.required]),
      doctor: new FormControl("", [Validators.required]),
      message: new FormControl("", [Validators.required])
    });
  }

  get date() { return this.bookAppointmentForm.get('date') }
  get time() { return this.bookAppointmentForm.get('time') }
  get doctor() { return this.bookAppointmentForm.get('doctor') }
  get message() { return this.bookAppointmentForm.get('message') }

  async ngOnInit() {
    await this._afAuth.auth.onAuthStateChanged((auth) => {
      if (auth) {
        this._afs.collection(`users`).ref.where("uid", "==", auth.uid).onSnapshot((querySnapshot) => {
          if (querySnapshot) {
            var data = querySnapshot.docs.map(d => d.data());
            this.user = data;
          }
        });
      }
    });

    await this._afs.collection("users").ref.where("role", "==", "doctor").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.doctors = data;
    });

  }

  onSubmit() {
    const { date, time, doctor, message } = this.bookAppointmentForm.value;
    const bookedBy = this.user.fullName, accepted = false;

    let data = { date, time, doctor, message, bookedBy, accepted };

    this._auth.bookAppointment(data);

    this.bookAppointmentForm.reset();
  }

}
