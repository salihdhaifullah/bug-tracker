import Swal  from 'sweetalert2';
import { Static } from 'src/Static';
import { Component, OnInit } from '@angular/core';
import { CommentsService } from 'src/services/api.service';
import { select, Store } from '@ngrx/store';
import { IAppState } from 'src/context/app.state';
import { Observable } from 'rxjs';
import { Comments } from 'src/types/Comments';
import { commentsSelector } from 'src/context/selectors';
import * as Actions from 'src/context/actions'

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html'
})
export class CommentFormComponent implements OnInit {
  commentInput: HTMLTextAreaElement | null;
  comments$: Observable<Comments[]>;
  
  constructor(private CommentsService: CommentsService, private store: Store<IAppState>) {
    this.commentInput = null;
    this.comments$ = this.store.pipe(select(commentsSelector));
  }


  ngOnInit(): void {
    this.commentInput = document.getElementById("comment") as HTMLTextAreaElement
  }

  HandelComment() {
    if (this.commentInput && this.commentInput.value) 
      this.CommentsService.CreateComment(this.commentInput.value, Static.getIdParams(document.location.href)).subscribe(res => {
        
      }, err => {
        Swal.fire({
          title: 'Something went wrong',
          icon: 'error'
        })
      } , () => {
        console.log('disptsh action to get latest comments')
        this.store.dispatch(Actions.getComments({ TicketId: Static.getIdParams(document.location.href) }))

      });
  }

  HandelCancel() {
    if (this.commentInput) this.commentInput.value = "";
  }
}
