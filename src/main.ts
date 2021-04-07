/// <reference path="../lib/openrct2.d.ts" />

import RidePrices from './RidePrices';
import showWindow from './window';

function main(): void {
  // Headless server homies don't need to register UI, you feel me?
  if (typeof ui !== 'undefined') {
    ui.registerMenuItem('Ride Price Manager', () => {
      showWindow();
    });
  }

  // Only the server/singleplayer automatically triggers prices updates.
  if (network.mode !== 'client') {
    context.subscribe('interval.day', () => {
      RidePrices.updateRidePrices();
    });

    RidePrices.updateRidePrices();
  }
}

export default main;
