/// <reference path="../lib/openrct2.d.ts" />

import fixRidePrices from './fixRidePrices';
import showWindow from './window';

function main(): void {
  ui.registerMenuItem('Ride Price Manager', () => {
    showWindow();
  });

  context.subscribe('interval.day', () => {
    fixRidePrices();
  });

  fixRidePrices();
}

export default main;
