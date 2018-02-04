import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {selectPodcastItems} from '../podcast.reducer';
import {skip, take} from 'rxjs/operators';
import {Direction, Item, Page} from '../../../shared/entity';
import {FindItemsByPodcastsAndPageAction} from '../podcast.actions';
import {AppState} from '../../../app.reducer';

@Injectable()
export class PodcastItemsResolver implements Resolve<Page<Item>> {

  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Page<Item>> {
    this.store.dispatch(new FindItemsByPodcastsAndPageAction(route.params.id, {page: 0, size: 10, sort: [{property: 'pubDate', direction: Direction.DESC}] }));

    return this.store.select(selectPodcastItems).pipe(
      skip(1),
      take(1)
    );
  }
}

export function toPodcastPageOfItems(d: any) {
  return d.items;
}
