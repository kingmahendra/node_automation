import { Component } from '@angular/core';
import { SensesTranslateService } from '@senses/shared-translate';

import { translations } from './employee-only-banner.translate';

@Component({
  selector: 'employee-only-banner-component',
  templateUrl: './employee-only-banner.html',
  styles: [
    `
      .employee-only-label {
        border-radius: 4px;
      }
    `,
  ],
})
export class EmployeeOnlyBannerComponent {
  constructor(translateService: SensesTranslateService) {
    translateService.setTranslations(translations);
  }
}
