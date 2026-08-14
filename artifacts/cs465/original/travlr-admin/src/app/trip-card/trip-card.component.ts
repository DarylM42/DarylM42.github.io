import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Trip } from '../trips.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.css'],
})
export class TripCardComponent {

  @Input() trip!: Trip;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.trip.code);
  }
}
