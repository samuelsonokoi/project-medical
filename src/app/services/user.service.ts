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

  constructor(
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _router: Router
  ) {

    // Pnotify
    this.pnotify = this.getPNotify();

    this._afAuth.auth.onAuthStateChanged((user) => {
      if (user != null) {
        this.currentUser = user;
        if (user.email == this.adminEmail) {
          this.isAdmin = true;
        }
      } else {
        this.currentUser = null;
      }
    });
  }

  // Pnotify
  getPNotify() {
    PNotifyButtons; // Initiate the module. Important!
    return PNotify;
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.currentUser !== null;
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
    }).catch((error) => {
      this._handleError(error);
    });
    
  }

  register(email: string, password: string, data: any){
    this._afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
      this.saveUserData(data, user.user.uid);
      user.user.sendEmailVerification().then(_ => {
        this.pnotify.info({
          text: "Email verification sent email.",
          cornerclass: 'ui-pnotify-sharp',
          styling: 'bootstrap4',
          icons: 'fontawesome5'
        })
      });
    }).catch((error) => {
      this._handleError(error);
    });
  }

  logout(){
    this._afAuth.auth.signOut(); 
    this._router.navigate(['home']);
    this.pnotify.info({
      text: "Signed out successfully",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    })
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

  saveTrackingID(data: any){
    const tIdRef = this._afs.collection("trackingIDs");
    tIdRef.add(data).then((_) => {
      this.pnotify.info({
        text: "Tracking ID saved successfully",
        cornerclass: 'ui-pnotify-sharp',
        styling: 'bootstrap4',
        icons: 'fontawesome5'
      })
    }).catch((error) => {
      this._handleError(error);
    });

  }

  bookAppointment(data, uid){
    this._afs.collection(`users/${uid}/appointments`).add(data);
    this.pnotify.info({
      text: "Appointment is successfully booked",
      cornerclass: 'ui-pnotify-sharp',
      styling: 'bootstrap4',
      icons: 'fontawesome5'
    });
    this._router.navigate(['user', 'dashboard']);
  }

  updateTrackingID(data: any){
    const tIdRef = this._afs.collection("trackingIDs");
    tIdRef.ref.where("trackingID", "==", `${data.trackingID}`).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists) {
          tIdRef.doc(doc.id).update(data).then((_) => {
            this.pnotify.info({
              text: "Tracking ID updated successfully",
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
