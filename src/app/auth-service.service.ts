import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthServiceService {
  confirmationResult?: firebase.auth.ConfirmationResult;
  user:any
  nickname:any

  public setNickname(nickName:any){
    this.nickname=nickName
  }
  public getNickname(){
    return this.nickname
  }
  
  public usersub=new Subject()

  constructor(public fireAuth: AngularFireAuth, private router:Router) {

    this.fireAuth.onAuthStateChanged(
      (user)=>{
        this.usersub.next(user)

        if (user && !user.displayName) {

          user.updateProfile({
            displayName:this.getNickname()
          }).then((u)=>console.log("User",u))

        }
      }
    )
   }
   logout(){
    this.fireAuth.signOut().then(
      ()=>this.router.navigate(['/sign-in'])
    )
   }

  public signInPhoneNumber(recaptchaVerifier:any, phoneNumber:any){

  }

  public signInWithPhoneNumber(recaptchaVerifier:any, phoneNumber:any) {
      
    
    return new Promise<any>((resolve, reject) => {

      this.fireAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        }).catch((error) => {
          console.log(error);
          reject('SMS not sent');
        });
    });
    // return this.fireAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)

  }
  public async enterVerificationCode(code:any) {
    console.log("virecodeauth:", code)
    return new Promise<any>((resolve, reject) => {
      this.confirmationResult?.confirm(code).then(async (result) => {
        // console.log("Result:",result);
        this.user = result.user;
        resolve(this.user);
        
        // console.log("user", this.user)
      }).catch((error) => {
        // console.log("Hibás kódAUTHHHHH")
        reject(error.message);
      });

    });
  }
}