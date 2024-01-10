import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import { AuthServiceService } from '../auth-service.service';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  phoneNo:any
  signIn=0
  CountryJson = environment.CountryJson;
  OTP: string = '';
  Code: any;
  // PhoneNo: any;
  CountryCode: any = '+36';
  // recaptchaVerifier!:RecaptchaVerifier
  recaptchaVerifier!:any
  recaptchaVerifier1!:any
  recaptchaVerifier2!:any
  rechapta=true;
  nickName:any
  constructor(public router:Router, private auth:AuthServiceService, private alertController: AlertController)
   { }
   ionViewWillLeave(){
    console.log("ionViewWillLeave")
    if (this.recaptchaVerifier2) this.recaptchaVerifier2.clear();
    this.recaptchaVerifier2=null
    console.log("ionViewWillLeave", this.recaptchaVerifier2)
   }

   ionViewDidEnter() {
    console.log("ionViewDidEnter")
    this.rechapta=true;
    if (!this.recaptchaVerifier1)  this.recaptchaVerifier1=new RecaptchaVerifier(getAuth()  , 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response:any) => {
        this.rechapta=true       
        console.log("invisible response")
      },
      'expired-callback': () => {
        this.rechapta=false
        console.log("invisible HIba")
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });

    if (!this.recaptchaVerifier2) this.recaptchaVerifier2 =new RecaptchaVerifier(getAuth()  , 'recaptcha-container2', {
      'size': 'normal',
      'callback': (response:any) => {
        console.log("Látható Chapta")
        this.rechapta=true
        this.recaptchaVerifier1=this.recaptchaVerifier2
        response(true)
      },
      'expired-callback': () => {
        this.rechapta=false
        console.log("Látható Chapta Hiba")
        // Response expired. Ask user to solve reCAPTCHA again.
        // ...
      }
    });
  }
  ngOnInit() {
      
  }

  countryCodeChange(event:any){     
    this.CountryCode = event.detail.value;
  }

  signinWithPhoneNumber(event:any){
    this.signIn++;   
    if (this.rechapta){  
      this.sendAuthsignInWithPhoneNumber(this.recaptchaVerifier1)
  }
  }

  sendAuthsignInWithPhoneNumber(veri:any){
    this.auth.signInWithPhoneNumber(veri, this.CountryCode + this.phoneNo).then(
      () => {
        console.log("rendben")
        this.OtpVerification();
      })
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
      },
    ],
    buttons: [{
      text: 'Enter',
      handler: (res) => {
        this.auth.enterVerificationCode(res.otp).then(
          userData => {

            console.log("UserData",userData);
            this.router.navigate(['/home'])
          }
        ).catch((h)=>{
          console.log("1- Hibás kód: ",h)
          this.rechapta=false            
          this.recaptchaVerifier2.render()       
        }
        );
      }
    }
    ]
  });
  await alert.present();
}

}