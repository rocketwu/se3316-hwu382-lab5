import { Component, OnInit } from '@angular/core';
import {PolicyService} from '../policy.service';
import {ToastrService} from 'ngx-toastr';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {

  constructor(private  pService: PolicyService,
              private notify: ToastrService,
              public dialogRef: MatDialogRef<PolicyComponent>) { }

  ngOnInit() {
    this.pService.update();
  }

  get policy(): string {
    return this.pService.policy;
  }

  set policy(value) {
    this.pService.policy = value;
  }

  updatePolicy(){
    this.pService.putPolicy(this.policy).subscribe(data => {
      if (data.status == '0'){
        this.notify.error(data.message, 'Fail',
          {timeOut: 1000 * 3,
            positionClass: 'toast-center-center'
          });
        if (data.message === 'Login status expired') {
          localStorage.clear();
        }
      } else if (data.status == '1'){
        this.notify.success(data.message, 'Updated',
          {timeOut: 1000 * 3,
            positionClass: 'toast-center-center'
          });
        this.dialogRef.close();
      }
    });
  }

  get manageMode(): boolean {
    return (localStorage.getItem('manageMode') == 'true');
  }

}
