import { Component, OnInit } from '@angular/core';
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

  trips: Trip[] = [];

  constructor(private tripsService: TripsService) {}

  ngOnInit(): void {
    this.tripsService.getTrips().subscribe(data => {
      this.trips = data;
    });
  }

  deleteTrip(code: string): void {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    this.tripsService.deleteTrip(code).subscribe(() => {
      this.trips = this.trips.filter(t => t.code !== code);
    });
  }
}
