/// <reference path="../lib/openrct2.d.ts" />

import { updateRidePrices } from './ridePriceFunctions';
import showWindow from './window';

function main(): void {
  if (ui) {
    ui.registerMenuItem('Ride Price Manager', () => {
      showWindow();
    });
  }

  context.subscribe('interval.day', () => {
    updateRidePrices();
  });

  updateRidePrices();
}

export default main;
