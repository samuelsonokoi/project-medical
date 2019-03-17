import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserComponent } from './components/user/user.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BookAppointmentComponent } from './components/user/book-appointment/book-appointment.component';
import { AddDoctorComponent } from './components/user/add-doctor/add-doctor.component';
import { AppointmentsComponent } from './components/user/appointments/appointments.component';
import { PatientAppointmentsComponent } from './components/user/patient-appointments/patient-appointments.component';

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "user", component: UserComponent, canActivate: [AuthGuardService], children: [
    { path: "dashboard", component: DashboardComponent, pathMatch: "full"},
    { path: "profile", component: ProfileComponent, pathMatch: "full"},
    { path: "book-appointment", component: BookAppointmentComponent, pathMatch: "full"},
    { path: "appointments", component: AppointmentsComponent, pathMatch: "full"},
    { path: "patient-appointments", component: PatientAppointmentsComponent, pathMatch: "full"},
    { path: "add-doctor", component: AddDoctorComponent, pathMatch: "full"},
  ]},
  { path: "sign-in", component: SignInComponent },
  { path: "sign-up", component: SignUpComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
