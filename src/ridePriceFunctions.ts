/// <reference path="../lib/openrct2.d.ts" />

import config from './config';

function updateRidePrices(): void {
  if (!config.getPluginEnabled()) {
    return;
  }
  map.rides.map((ride: Ride) => { // eslint-disable-line array-callback-return
    if (ride.price[0] === 0 && config.getIgnoreFreeRidesEnabled()) {
      // Ignore free rides.
      return;
    }
    updateRidePrice(ride);
  });
}

function forceUpdateRidePrices(): void {
  map.rides.map(updateRidePrice);
}

function makeRidesFree(): void {
  map.rides.map((ride: Ride) => { // eslint-disable-line array-callback-return
    setRidePrice(ride, 0);
  });
}

function updateRidePrice(ride: Ride): void {
  if (ride.classification !== 'ride') {
    // Ignore shops & facilites.
    return;
  }

  if (ride.status !== 'open' || ride.excitement === -1) {
    // Don't change the price of closed/testing and unrated rides.
    return;
  }

  // See /src/openrct2/peep/Guest.cpp for logic.
  // if (peep_flags & PEEP_FLAGS_HAS_PAID_FOR_PARK_ENTRY) value /= 4;
  const value = park.entranceFee > 0
    ? Math.floor(ride.value / 4)
    : ride.value;

  // See /src/openrct2/peep/Guest.cpp for logic.
  // if (ridePrice > value * 2) ChoseNotToGoOnRide
  // if (ridePrice <= value / 2) InsertNewThought(PEEP_THOUGHT_TYPE_GOOD_VALUE)
  let priceInDimes = config.getGoodValueEnabled()
    ? Math.floor(value / 2)
    : value * 2;

  if (config.getLazyTaxFactor() > 0) {
    priceInDimes *= (1 - config.getLazyTaxFactor());
    priceInDimes = Math.floor(priceInDimes);
  }

  if (!config.getUnboundPriceEnabled()) {
    // Max price is $20 via the UI.
    priceInDimes = Math.min(priceInDimes, 200);
  }

  setRidePrice(ride, priceInDimes);
}

function setRidePrice(ride: Ride, priceInDimes: number): void {
  // Set the price via an action (so it works in multiplayer)
  context.executeAction(
    'ridesetprice',
    {
      ride: ride.id,
      price: priceInDimes,
      isPrimaryPrice: true,
    },
    () => { },
  );
}

export {
  updateRidePrices,
  forceUpdateRidePrices,
  makeRidesFree,
};
