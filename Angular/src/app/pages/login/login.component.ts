import { Component, OnInit } from '@angular/core';
import { LoginHelperService } from '../../core/services/login-helper.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(3)]),
  });

  hide = true;

  userForm = this.formBuilder.group({
    primaryEmail: ['', Validators.email],
    secondaryEmail: '',
 }); 

  constructor(public loginHelper : LoginHelperService, private formBuilder : FormBuilder) {}

  ngOnInit() {
    this.loginHelper.getCookies();
    this.loginHelper.setCookies();
  }

  setConnection() {
    console.log(this.signin.get('email')?.value);
    console.log(this.signin.get('password')?.value);
    this.loginHelper.sendLogin(this.signin.get('email')?.value, this.signin.get('password')?.value);
    // console.log(AES.encrypt( password, "password").toString());
  }

  onSubmit() {
    console.log('submit');
  }
}
