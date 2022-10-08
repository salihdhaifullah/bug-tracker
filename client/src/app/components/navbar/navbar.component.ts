import { FilesService, TicketsService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { User } from 'src/types/User';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(private filesService : FilesService, private ticketsService: TicketsService) { }
  data: number = 0;
  isUser = localStorage.getItem("user");
  user: User = this.isUser && JSON.parse(this.isUser);

  ngOnInit(): void {
  this.ticketsService.GetTicketLength().subscribe(data => {
    this.data = data.count
  }, err => {}, () => {
    console.log(this.data);
  });
  }

  HandelUploadAvatar(event: any) {
    const file: File | undefined = event?.target?.files[0];    
    if(file !== undefined) {

      const formData = new FormData();

      formData.append("file", file, file.name);
      
      this.filesService.UploadAvatar(formData).subscribe((res: any) => {
        console.log(res);

        if(this.user && res.avatarUrl) {
          this.user.avatarUrl = res.avatarUrl;
          localStorage.setItem("user", JSON.stringify(this.user));
        }
        Swal.fire({
          title: 'Success',
          text: 'Avatar uploaded successfully',
          icon: 'success'
        });

      } , err => {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: 'Error uploading avatar',
          icon: 'error'
        });

      } );

      
    }
    



  }

}
