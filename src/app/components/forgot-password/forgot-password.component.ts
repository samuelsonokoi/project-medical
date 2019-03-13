import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  recoveryPasswordForm: FormGroup;
  year = new Date().getFullYear();

  constructor(private _auth: UserService) { 
    this.recoveryPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email])
    })
  }

  get email() { return this.recoveryPasswordForm.get('email') }

  ngOnInit() {
  }

  onSubmit(){
    this._auth.forgotPassword(this.email.value);
  }

}
