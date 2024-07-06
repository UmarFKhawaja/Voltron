import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor(
    private matIconReg: MatIconRegistry
  ) {
  }

  setIconSet(): void {
    this.matIconReg.setDefaultFontSetClass('material-symbols-outlined');
  }
}
