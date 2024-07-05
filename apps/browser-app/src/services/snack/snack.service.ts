import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(
    private readonly snackBar: MatSnackBar
  ) {
  }

  async showSnack(message: string, action: string): Promise<void> {
    this.snackBar.open(message, action);
  }
}
