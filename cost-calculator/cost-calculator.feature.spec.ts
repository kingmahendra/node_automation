import { CostCalculatorFeature } from './cost-calculator.feature';
import {
  SensesTranslateMockService,
  SensesTranslateService,
} from '@senses/shared-translate';

import { PlatformInfoService } from '@senses/common-core';
import { PLATFORM_ID } from '@angular/core';

jest.mock('@angular/common', () => {
  const actualModule = jest.requireActual('@angular/common');
  return {
    ...actualModule,
    isPlatformBrowser: jest.fn(),
  };
});

describe('CostCalculatorFeature', () => {
  let component: CostCalculatorFeature;
  let platformInfoServiceMock: PlatformInfoService;
  const translateMockService: SensesTranslateService =
    SensesTranslateMockService as any;
  const documentMock = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addEventListener: jest.fn(() => {}),
    querySelector: jest.fn(() => {
      return {
        present: jest.fn(),
      };
    }),
    getElementById: jest.fn(() => {
      return {
        present: jest.fn(),
      };
    }),
  } as unknown as any;

  beforeEach(() => {
    platformInfoServiceMock = {
      isDesktop: () => true,
    } as unknown as PlatformInfoService;
    translateMockService.setTranslations = jest.fn();
    component = new CostCalculatorFeature(
      translateMockService,
      platformInfoServiceMock,
      documentMock,
      PLATFORM_ID
    );
  });

  it('should instantiate', () => {
    expect(component).toBeTruthy();
    expect(component).toBeInstanceOf(CostCalculatorFeature);
  });
  it('should initialize', () => {
    component.data = {
      inlayAmount: '20000',
      productTypeCode: 'ACTS',
      disclaimerText: 'De kostentabel is gebseerd op de lange termijn.',
      additionalInfoLinkText: 'Optional Link',
      additionalInfoContent: 'additionalInfoContent',
    };

    component.ngOnInit();
    expect(component.isDesktop).toEqual(true);
    expect(component.currentLang).toEqual('en');
    expect(component.isAdditionalInfoContentPresent).toEqual(true);
  });
  it('calculateCosts when investmentAmount < 200000', () => {
    component.investmentAmount = 50000;
    const calculateBaseCosts = Number(
      component.calculateBaseCosts(component.investmentAmount)
    );
    expect(calculateBaseCosts).toEqual(30.0);
  });
  it('calculateCosts when  500000 < investmentAmount > 2000000', () => {
    component.investmentAmount = 1000000;
    const calculateBaseCosts = Number(
      component.calculateBaseCosts(component.investmentAmount)
    );
    expect(calculateBaseCosts).toEqual(230);
  });
  it('calculateCosts when  investmentAmount >= 500000', () => {
    component.investmentAmount = 600000;
    const calculateBaseCosts = Number(
      component.calculateBaseCosts(component.investmentAmount)
    );
    expect(calculateBaseCosts).toEqual(calculateBaseCosts);
  });
  it('calculateCosts when  investmentAmount >= 2000000', () => {
    component.investmentAmount = 3000000;
    const calculateBaseCosts = Number(
      component.calculateBaseCosts(component.investmentAmount)
    );
    expect(calculateBaseCosts).toEqual(355.0);
  });
  it('calculateCosts when  investmentAmount > 2000000', () => {
    component.investmentAmount = 2000000;
    const returnCost = Number(
      component.calculateBaseCosts(component.investmentAmount)
    );
    expect(returnCost).toEqual(330);
  });
  it('calculateBaseCosts defined', () => {
    component.investmentAmount = 200000;
    component.productCode = 'PASV';
    component.calculateCosts(component.investmentAmount);
    expect(component.baseCostsPerQuarter).toBeDefined();
    expect(component.portfolioCostsPerQuarter).toBeDefined();
    expect(component.investmentCostsMinPerQuarter).toBeDefined();
    expect(component.calculateInvestmentCostsMax).toBeDefined();
    expect(component.yearlyCostsMin).toBeDefined();
    expect(component.yearlyCostsMax).toBeDefined();
  });
  it('calculatePortfolioCosts if investmentType is Active and amount < 1000000', () => {
    const amount = 90000;
    const investmentType = 'ACTV';
    const cost = Number(
      component.calculatePortfolioCosts(amount, investmentType)
    );
    expect(cost).toEqual(144.0);
  });
  it('calculatePortfolioCosts if investmentType is Active and amount >= 1000000', () => {
    const amount = 110000;
    const investmentType = 'ACTV';
    const cost = Number(
      component.calculatePortfolioCosts(amount, investmentType)
    );
    expect(cost).toEqual(174);
  });
  it('calculatePortfolioCosts if investmentType is Basis and amount < 1000000', () => {
    const amount = 90000;
    const investmentType = 'PASV';
    const cost = Number(
      component.calculatePortfolioCosts(amount, investmentType)
    );
    expect(cost).toEqual(90);
  });

  it('calculateInvestmentCostsMin if investmentType is Active', () => {
    const amount = 100000;
    const investmentType = 'ACTV';
    const calculateInvestmentCostsMin = Number(
      component.calculateInvestmentCostsMin(amount, investmentType)
    );
    expect(calculateInvestmentCostsMin).toEqual(250);
  });
  it('calculateInvestmentCostsMin if investmentType is Active Sustainable', () => {
    const amount = 100000;
    const investmentType = 'ACTS';
    const calculateInvestmentCostsMin = Number(
      component.calculateInvestmentCostsMin(amount, investmentType)
    );
    expect(calculateInvestmentCostsMin).toEqual(500);
  });
  it('calculateInvestmentCostsMax if investmentType is Active', () => {
    const amount = 100000;
    const investmentType = 'ACTV';
    const calculateInvestmentCostsMax = Number(
      component.calculateInvestmentCostsMax(amount, investmentType)
    );
    expect(calculateInvestmentCostsMax).toEqual(350.0);
  });
  it('calculateInvestmentCostsMax if investmentType is Active Sustainable', () => {
    const amount = 100000;
    const investmentType = 'ACTS';
    const calculateInvestmentCostsMax = Number(
      component.calculateInvestmentCostsMax(amount, investmentType)
    );
    expect(calculateInvestmentCostsMax).toEqual(600.0);
  });
  it('should remove the leading zero if the value is zero on focus', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const event: any = {
      target: {
        value: '0',
      },
    };
    component.onInputMoneyFocus();
    expect(component.investmentAmount).toEqual('');
    component.investmentAmount = 500;
    component.onInputMoneyFocus();
    expect(component.investmentAmount).toEqual('');
  });
  // eslint-disable-next-line jest/no-identical-title
  it('should remove the leading zero if the value is zero on focus', () => {
    const event: any = {
      target: {
        value: 10000,
      },
    };
    component.updateValue(event);
    expect(component.investmentAmount).toEqual(10000);
  });
  it('should open the model dialog', () => {
    component.openModal('cost-table-dialog');
    expect(documentMock.getElementById).toHaveBeenCalledWith(
      'cost-table-dialog'
    );
  });
});
