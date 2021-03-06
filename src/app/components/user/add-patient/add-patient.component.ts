import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  addPatientForm: FormGroup;
  year = new Date().getFullYear();

  constructor(private _auth: UserService, private _title: Title, private _router: Router) { 
    this.addPatientForm = new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      dob: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
      emeContactName: new FormControl("", [Validators.required]),
      emeContactPhone: new FormControl("", [Validators.required]),
    });

    this._title.setTitle("Sign Up - Medication Management System");
  }

  get fullName() { return this.addPatientForm.get('fullName') }
  get email() { return this.addPatientForm.get('email') }
  get dob() { return this.addPatientForm.get('dob') }
  get address() { return this.addPatientForm.get('address') }
  get country() { return this.addPatientForm.get('country') }
  get phone() { return this.addPatientForm.get('phone') }
  get emeContactName() { return this.addPatientForm.get('emeContactName') }
  get emeContactPhone() { return this.addPatientForm.get('emeContactPhone') }

  ngOnInit() {
  }

  onSubmit() {
    const { fullName, email, phone, address, dob, country, emeContactName, emeContactPhone } = this.addPatientForm.value;
    const role = "patient", password = '1234567890', canLogin = true;

    let data = { fullName, email, phone, address, dob, country, emeContactName, emeContactPhone, role, canLogin };

    this._auth.register(this.email.value, password, data);

    this.addPatientForm.reset();

    this._router.navigate(["user", "add-patient"]);
  }

}
