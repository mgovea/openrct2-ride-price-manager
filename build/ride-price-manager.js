(function () {
  'use strict';

  var namespace = 'RidePriceManager';
  var configPrefix = namespace + '.';
  var goodValueEnabled = configPrefix + 'goodValueEnabled';
  var ignoreFreeRidesEnabled = configPrefix + 'ignoreFreeRidesEnabled';
  var lazyTaxFactor = configPrefix + 'lazyTaxFactor';
  var pluginEnabled = configPrefix + 'pluginEnabled';
  var unboundPriceEnabled = configPrefix + 'unboundPriceEnabled';
  var defaults = {
    goodValueEnabled: false,
    ignoreFreeRidesEnabled: true,
    lazyTaxFactor: 0,
    pluginEnabled: true,
    unboundPriceEnabled: false
  };
  var lazyTaxOptions = [{
    s: '0%',
    n: 0.00
  }, {
    s: '5%',
    n: 0.05
  }, {
    s: '10%',
    n: 0.10
  }, {
    s: '15%',
    n: 0.15
  }, {
    s: '20%',
    n: 0.20
  }, {
    s: '30%',
    n: 0.30
  }, {
    s: '40%',
    n: 0.40
  }, {
    s: '50%',
    n: 0.50
  }];
  var config = {
    getGoodValueEnabled: function () {
      return context.sharedStorage.get(goodValueEnabled, defaults.goodValueEnabled);
    },
    setGoodValueEnabled: function (v) {
      return context.sharedStorage.set(goodValueEnabled, v);
    },
    getIgnoreFreeRidesEnabled: function () {
      return context.sharedStorage.get(ignoreFreeRidesEnabled, defaults.ignoreFreeRidesEnabled);
    },
    setIgnoreFreeRidesEnabled: function (v) {
      return context.sharedStorage.set(ignoreFreeRidesEnabled, v);
    },
    getLazyTaxFactor: function () {
      return context.sharedStorage.get(lazyTaxFactor, defaults.lazyTaxFactor);
    },
    setLazyTaxFactor: function (v) {
      return context.sharedStorage.set(lazyTaxFactor, v);
    },
    getPluginEnabled: function () {
      return context.sharedStorage.get(pluginEnabled, defaults.pluginEnabled);
    },
    setPluginEnabled: function (v) {
      return context.sharedStorage.set(pluginEnabled, v);
    },
    getUnboundPriceEnabled: function () {
      return context.sharedStorage.get(unboundPriceEnabled, defaults.unboundPriceEnabled);
    },
    setUnboundPriceEnabled: function (v) {
      return context.sharedStorage.set(unboundPriceEnabled, v);
    }
  };

  var fixRidePrices = function () {
    if (!config.getPluginEnabled()) {
      return;
    }

    for (var i in map.rides) {
      updateRidePrice(map.rides[i]);
    }
  };

  var updateRidePrice = function (ride) {
    if (!config.getPluginEnabled()) {
      return;
    }

    if (ride.classification !== 'ride') {
      return;
    }

    if (ride.price[0] === 0 && config.getIgnoreFreeRidesEnabled()) {
      return;
    }

    if (ride.status !== "open" || ride.excitement === -1) {
      return;
    }

    var value = park.entranceFee > 0 ? Math.floor(ride.value / 4) : ride.value;
    var priceInDimes = config.getGoodValueEnabled() ? Math.floor(value / 2) : value * 2;

    if (config.getLazyTaxFactor() > 0) {
      priceInDimes *= 1 - config.getLazyTaxFactor();
      priceInDimes = Math.floor(priceInDimes);
    }

    if (!config.getUnboundPriceEnabled()) {
      priceInDimes = Math.min(priceInDimes, 200);
    }

    var ridePrices = ride.price.slice(0);
    ridePrices[0] = priceInDimes;
    ride.price = ridePrices;
  };

  var lQuote = decodeURI("%E2%80%9C");
  var rQuote = decodeURI("%E2%80%9D");
  var window;

  var showWindow = function () {
    if (window) {
      window.bringToFront();
      return;
    }

    var windowDesc = {
      classification: 'ride_management',
      width: 240,
      height: 110,
      title: 'Ride Price Manager',
      widgets: [makePluginEnabledCheckbox(20), makeIgnoreFreeRidesCheckbox(45), makeGoodValueCheckbox(60), makeLazyTaxLabel(75), makeLazyTaxDropdown(75), makeUnboundPriceCheckbox(92)],
      onClose: function () {
        window = undefined;
      }
    };
    window = ui.openWindow(windowDesc);
  };

  var makeCheckbox = function (y, tooltip, text, isChecked, onChange) {
    return {
      type: "checkbox",
      x: 5,
      y: y,
      width: 210,
      height: 10,
      tooltip: tooltip,
      text: text,
      isChecked: isChecked,
      onChange: onChange
    };
  };

  var makeIgnoreFreeRidesCheckbox = function (y) {
    return makeCheckbox(y, "Prevent the plugin from affecting rides that are currently free. " + "Recommended for transport rides & scenarios with a Park Entrance Fee.", "Ignore free rides", config.getIgnoreFreeRidesEnabled(), function (isChecked) {
      config.setIgnoreFreeRidesEnabled(isChecked);
    });
  };

  var makeGoodValueCheckbox = function (y) {
    return makeCheckbox(y, "Charge 1/4 as much so guests think your rides are good value", "Enable " + lQuote + "Good Value" + rQuote + " Pricing", config.getGoodValueEnabled(), function (isChecked) {
      config.setGoodValueEnabled(isChecked);
    });
  };

  var makeLazyTaxLabel = function (y) {
    return {
      type: "label",
      x: 5,
      y: y,
      width: 210,
      height: 10,
      tooltip: "Reduce prices to compensate for the assistance the plugin gives",
      text: lQuote + "Lazy Tax" + rQuote,
      onChange: function () { }
    };
  };

  var makeLazyTaxDropdown = function (y) {
    return {
      type: "dropdown",
      x: 72,
      y: y,
      width: 40,
      height: 13,
      items: lazyTaxOptions.map(function (v) {
        return v.s;
      }),
      selectedIndex: lazyTaxOptions.map(function (v) {
        return v.n;
      }).indexOf(config.getLazyTaxFactor()),
      onChange: function (index) {
        config.setLazyTaxFactor(lazyTaxOptions[index].n);
      }
    };
  };

  var makePluginEnabledCheckbox = function (y) {
    return makeCheckbox(y, "Unchecking completely disables the plugin", "Enable automatic Ride Price Management", config.getPluginEnabled(), function (isChecked) {
      config.setPluginEnabled(isChecked);
    });
  };

  var makeUnboundPriceCheckbox = function (y) {
    return makeCheckbox(y, "Via the UI, the max price is $20.00 - Enable this to allow the plugin to set higher prices", "Allow unbound prices", config.getUnboundPriceEnabled(), function (isChecked) {
      config.setUnboundPriceEnabled(isChecked);
    });
  };

  var main = function () {
    ui.registerMenuItem("Ride Price Manager", function () {
      showWindow();
    });
    context.subscribe("interval.day", function () {
      fixRidePrices();
    });
    fixRidePrices();
  };

  registerPlugin({
    name: 'Ride Price Manager',
    version: '1.2',
    authors: ['MarkG', 'Sadret'],
    type: 'remote',
    licence: 'MIT',
    main: main
  });

}());
