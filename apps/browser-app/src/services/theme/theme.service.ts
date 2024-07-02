import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme: string;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this._theme = 'light';
  }

  switchTheme(): void {
    const themeLink: HTMLLinkElement = document.getElementById('app-theme') as HTMLLinkElement;
    const stylesLink: HTMLLinkElement = document.getElementById('app-styles') as HTMLLinkElement;

    if (this._theme === 'light') {
      this._theme = 'dark';
    } else if (this._theme === 'dark') {
      this._theme = 'light';
    }

    themeLink.href = `${this._theme}-theme.css`;
    stylesLink.href = `${this._theme}-styles.css`;
  }
}
