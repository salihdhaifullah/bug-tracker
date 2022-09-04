import { Static } from 'src/Static';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IAppState } from 'src/context/app.state';
import { commentsSelector } from 'src/context/selectors';
import { Comments } from 'src/types/Comments';
import * as Actions from 'src/context/actions';
import { CommentsService } from 'src/services/api.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html'
})

export class CommentsComponent implements OnInit {
  comments$: Observable<Comments[]>;
  comments: Comments[] = [];

  constructor(private store: Store<IAppState>, private commentsService: CommentsService) {
    this.comments$ = this.store.pipe(select(commentsSelector));
  }

  ngOnInit(): void {
    this.store.dispatch(Actions.getComments({ TicketId: Static.getIdParams(document.location.href) }));

    this.comments$.subscribe((x: any) => this.comments = x.comments);
  }
}
