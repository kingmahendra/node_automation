import { SensesTranslateService } from '@senses/shared-translate';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';

import { translations } from './cost-calculator.translate';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PlatformInfoService } from '@senses/common-core';

@Component({
  selector: 'feature-cost-calculator',
  templateUrl: './cost-calculator.feature.html',
  styleUrls: ['./cost-calculator.feature.css'],
})
export class CostCalculatorFeature implements OnInit {
  @Input()
  data: any;
  currentLang: string;
  productCode: string;
  investmentAmount: any;
  baseCostsPerQuarter: number;
  portfolioCostsPerQuarter: number;
  investmentCostsMaxPerQuarter: number;
  investmentCostsMinPerQuarter: number;
  yearlyCostsMin: number;
  yearlyCostsMax: number;
  isDesktop: any;
  disclaimerText: string;
  additionalInfoContent: any;
  isAdditionalInfoContentPresent = false;
  additionalInfoLinkText: string;
  isLoadingState = true;

  constructor(
    private _translateService: SensesTranslateService,
    private platformInfoService: PlatformInfoService,
    @Inject(DOCUMENT)
    private document: any,
    @Inject(PLATFORM_ID)
    private readonly platformId: unknown
  ) {
    this.currentLang = this._translateService.currentLang;
  }

  ngOnInit() {
    this._translateService.setTranslations(translations);
    this.isDesktop = this.platformInfoService.isDesktop();
    /**
     * For Global Sites Library, we receive the inputs directly.
     * Hence we check if the data is already available, then we
     * call the initialize data method. For the regular RFS sites
     * we get the data from Tridion and hence we need to listen to
     * the DOMContentLoaded event and then use the data
     */
    if (this.data && this.data.productTypeCode && this.data.inlayAmount) {
      this.initializeData();
    } else {
      if (isPlatformBrowser(this.platformId)) {
        document.addEventListener('DOMContentLoaded', () => {
          this.initializeData();
        });
      }
    }
  }

  /**
   * Function to initialize the data based on the input we
   * receive from Tridion or Global Sites
   */
  initializeData() {
    this.productCode = this.data.productTypeCode;
    this.investmentAmount = Number(this.data.inlayAmount);
    this.disclaimerText = this.data.disclaimerText;
    this.additionalInfoLinkText = this.data.additionalInfoLinkText;
    // eslint-disable-next-line no-prototype-builtins
    this.isAdditionalInfoContentPresent = this.data.hasOwnProperty(
      'additionalInfoLinkText'
    );
    if (
      this.isAdditionalInfoContentPresent &&
      this.additionalInfoLinkText !== ''
    ) {
      this.additionalInfoContent = this.data.additionalInfoContent;
    }
    this.calculateCosts(this.investmentAmount);
    this.isLoadingState = false;
  }

  /* Update the input money fields with the new changed value */
  updateValue(event) {
    this.investmentAmount = event.target.value;
  }

  /* Main function to call the other methods which calculates investment costs */
  calculateCosts(amount) {
    this.baseCostsPerQuarter = this.calculateBaseCosts(amount);
    this.portfolioCostsPerQuarter = this.calculatePortfolioCosts(
      amount,
      this.productCode
    );
    this.investmentCostsMinPerQuarter =
      this.calculateInvestmentCostsMin(amount, this.productCode) / 4;
    this.investmentCostsMaxPerQuarter =
      this.calculateInvestmentCostsMax(amount, this.productCode) / 4;
    if (this.productCode === 'PASV') {
      this.yearlyCostsMin = this.calculeteYealyMinCostBasis(
        this.baseCostsPerQuarter,
        this.portfolioCostsPerQuarter
      );
    } else {
      this.yearlyCostsMin = this.calculateYearlyCosts(
        this.baseCostsPerQuarter,
        this.portfolioCostsPerQuarter,
        this.investmentCostsMinPerQuarter
      );
    }
    this.yearlyCostsMax = this.calculateYearlyCosts(
      this.baseCostsPerQuarter,
      this.portfolioCostsPerQuarter,
      this.investmentCostsMaxPerQuarter
    );
  }

