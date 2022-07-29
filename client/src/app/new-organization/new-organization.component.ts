import { ICreateOrganizationFormData } from './../../model/FormData';
import { Component } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { OrganizationService } from 'src/services/my-test.service';



export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-new-organization',
  templateUrl: './new-organization.component.html'
})
export class NewOrganizationComponent  {

  constructor(private Organization: OrganizationService) { }
  
  NameFormControl = new FormControl('', [Validators.required]);
  DescriptionFormControl = new FormControl('', [Validators.required, Validators.minLength(10)]);
  LogoFormControl = new FormControl('');

  OrganizationForm = new FormGroup({
    Name: this.NameFormControl,
    Description: this.DescriptionFormControl,
    Logo: this.LogoFormControl,
  })

  HandelSubmit = (event: Event) => {
    event.preventDefault();
    this.Organization.CreateOrganization(this.OrganizationForm.value as ICreateOrganizationFormData).subscribe(
      data => {
        console.log(data);
        this.OrganizationForm.reset()
      });
  }
}
