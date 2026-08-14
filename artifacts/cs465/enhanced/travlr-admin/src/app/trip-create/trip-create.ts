import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripsService } from '../trips.service';
import { Trip } from '../trips.service';

@Component({
  selector: 'app-trip-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-create.html',
  styleUrls: ['./trip-create.css']
})
export class TripCreateComponent {

  trip: Trip = {
    code: '',
    name: '',
    length: 0,
    price: 0,
    start: '',
    description: ''
  };

  constructor(
    private router: Router,
    private tripsService: TripsService
  ) {}

  saveTrip(): void {
    this.tripsService.createTrip(this.trip).subscribe(() => {
      alert('Trip created successfully');
      this.router.navigate(['/trips']);
    });
  }

  cancel(): void {
    this.router.navigate(['/trips']);
  }
}
