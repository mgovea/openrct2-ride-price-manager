/// <reference path="../lib/openrct2.d.ts" />

import config, { LazyTaxOption, lazyTaxOptions } from './config'; // eslint-disable-line no-unused-vars
import { forceUpdateRidePrices, makeRidesFree } from './ridePriceFunctions';

const windowTag = 'ride_management';
const lQuote = decodeURI('%E2%80%9C');
const rQuote = decodeURI('%E2%80%9D');

function showWindow(): void {
  const window = ui.getWindow(windowTag);
  if (window) {
    window.bringToFront();
    return;
  }

  const windowDesc: WindowDesc = {
    classification: windowTag,
    width: 240,
    height: 159,
    title: 'Ride Price Manager',
    widgets: [
      makePluginEnabledCheckbox(20),
      makeIgnoreFreeRidesCheckbox(45),
      makeGoodValueCheckbox(60),
      makeLazyTaxLabel(75),
      makeLazyTaxDropdown(75),
      makeUnboundPriceCheckbox(92),
      makeRecalculateButton(107),
      makeAllRidesFreeButton(132),
    ],
  };
  ui.openWindow(windowDesc);
}

function makeCheckbox(
  y: number,
  tooltip: string,
  text: string,
  isChecked: boolean,
  onChange: (isChecked: boolean) => void,
): CheckboxWidget {
  return {
    type: 'checkbox',
    x: 5,
    y,
    width: 210,
    height: 10,
    tooltip,
    text,
    isChecked,
    onChange,
  };
}

function makeIgnoreFreeRidesCheckbox(y: number): CheckboxWidget {
  return makeCheckbox(
    y,
    'Prevent the plugin from affecting rides that are currently free. '
    + 'Recommended for transport rides & scenarios with a Park Entrance Fee.',
    'Ignore free rides',
    config.getIgnoreFreeRidesEnabled(),
    (isChecked: boolean) => {
      config.setIgnoreFreeRidesEnabled(isChecked);
    },
  );
}

function makeGoodValueCheckbox(y: number): CheckboxWidget {
  return makeCheckbox(
    y,
    'Charge 1/4 as much so guests think your rides are good value',
    `Enable ${lQuote}Good Value${rQuote} Pricing`,
    config.getGoodValueEnabled(),
    (isChecked: boolean) => {
      config.setGoodValueEnabled(isChecked);
    },
  );
}

function makeLazyTaxLabel(y: number): LabelWidget {
  return {
    type: 'label',
    x: 5,
    y,
    width: 210,
    height: 10,
    tooltip: 'Reduce prices to compensate for the assistance the plugin gives',
    text: `${lQuote}Lazy Tax${rQuote}`,
    onChange: () => { },
  };
}

function makeLazyTaxDropdown(y: number): DropdownWidget {
  return {
    type: 'dropdown',
    x: 72,
    y,
    width: 40,
    height: 13,
    items: lazyTaxOptions.map((v: LazyTaxOption) => v.s),
    selectedIndex: lazyTaxOptions
      .map((v: LazyTaxOption) => v.n)
      .indexOf(config.getLazyTaxFactor()),
    onChange: (index: number) => {
      config.setLazyTaxFactor(lazyTaxOptions[index].n);
    },
  };
}

function makePluginEnabledCheckbox(y: number): CheckboxWidget {
  return makeCheckbox(
    y,
    'Unchecking completely disables the plugin',
    'Enable automatic Ride Price Management',
    config.getPluginEnabled(),
    (isChecked: boolean) => {
      config.setPluginEnabled(isChecked);
    },
  );
}

function makeUnboundPriceCheckbox(y: number): CheckboxWidget {
  return makeCheckbox(
    y,
    'Via the UI, the max price is $20.00 - Enable this to allow the plugin to set higher prices',
    'Allow unbound prices',
    config.getUnboundPriceEnabled(),
    (isChecked: boolean) => {
      config.setUnboundPriceEnabled(isChecked);
    },
  );
}

function makeFullWidthButton(
  y: number,
  tooltip: string,
  text: string,
  onClick: () => void,
): ButtonWidget {
  // @ts-ignore
  return {
    type: 'button',
    x: 5,
    y,
    width: 230,
    height: 21,
    text,
    tooltip,
    isPressed: false,
    onClick,
  };
}

function makeRecalculateButton(y: number): ButtonWidget {
  return makeFullWidthButton(
    y,
    'Immediately set the price for all rides, overriding the "Ignore Free" preference',
    'Force Recalculate ALL Prices Now',
    forceUpdateRidePrices,
  );
}

function makeAllRidesFreeButton(y: number): ButtonWidget {
  return makeFullWidthButton(
    y,
    'Immediately make all rides free.',
    'Make ALL Rides FREE',
    makeRidesFree,
  );
}

export default showWindow;
