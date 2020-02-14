import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  constructor(private authService: AuthService,private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {    
    this.authService.register(this.model).subscribe(() =>{
      this.alertify.success('Registration Successful!!!');
    },
    error =>{
      this.alertify.error(error);
    }
    );
  }

  cancel() {
    console.log('cancelled');
    this.cancelRegister.emit(false);
  }

}
