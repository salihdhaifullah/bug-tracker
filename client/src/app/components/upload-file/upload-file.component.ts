import { FilesService } from './../../../services/api.service';
import { Component, Input } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/MyErrorStateMatcher';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICreateFille } from 'src/types/Filles';
import { Static } from 'src/Static';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html'
})
export class UploadFileComponent {

  matcher = new MyErrorStateMatcher();

  @Input() updateFile: string | undefined;
  DescriptionFormControl = new FormControl(``, [Validators.required, Validators.minLength(16)]);
  FileFormControl = new FormControl<File | null>(null, [Validators.required]);

  FileError: string | undefined;
  FileHimSelf: File | undefined;

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

  constructor(private filesService: FilesService) { }


  HandelSubmit(event: Event) {
    event.preventDefault();
    if (this.fileForm.valid) {
      const formData = new FormData();
      if (this.FileHimSelf) {


        formData.append("file", this.FileHimSelf, this.FileHimSelf.name);




        this.filesService.UploadFile(formData, this.fileForm.get("Description")?.value as string,  Static.getIdParams(document.location.href))
          .subscribe(res => {
            console.log(res);
            Swal.fire({
              title: 'Success',
              text: 'File Uploaded Successfully',
              icon: 'success'
            }).then(() => {
              this.fileForm.reset();
            })
          }, error => {
            console.log(error);
            Swal.fire({
              title: 'Error',
              text: 'Something went wrong',
              icon: 'error'
            });

          });

      }
    }
  }

}
