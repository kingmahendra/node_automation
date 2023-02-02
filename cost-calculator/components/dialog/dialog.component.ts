import { SensesTranslateService } from '@senses/shared-translate';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'feature-cost-table-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class CostCalculatorFeatureDialogComponent {
  @Input()
  productCode: string;
  currentLang: string;

  constructor(private _translateService: SensesTranslateService) {
    this.currentLang = this._translateService.currentLang;
  }
}
