import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private backendService: BackendService) { }

  ngOnInit() {

    // initial request to get csrf token from server.
    const url = "csrf";
    this.backendService.doGet<String>(url, 'text').subscribe(res => {
      console.log(res);
    });
  }
}
