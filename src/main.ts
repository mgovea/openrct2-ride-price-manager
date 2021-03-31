/// <reference path="../lib/openrct2.d.ts" />

import RidePrices from './RidePrices';
import showWindow from './window';

function main(): void {
  if (ui) {
    ui.registerMenuItem('Ride Price Manager', () => {
      showWindow();
    });
  }

  context.subscribe('interval.day', () => {
    RidePrices.updateRidePrices();
  });

  RidePrices.updateRidePrices();
}

export default main;
