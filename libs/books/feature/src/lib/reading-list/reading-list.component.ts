import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  getReadingList,
  removeFromReadingList,
} from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book, ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private _snackBar: MatSnackBar) {}

  undoRemoveFromReadingList(item: ReadingListItem) {
    const itemToKeep: Book = {
      title: item.title,
      authors: item.authors,
      description: item.description,
      id: item.bookId,
      coverUrl: item.coverUrl,
    };
    this.store.dispatch(addToReadingList({ book: itemToKeep }));
  }

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    const message = `Removed ${item.title} from reading list.`;
    this._snackBar
      .open(message, 'Undo', {
        duration: 2000,
      })
      .onAction()
      .subscribe(() => {
        this.undoRemoveFromReadingList(item);
      });
  }
}
