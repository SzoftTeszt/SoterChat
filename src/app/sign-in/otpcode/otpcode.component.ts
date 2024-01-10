import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-otpcode',
  templateUrl: './otpcode.component.html',
  styleUrls: ['./otpcode.component.scss'],
})
export class OtpcodeComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  public alertButtons = ['OK'];
  public alertInputs = [
    {
      placeholder: 'Name',
    },
    {
      placeholder: 'Nickname (max 8 characters)',
      attributes: {
        maxlength: 8,
      },
    },
    {
      type: 'number',
      placeholder: 'Code',
      min: 1,
      max: 999999,
    },
    // {
    //   type: 'textarea',
    //   placeholder: 'A little about yourself',
    // },
  ];
}