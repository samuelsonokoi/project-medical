import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUpForm: FormGroup;
  year = new Date().getFullYear();

  constructor(private _auth: UserService, private _title: Title, private _router: Router) { 
    this.signUpForm = new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      dob: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
      emeContactName: new FormControl("", [Validators.required]),
      emeContactPhone: new FormControl("", [Validators.required]),
    });

    this._title.setTitle("Sign Up - Medication Management System");
  }

  get fullName() { return this.signUpForm.get('fullName') }
  get email() { return this.signUpForm.get('email') }
  get password() { return this.signUpForm.get('password') }
  get confirm_password() { return this.signUpForm.get('confirm_password') }
  get dob() { return this.signUpForm.get('dob') }
  get address() { return this.signUpForm.get('address') }
  get country() { return this.signUpForm.get('country') }
  get phone() { return this.signUpForm.get('phone') }
  get emeContactName() { return this.signUpForm.get('emeContactName') }
  get emeContactPhone() { return this.signUpForm.get('emeContactPhone') }

  ngOnInit() {
  }

  onSubmit() {
    const { fullName, email, phone, address, dob, country, emeContactName, emeContactPhone } = this.signUpForm.value;
    const role = "patient";

    let data = { fullName, email, phone, address, dob, country, emeContactName, emeContactPhone, role };

    this._auth.register(this.email.value, this.password.value, data);

    this.signUpForm.reset();

    this._router.navigate(["user", "dashboard"]);
  }

}
