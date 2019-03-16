import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;
  year = new Date().getFullYear();

  constructor(private _auth: UserService, private _title: Title) { 
    this.signInForm = new FormGroup({
      email: new FormControl("", [Validators.required] ),
      password: new FormControl("", [Validators.required, Validators.minLength(5)] ),
    });

    this._title.setTitle("Sign In - Medication Management System");
  }

  get email() { return this.signInForm.get('email') }
  get password() { return this.signInForm.get('password') }

  ngOnInit() {
  }

  onSubmit() {

    this._auth.login(this.email.value, this.password.value);

    this.signInForm.reset();
  }

}
