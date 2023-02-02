import {
  SensesTranslateCompiler,
  SensesTranslateParser,
} from '@senses/shared-translate';

import {
  TranslateCompiler,
  TranslateModule,
  TranslateParser,
} from '@ngx-translate/core';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CostCalculatorFeatureDialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      compiler: {
        provide: TranslateCompiler,
        useClass: SensesTranslateCompiler,
      },
      parser: { provide: TranslateParser, useClass: SensesTranslateParser },
    }),
  ],
  providers: [],
  declarations: [CostCalculatorFeatureDialogComponent],
  exports: [CostCalculatorFeatureDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CostCalculatorComponentsModule {}
