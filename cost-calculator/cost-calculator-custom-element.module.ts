import {
  CUSTOM_ELEMENTS_SCHEMA,
  DoBootstrap,
  Injector,
  NgModule,
} from '@angular/core';

import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MODULE_NAME, SensesTranslateService } from '@senses/shared-translate';

import { APP_BASE_HREF } from '@angular/common';
import { CostCalculatorFeature } from './cost-calculator.feature';
import { CostCalculatorComponentsModule } from './components/components.module';
import { RouterModule } from '@angular/router';
import {
  logCollectorIdToken,
  LogCollectorService,
} from '@senses/shared-services-logcollector';

import { BrowserLogger } from '@senses/core';
import { environment } from '@senses/everywhere-environment';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    CostCalculatorComponentsModule,
    RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
  ],
  providers: [
    { provide: MODULE_NAME, useValue: 'cost-calculator' },
    { provide: APP_BASE_HREF, useValue: '/' },
    SensesTranslateService,
    LogCollectorService,
    {
      provide: logCollectorIdToken,
      useValue: 'cost-calculator',
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CostCalculatorCustomElementModule implements DoBootstrap {
  constructor(
    private readonly injector: Injector,
    private readonly translateService: SensesTranslateService
  ) {}

  ngDoBootstrap() {
    this.translateService.use('nl');
    BrowserLogger.setEndpointUrl(environment.loggerEndpointURL);
    BrowserLogger.setAppMetadata({
      appData: {
        appName: 'cost-calculator',
        appVersion: '0.1',
      },
      cookieNames: {
        sessionId: 'RABOBANK_SESSIE',
        raboInfo: 'RABOINFO',
        visitorId: 'RABOBANK_BEZOEKER',
        optIn: 'RABOBANK_OPTINOUT',
        language: 'RABO_LANG',
      },
    });
    const customElement = createCustomElement(CostCalculatorFeature, {
      injector: this.injector,
    });

    customElements.define(
      'senses-feature-cost-calculator',
      customElement as any
    );
  }
}
