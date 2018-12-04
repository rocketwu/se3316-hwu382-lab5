import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {Dcma} from '../models/dcma';
import {DcmaService} from '../dcma.service';

@Component({
  selector: 'app-dcma',
  templateUrl: './dcma.component.html',
  styleUrls: ['./dcma.component.css']
})
export class DcmaComponent implements OnInit {

  issuer = new FormControl('', [Validators.required]);
  content = new FormControl('', [Validators.required]);
  contact = new FormControl('', [Validators.required]);
  requestForm = new FormGroup({
    issuer: this.issuer,
    content: this.content,
    contact: this.contact
  });
  confirm = false;
  constructor(private notify: ToastrService,
              public dialogRef: MatDialogRef<DcmaComponent>,
              private  ds: DcmaService
  ) { }

  ngOnInit() {

  }

  onSubmit() {
    const newDcma = new Dcma();
    newDcma.issuer = this.issuer.value;
    newDcma.contact = this.contact.value;
    newDcma.content = this.content.value;
    this.ds.postDcma(newDcma).subscribe(res => {
      if (res.status == 1) {
        this.notify.success('',
          'Submit Success',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
      } else {
        this.notify.warning(res.message, 'Submit Fail',
          {timeOut: 1000 * 2,
            positionClass: 'toast-center-center'
          });
      }
    });
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }

}
