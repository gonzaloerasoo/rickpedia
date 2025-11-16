import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }
}
