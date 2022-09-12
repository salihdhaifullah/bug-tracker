import { Component, Input } from '@angular/core';
import { CommentsService } from 'src/services/api.service';
import { Static } from 'src/Static';
import Swal from 'sweetalert2';
import { User } from 'src/types/User';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/context/app.state';
import { commentsSelector } from 'src/context/selectors';
import * as Actions from 'src/context/actions'
import * as moment from 'moment';
import { Comments } from 'src/types/Comments';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent {
  comments$: Observable<Comments[]>;
  _moment: any = moment;

  @Input() comment: Comments | null = null;

  constructor(private store: Store<IAppState>, private commentsService: CommentsService) {
    this.comments$ = this.store.pipe(select(commentsSelector));
  }

  isFoundUser = localStorage.getItem('user');
  user: User = this.isFoundUser && JSON.parse(this.isFoundUser)
  userId: number | null = Static.getIdFromJwtToken(this.user.token)
  visibleMenu: boolean = false;
  isLoading: boolean = false;

  HandelMore() {
    this.visibleMenu = !this.visibleMenu
  }

  HandelDelete(id: number) {

    Swal.fire({
      title: 'warning',
      icon: 'warning',
      text: 'do you want to delete this comment',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;
        this.commentsService.DeleteComment(id).subscribe((res) => {

        }, err => {
          console.log(err)
          if (err) Swal.fire('Something went wrong', "", "error")
        }, () => {
          this.store.dispatch(Actions.getComments({ TicketId: Static.getIdParams(document.location.href) }))
          this.isLoading = false;
        })

      }
    })

  }

  HandelUpdate(id: number) {
  }


}
