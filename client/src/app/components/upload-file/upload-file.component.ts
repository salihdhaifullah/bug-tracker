import { FilesService } from './../../../services/api.service';
import { Component, Input } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Static } from 'src/Static';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/context/app.state';
import * as Actions from 'src/context/actions';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent {

  matcher = new MyErrorStateMatcher();

  @Input() updateFile: string | undefined;

  FileError: string | undefined;
  FileHimSelf: File | undefined;
  
  constructor(private store: Store<IAppState>, private filesService: FilesService) { }

  DescriptionFormControl = new FormControl(``, [Validators.required, Validators.minLength(16)]);
  FileFormControl = new FormControl<File | null>(null, [Validators.required]);


  HandelSetFile(event: any) {
    if (event?.target?.files[0]) {
      const file: File = event.target.files[0];
      this.FileHimSelf = file;
      this.FileFormControl.setValue(file);
      console.log(this.FileFormControl.value);
    } else {
      this.FileError = "no file selected";
      console.log("no file selected");
    }

  }

  fileForm = new FormGroup({
    Description: this.DescriptionFormControl,
    file: this.FileFormControl
  });



  HandelSubmit(event: Event) {
    
    event.preventDefault();
    if (this.fileForm.valid) {
      const formData = new FormData();
      if (this.FileHimSelf) {
        formData.append("file", this.FileHimSelf, this.FileHimSelf.name);

        this.filesService.UploadFile(formData, this.fileForm.get("Description")?.value as string,  Static.getIdParams(document.location.href))
          .subscribe(res => {}, 
          error => {
            Swal.fire({
              title: 'Error',
              text: 'Something went wrong',
              icon: 'error'
            });
          }, () => {
            this.fileForm.reset()
            this.store.dispatch(Actions.getFiles({TicketId: Static.getIdParams(document.location.href) }));
          });
      };
    }
  }
}