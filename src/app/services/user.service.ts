import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  pnotify = undefined;
  currentUser: firebase.User;
  adminEmail: String = 'samuelsonokoi@gmail.com';
  isAdmin: boolean = false;
  locations = [];

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
    this._afAuth.auth.signInWithEmailAndPassword(email, password).then((user) => {
      if(user != null && this.currentUser.email == this.adminEmail){
        this._router.navigate(['dashboard']);
        this.pnotify.info({
          text: "Signed in successfully",
          cornerclass: 'ui-pnotify-sharp',
          styling: 'bootstrap4',
          icons: 'fontawesome5'
        })
      } else {
        this.pnotify.info({
          text: "Signed in successfully",
          cornerclass: 'ui-pnotify-sharp',
          styling: 'bootstrap4',
          icons: 'fontawesome5'
        })
      }
    }).catch((error) => {
      this._handleError(error);
    });
    
  }

  register(email: string, password: string, data: any){
    this._afAuth.auth.createUserWithEmailAndPassword(email, password).then((user) => {
      this.saveUserData(data);
      user.user.sendEmailVerification().then(_ => {
        this.pnotify.info({
          text: "Email verification sent",
          cornerclass: 'ui-pnotify-sharp',
          styling: 'bootstrap4',
          icons: 'fontawesome5'
        })
      })
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
    this._afAuth.auth.sendPasswordResetEmail(email).then((data) => {
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

  getAllTrackingIDs(){
    const tidCollection = this._afs.collection("trackingIDs");
    const tid = tidCollection.valueChanges();

    return tid;
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

  get_location(id: any){
    const tIdRef = this._afs.collection("trackingIDs");
    tIdRef.ref.where("trackingID", "==", `${id}`).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists) {
          this.locations.push(doc.data());
        }
      });
    }).catch((error) => {
      this._handleError(error);
    });

    return this.locations;
  }

  private saveUserData(data: any){
    // Sets user data to firestore on login or signup
    const userRef: AngularFirestoreCollection<any> = this._afs.collection(`users`);
    userRef.add(data);
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
