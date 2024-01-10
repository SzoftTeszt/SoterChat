import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import { environment } from '../../environments/environment';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { getAuth, RecaptchaVerifier } from "firebase/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {




  CountryJson = environment.CountryJson;
  OTP: string = '';
  Code: any;
  PhoneNo: any;
  CountryCode: any = '+91';
  showOTPInput: boolean = false;
  OTPmessage: string = 'An OTP is sent to your number. You should receive it in 15 s'
  recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
  confirmationResult: any;
  constructor(
    private alertController: AlertController,
    private authService: AuthServiceService,
    private router:Router
  ) { }


 ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
     
    });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad")
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
      callback: (response:any) => {
        // response(true)
      },
      'expired-callback': () => {
      }
    });
  }

  countryCodeChange($event:any) {
    this.CountryCode = $event.detail.value;
  }
  // Button event after the nmber is entered and button is clicked
  signinWithPhoneNumber($event:any) {
    console.log('country', this.recaptchaVerifier);

    if (this.PhoneNo && this.CountryCode) {
      this.authService.signInWithPhoneNumber(this.recaptchaVerifier, this.CountryCode + this.PhoneNo).then(
        () => {
          console.log("rendben")
          this.OtpVerification();
        }
      );
    }
  }
  async showSuccess() {
    const alert = await this.alertController.create({
      header: 'Success',
      buttons: [
        {
          text: 'Ok',
          handler: (res) => {
            alert.dismiss();
          }
        }
      ]
    });
    alert.present();
  }
  async OtpVerification() {
    const alert = await this.alertController.create({
      header: 'Enter OTP',
      backdropDismiss: false,
      inputs: [
        {
          name: 'otp',
          type: 'text',
          placeholder: 'Enter your otp',
        }
      ],
      buttons: [{
        text: 'Enter',
        handler: (res) => {
          this.authService.enterVerificationCode(res.otp).then(
            userData => {
              this.router.navigate(['/home'])
              this.showSuccess();
              
              console.log(userData);
            }
          ).catch((h)=>{console.log("Hibás kód: ",h)});
        }
      }
      ]
    });
    await alert.present();
  }



  signPhone(){
    console.log("signphone")
    const auth = getAuth();
    let chapta = new RecaptchaVerifier(auth, 'recaptcha-container', {
      // 'size': 'normal',
      'callback': (response:any) => {
        console.log(response)
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });
    chapta.render().then(
      ()=> firebase.auth().signInWithPhoneNumber('+36303236954', chapta)
      .then(function(confirmationResult) {
      //  let verCode= window.prompt('Please enter the verification ' +
      //       'code that was sent to your mobile device.')
        let verCode='111111'
        console.log("vercode", verCode)
        if (verCode)  
          return confirmationResult.confirm(verCode);
        return null;
      })
      .catch(function(error) {
       console.log("error", error)
      })

    ).catch(
      (o)=>{console.log(o)}
    ).then(
      (res)=>(console.log("res",res))
    )
    


  //   let applicationVerifier = new firebase.auth.RecaptchaVerifier(
  //     'recaptcha-container');
  // firebase.auth().signInWithPhoneNumber('+36303236954', applicationVerifier)
  //     .then(function(confirmationResult) {
  //      let verCode= window.prompt('Please enter the verification ' +
  //           'code that was sent to your mobile device.');
  //       if (verCode)  
  //         return confirmationResult.confirm(verCode);
  //       return null;
  //     })
  //     .catch(function(error) {
  //      console.log("error", error)
  //     });
  
  }
}