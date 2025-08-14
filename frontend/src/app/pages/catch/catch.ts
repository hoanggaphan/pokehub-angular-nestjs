import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catch',
  standalone: true,
  imports: [],
  templateUrl: './catch.html',
  styleUrl: './catch.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catch {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/pokemon']);
  }
}
