/// <reference path="C:/Users/Mark/source/repos/OpenRCT2/distribution/openrct2.d.ts" />

import config from "./config";

const fixRidePrices = function (): void {
    if (!config.getPluginEnabled()) {
        return;
    }
    for (const i in map.rides) {
        updateRidePrice(map.rides[i]);
    }
}

const updateRidePrice = function (ride: Ride): void {
    if (!config.getPluginEnabled()) {
        return;
    }

    if (ride.classification !== 'ride') {
        // Ignore shops & facilites.
        return;
    }

    if (ride.status !== "open" || ride.excitement === -1) {
        // Don't change the price of closed/testing and unrated rides.
        return;
    }

    // See /src/openrct2/peep/Guest.cpp for logic.
    // if (peep_flags & PEEP_FLAGS_HAS_PAID_FOR_PARK_ENTRY) value /= 4;
    // TODO: see if the park charges for admission instead of using a config mode.
    const value = config.getParkAdmissionEnabled()
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

    // The API doesn't detect deep changes, so we need a new array.
    const ridePrices = ride.price.slice(0);
    ridePrices[0] = priceInDimes;
    ride.price = ridePrices;
}

export default fixRidePrices;