  /* This function calculates the base cost based on the investmentAmount */
  calculateBaseCosts(amount) {
    const investmentAmount = parseInt(amount) || 0;
    const MINIMUM_COST = 5.0;
    const COST_UPTO_HUNDRED_THOUSAND = 60;
    const COST_UPTO_FIVE_HUNDRED_THOUSAND = 180;
    const COST_UPTO_TWO_MILLIONS = 330;
    let costs;
    if (investmentAmount < 100000) {
      costs = ((investmentAmount / 10000) * 6).toFixed(2);
    } else if (investmentAmount >= 100000 && investmentAmount < 500000) {
      costs = (
        ((investmentAmount - 100000) / 10000) * 3 +
        COST_UPTO_HUNDRED_THOUSAND
      ).toFixed(2);
    } else if (investmentAmount >= 500000 && investmentAmount < 2000000) {
      costs = (
        ((investmentAmount - 500000) / 10000) * 1 +
        COST_UPTO_FIVE_HUNDRED_THOUSAND
      ).toFixed(2);
    } else if (investmentAmount >= 2000000) {
      costs = (
        ((investmentAmount - 2000000) / 1000000) * 25 +
        COST_UPTO_TWO_MILLIONS
      ).toFixed(2);
    }
    return costs > MINIMUM_COST ? costs : MINIMUM_COST.toFixed(2);
  }

  /* This function calculates yaerly investment cost */
  calculateYearlyCosts(
    baseCostsPerQuarter,
    portfolioCostsPerQuarter,
    investmentCostsPerQuater
  ) {
    const baseCost = baseCostsPerQuarter * 4;
    const portfolioCost = portfolioCostsPerQuarter * 4;
    const investmentCost = investmentCostsPerQuater * 4;
    const total = baseCost + portfolioCost + investmentCost;
    return total;
  }

  /* This function calculates the portfolio cost */
  calculatePortfolioCosts(amount, investmentType) {
    let costs;
    const investmentAmount = parseInt(amount) || 0;
    const MINIMUM_COST = 50;
    const COST_UPTO_HUNDRED_THOUSAND_BASE = 100;
    const COST_UPTO_HUNDRED_THOUSAND_ACTIVE = 160;
    switch (investmentType) {
      case 'PASV':
        if (investmentAmount < 100000) {
          costs = ((investmentAmount / 1000) * 1).toFixed(2);
        } else if (investmentAmount >= 100000) {
          costs = (
            ((investmentAmount - 100000) / 10000) * 9 +
            COST_UPTO_HUNDRED_THOUSAND_BASE
          ).toFixed(2);
        }
        return costs;
      case 'ACTV':
      case 'ACTS':
        if (investmentAmount < 100000) {
          costs = ((investmentAmount / 10000) * 16).toFixed(2);
        } else if (investmentAmount >= 100000) {
          costs = (
            ((investmentAmount - 100000) / 10000) * 14 +
            COST_UPTO_HUNDRED_THOUSAND_ACTIVE
          ).toFixed(2);
        }
        return costs > MINIMUM_COST ? costs : MINIMUM_COST.toFixed(2);
      default:
        return costs;
    }
  }

  /* This function calculates the minimum investment cost */
  calculateInvestmentCostsMin(amount, investmentType) {
    let costs;
    const investmentAmount = parseInt(amount) || 0;
    switch (investmentType) {
      case 'ACTV':
        costs = ((investmentAmount / 1000) * 2.5).toFixed(2);
        return costs;
      case 'ACTS':
        costs = ((investmentAmount / 1000) * 5).toFixed(2);
        return costs;
      default:
        return costs;
    }
  }

  /* This function calculates the minimum investment cost for Basis */
  calculeteYealyMinCostBasis(baseCostsPerQuarter, portfolioCostsPerQuarter) {
    const baseCost = baseCostsPerQuarter * 4;
    const portfolioCost = portfolioCostsPerQuarter * 4;
    const total = baseCost + portfolioCost;
    return total;
  }

  /* This function calculates the maximum investment cost */
  calculateInvestmentCostsMax(amount, investmentType) {
    let costs;
    const investmentAmount = parseInt(amount) || 0;
    switch (investmentType) {
      case 'PASV':
        costs = ((investmentAmount / 1000) * 1.5).toFixed(2);
        return costs;
      case 'ACTV':
        costs = ((investmentAmount / 1000) * 3.5).toFixed(2);
        return costs;
      case 'ACTS':
        costs = ((investmentAmount / 1000) * 6).toFixed(2);
        return costs;
      default:
        return costs;
    }
  }

  /* Open the how is it calculated model */
  openModal(modalId) {
    this.document.getElementById(modalId).present();
  }

  /* When the customer focuses on input money fields,
   *  we remove the entered number and
   *  allow the user to fill in a free number
   * */
  onInputMoneyFocus() {
    this.investmentAmount = '';
    this.calculateCosts(0);
  }
}
