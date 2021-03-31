/// <reference path="../lib/openrct2.d.ts" />

import config from './config';

export default class RidePrices {
  public static updateRidePrices(): void {
    if (!config.getPluginEnabled()) {
      return;
    }
    map.rides.map((ride: Ride) => { // eslint-disable-line array-callback-return
      if (ride.price[0] === 0 && config.getIgnoreFreeRidesEnabled()) {
        // Ignore free rides.
        return;
      }
      RidePrices.setRidePrice(ride);
    });
  }

  public static forceUpdateRidePrices(): void {
    map.rides.map((ride: Ride) => RidePrices.setRidePrice(ride));
  }

  public static makeRidesFree(): void {
    map.rides.map((ride: Ride) => RidePrices.setRidePrice(ride, 0));
  }

  private static setRidePrice(ride: Ride, priceInDimes?: number): void {
    if (!RidePrices.isOpenAndRatedRide(ride)) {
      return;
    }

    if (priceInDimes === undefined) {
      priceInDimes = RidePrices.calculateRidePrice(ride);
    }

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

  private static isOpenAndRatedRide(ride: Ride): boolean {
    // Ignore shops & facilites.
    return ride.classification === 'ride'
      // Ignore closed/testing rides.
      && ride.status === 'open'
      // Ignore unrated rides.
      && ride.excitement !== -1;
  }

  private static calculateRidePrice(ride: Ride): number {
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

    return priceInDimes;
  }
};

