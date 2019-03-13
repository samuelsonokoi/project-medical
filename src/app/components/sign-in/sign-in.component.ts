import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signInForm:FormGroup;

  constructor(private _auth: UserService) { 
    this.signInForm = new FormGroup({
      username: new FormControl("", [Validators.required] ),
      password: new FormControl("", [Validators.required, Validators.minLength(5)] ),
    });
  }

  ngOnInit() {
  }

  onSubmit(){

  }

}
