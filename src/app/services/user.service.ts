import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  pnotify = undefined;
  currentUser: firebase.User;
  adminEmail: String = 'samuelsonokoi@gmail.com';
  isAdmin: boolean = false;
  user;
  doctors = [];
  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _router: Router
  ) {

    // Pnotify
    this.pnotify = this.getPNotify();

    this._afAuth.auth.onAuthStateChanged((user) => {
      if (user != null) {
        this.isLoggedIn = true;
        this._afs.doc(`users/${user.uid}`).valueChanges().subscribe((user) => {
          if (user) {
            this.user = user;
          }
        });
      }
    });
  }

  // Pnotify
  getPNotify() {
    PNotifyButtons; // Initiate the module. Important!
    return PNotify;
  }

  login(email: string, password: string){
    this._afAuth.auth.signInWithEmailAndPassword(email, password).then((_) => {
      this._router.navigate(['user', 'dashboard']);
      this.pnotify.info({
        text: "Signed in successfully",
        cornerclass: 'ui-pnotify-sharp',
        styling: 'bootstrap4',
        icons: 'fontawesome5'
      });
      this.isLoggedIn = true;
    }).catch((error) => {
      this._handleError(error);
    });
    
  }

  register(email: string, password: string, data: any){
    this._afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
      this.saveUserData(data, user.user.uid);
    }).catch((error) => {
      this._handleError(error);
    });
  }

  logout(){
    this._afAuth.auth.signOut(); 
    this._router.navigate(['sign-in']);
    this.pnotify.info({
      text: "Signed out successfully",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    });
    this.isLoggedIn = false;
  }

  forgotPassword(email: string){
    this._afAuth.auth.sendPasswordResetEmail(email).then((_) => {
      this._router.navigate(['sign-in']);
      this.pnotify.info({
        text: "Reset link sent successfully",
        cornerclass: 'ui-pnotify-sharp',
        styling: 'bootstrap4',
        icons: 'fontawesome5'
      })
    }).catch((error) => {
      this._handleError(error);
    });
  }


  getAllUsers(){
    const userCollection = this._afs.collection("users");
    const users = userCollection.valueChanges();
    return users;
  }

  getAllAppointments() {
    const appointmentCollection = this._afs.collection("appointments");
    const appointments = appointmentCollection.valueChanges();
    return appointments;
  }

  getAllPrescriptions() {
    const prescriptionCollection = this._afs.collection("prescriptions");
    const prescriptions = prescriptionCollection.valueChanges();
    return prescriptions;
  }

  getAllDoctors() {
    this._afs.collection("users").ref.where("role", "==", "doctor").onSnapshot((querySnapshot) => {
      var data = querySnapshot.docs.map(d => d.data());
      this.doctors = data;
    });
  }

  async getAllPatients() {
    return await this._afs.collection("users").ref.where("role", "==", "patient").get();
  }

  bookAppointment(data){
    this._afs.collection(`appointments`).add(data);
    this.pnotify.info({
      text: "Appointment is successfully booked",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    });
    this._router.navigate(['user', 'dashboard']);
  }

  acceptAppointment() {
    this.pnotify.info({
      text: "Appointment Accepted",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    });
  }

  cancelAppointment() {
    this.pnotify.info({
      text: "Appointment Cancelled",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    });
  }

  addPrescription(data) {
    this._afs.collection(`prescriptions`).add(data);
    this.pnotify.info({
      text: "Patient's prescription is successfully saved",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    });
    this._router.navigate(['user', 'dashboard']);
  }

  updatePatient(uid, data) {
    const userRef = this._afs.collection("users");
    userRef.ref.where("uid", "==", `${uid}`).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists) {
          userRef.doc(doc.id).update(data).then((_) => {
            this.pnotify.info({
              text: "Patient details has been updated.",
              cornerclass: 'ui-pnotify-sharp',
              styling: 'bootstrap4',
              icons: 'fontawesome5'
            })
          }).catch((error) => {
            this._handleError(error);
          });
        }
      });
    }).catch((error) => {
      this._handleError(error);
    });
  }

  makeAdmin(uid){
    const userRef = this._afs.collection("users");
    userRef.ref.where("uid", "==", `${uid}`).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists) {
          userRef.doc(doc.id).update({role: "admin"}).then((_) => {
            this.pnotify.info({
              text: "Admin priviledges has been granted.",
              cornerclass: 'ui-pnotify-sharp',
              styling: 'bootstrap4',
              icons: 'fontawesome5'
            })
          }).catch((error) => {
            this._handleError(error);
          });
        }
      });
    }).catch((error) => {
      this._handleError(error);
    });
  }

  // Check if the document exist in firestore
  docExists(path: string) {
    return this._afs.doc(path).valueChanges().pipe(first()).toPromise()
  }

  // Check if the document exist if not then create it
  async saveUser(user) {
    const doc = await this.docExists(`users/${user.uid}`);

    if (doc) {
    } else {
      this.saveUserData(user, user.id);
    }
  }

  private saveUserData(data, id) {
    // Sets user data to firestore on login or signup
    const userRef: AngularFirestoreDocument<any> = this._afs.doc(`users/${id}`);
    data.uid = id;
    userRef.set(data, { merge: true });

    this.pnotify.info({
      text: "Account successfully created.",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    })
  }

  // if error, console log and notify user
  private _handleError(error) {
    this.pnotify.error({
      text: `${error.message}`,
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    });
  }
}
