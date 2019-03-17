import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent implements OnInit {

  addDoctorForm: FormGroup;

  constructor(private _auth: UserService, private _title: Title) { 
    this.addDoctorForm = new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      department: new FormControl('', [Validators.required])
    });

    this._title.setTitle("Add Doctor - Medication Management System");
  }

  get fullName() { return this.addDoctorForm.get('fullName') }
  get email() { return this.addDoctorForm.get('email') }
  get department() { return this.addDoctorForm.get('department') }

  ngOnInit() {
  }

  onSubmit() {
    const { fullName, email, department } = this.addDoctorForm.value;
    const role = "doctor", password = "1234567890";

    let data = { fullName, email, department, role };

    this._auth.register(this.email.value, password, data);

    this.addDoctorForm.reset();
  }

}
