import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TripsService } from '../trips.service';
import { Trip } from '../trips.service';

@Component({
  selector: 'app-trip-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-edit.html',
  styleUrls: ['./trip-edit.css']
})
export class TripEditComponent implements OnInit {

  trip?: Trip;
  originalCode = '';
  saveError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tripsService: TripsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code')!;
    this.originalCode = code;
    this.tripsService.getTrip(code).subscribe({
      next: (data: Trip) => {
        this.trip = {
          ...data,
          // HTML date input expects YYYY-MM-DD.
          start: new Date(data.start).toISOString().slice(0, 10)
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saveError = err?.error?.message || 'Unable to load trip details.';
        this.cdr.detectChanges();
      }
    });
  }

  saveTrip(): void {
    if (!this.trip || !this.originalCode) return;

    this.saveError = '';
    this.tripsService.updateTrip(this.originalCode, this.trip)
      .subscribe({
        next: (updatedTrip) => {
          this.originalCode = updatedTrip.code;
          alert('Trip updated successfully');
          this.router.navigate(['/trips']);
        },
        error: (err) => {
          this.saveError = err?.error?.message || 'Unable to update trip. Please try again.';
          this.cdr.detectChanges();
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/trips']);
  } 
}
