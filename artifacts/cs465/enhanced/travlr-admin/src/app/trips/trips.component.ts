import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TripsService } from '../trips.service';
import { Trip } from '../trips.service';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, RouterModule, TripCardComponent],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class TripsComponent implements OnInit {

  trips = signal<Trip[]>([]);

  constructor(private tripsService: TripsService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripsService.getTrips().subscribe({
      next: (trips) => this.trips.set(trips),
      error: (err) => console.error('Failed to load trips:', err)
    });
  }

  deleteTrip(code: string): void {
    this.tripsService.deleteTrip(code).subscribe({
      next: () => this.loadTrips(),
      error: (err) => console.error('Failed to delete trip:', err)
    });
  }
}
