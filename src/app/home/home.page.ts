import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  messages:any
  newMessage:any
  userName="Attila"
  constructor(private base:BaseService, public router:Router, private auth:AuthServiceService) {
    
    this.auth.usersub.subscribe(
      (res)=>console.log("User", res)
    )
    
    this.base.getMessages().snapshotChanges().pipe(
      map(
        (ch)=> ch.map(
          (c)=>({key: c.payload.key, ...c.payload.val()})
        )
      )
    ).subscribe(
      (res)=>this.messages=res
    )
  }


  addMessage(){
    if (this.newMessage){
      let time= new Date().toLocaleTimeString()
      let body = {user:this.userName, time:time, message:this.newMessage}
      this.base.addMessage(body)
      this.newMessage=""
     }
  }

  updateMessage(message:any){
    this.base.updateMessage(message)
  }


  deleteMessage(message:any){
    this.base.deleteMessage(message)
  }
  logout(){
    this.auth.logout()
  }
}
