import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { UserService } from './services/user.service';
import { AuthGuardService } from './services/auth-guard.service';
import { UserComponent } from './components/user/user.component';
import { BookAppointmentComponent } from './components/user/book-appointment/book-appointment.component';
import { AddDoctorComponent } from './components/user/add-doctor/add-doctor.component';
import { AppointmentsComponent } from './components/user/appointments/appointments.component';
import { PatientAppointmentsComponent } from './components/user/patient-appointments/patient-appointments.component';
import { PrescribeMedicationComponent } from './components/user/prescribe-medication/prescribe-medication.component';
import { AddPatientComponent } from './components/user/add-patient/add-patient.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    UserComponent,
    BookAppointmentComponent,
    AddDoctorComponent,
    AddPatientComponent,
    AppointmentsComponent,
    PatientAppointmentsComponent,
    PrescribeMedicationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    Title,
    UserService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
