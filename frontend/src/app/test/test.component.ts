import { Component, OnInit, Input } from '@angular/core';
import {FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  signUpForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(private  notify: ToastrService) { }
  ngOnInit(): void {


  }

  onSubmit(){
    this.notify.success('hello world', 'gg', {timeOut: 100 * 1000,
      positionClass: 'toast-center-center'});
  }

}
