import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentRoute: string = '';
  loading$: Observable<boolean>;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationStart | NavigationEnd =>
            event instanceof NavigationStart || event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loadingService.setLoading(true);
        } else if (event instanceof NavigationEnd) {
          this.loadingService.setLoading(false);
          this.currentRoute = event.urlAfterRedirects;
        }
      });

    this.loading$ = this.loadingService.loading$;
  }
}
