import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';

import {
  TranslateCompiler,
  TranslateModule,
  TranslateParser,
} from '@ngx-translate/core';

import {
  MODULE_NAME,
  SensesTranslateCompiler,
  SensesTranslateParser,
  SensesTranslateService,
} from '@senses/shared-translate';

import {
  logCollectorIdToken,
  LogCollectorService,
} from '@senses/shared-services-logcollector';

import { CostCalculatorFeature } from './cost-calculator.feature';
import { CostCalculatorComponentsModule } from './components/components.module';
import { SensesSfcModalFixModule } from '@senses/sfc-modal-fix';

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
    CostCalculatorComponentsModule,
    SensesSfcModalFixModule,
  ],
  exports: [TranslateModule, CostCalculatorFeature],
  declarations: [CostCalculatorFeature],
  providers: [
    LogCollectorService,
    {
      provide: logCollectorIdToken,
      useValue: 'feature-cost-calculator',
    },
    { provide: MODULE_NAME, useValue: 'COST_CALCULATOR' },
    SensesTranslateService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CostCalculatorFeatureModule {
  static entry: Type<CostCalculatorFeature> = CostCalculatorFeature;
}
