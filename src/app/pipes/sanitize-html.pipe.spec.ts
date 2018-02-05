import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { inject } from '@angular/core/testing';

describe('SanitizeHtmlPipe', () => {
  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new SanitizeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));
});
