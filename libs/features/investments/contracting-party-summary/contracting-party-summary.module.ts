import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  TranslateCompiler,
  TranslateModule,
  TranslateParser,
} from '@ngx-translate/core';
import { ToggleModule } from '@senses/feature-toggle';
import {
  AgreementSummaryCardHeaderModule,
  AgreementVersionResetGQL,
  AgreementVersionsGQL,
  InvestmentAgreementVersionService,
  LatestAgreementVersionGQL,
  RelationHouseholdService,
} from '@senses/investments-shared-lib';
import {
  logCollectorIdToken,
  LogCollectorService,
} from '@senses/shared-services-logcollector';
import {
  MODULE_NAME,
  SensesTranslateCompiler,
  SensesTranslateParser,
  SensesTranslateService,
} from '@senses/shared-translate';

import { EmployeeOnlyBannerComponent } from './components/employee-only-banner';
import { ContractingPartySummaryFeature } from './contracting-party-summary.feature';
import toggles from './contracting-party-summary.toggles';

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
    ToggleModule.forFeature(toggles),
    AgreementSummaryCardHeaderModule,
  ],
  exports: [ContractingPartySummaryFeature, TranslateModule],
  declarations: [ContractingPartySummaryFeature, EmployeeOnlyBannerComponent],
  providers: [
    LogCollectorService,
    {
      provide: logCollectorIdToken,
      useValue: 'feature-contracting-party-summary',
    },
    { provide: MODULE_NAME, useValue: 'CONTRACTING_PARTY_SUMMARY' },
    SensesTranslateService,
    InvestmentAgreementVersionService,
    RelationHouseholdService,
    AgreementVersionsGQL,
    LatestAgreementVersionGQL,
    AgreementVersionResetGQL,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContractingPartySummaryFeatureModule {}
