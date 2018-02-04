import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Direction, Item, Page, Pageable, SearchItemPageRequest, uuid} from '../../entity';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable()
export class ItemService {

  constructor(private http: HttpClient) {}

  search(searchPageRequest: SearchItemPageRequest): Observable<Page<Item>> {
    const params = toSearchParams(searchPageRequest);
    return this.http.get<Page<Item>>('/api/items/search', { params });
  }

  findByPodcastAndPage(id: string, page: Pageable): Observable<Page<Item>> {
    const params = toParams(page);
    return this.http.get<Page<Item>>(`/api/podcasts/${id}/items`, { params });
  }

  findById(itemId: uuid, podcastId: uuid): Observable<Item> {
    return this.http.get<Item>(`/api/podcasts/${podcastId}/items/${itemId}`);
  }

}

function toSearchParams(request: SearchItemPageRequest): HttpParams {
  // downloaded=true&page=0&size=12&sort=pubDate,DESC&tags=

  let params = toParams(request)
    .set('q', request.q || '')
    .set('tags', request.tags.map(t => t.name).join(','));

  if (request.status && request.status.length > 0) {
    params = params.set('status', String(request.status));
  }

  return params;
}

function toParams(page: Pageable) {
  return new HttpParams()
    .set('page', String(page.page))
    .set('size', String(page.size))
    .set('sort', page.sort.map(s => `${s.property},${s.direction}`).join(','));
}


export const defaultSearch: SearchItemPageRequest = {
  q: null,
  page: 0,
  size: 12,
  status: [],
  tags: [],
  sort: [{property: 'pubDate', direction: Direction.DESC}]
};
