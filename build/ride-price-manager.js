(function () {
    'use strict';

    var namespace = 'RidePriceManager';
    var configPrefix = namespace + '.';
    var goodValueEnabled = configPrefix + 'goodValueEnabled';
    var lazyTaxFactor = configPrefix + 'lazyTaxFactor';
    var parkAdmissionEnabled = configPrefix + 'parkAdmissionEnabled';
    var pluginEnabled = configPrefix + 'pluginEnabled';
    var unboundPriceEnabled = configPrefix + 'unboundPriceEnabled';
    var ignoreFreeRidesEnabled = configPrefix + 'ignoreFreeRidesEnabled';
    var defaults = {
      goodValueEnabled: false,
      lazyTaxFactor: 0,
      parkAdmissionEnabled: false,
      pluginEnabled: true,
      unboundPriceEnabled: false,
      ignoreFreeRidesEnabled: false
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
      getLazyTaxFactor: function () {
        return context.sharedStorage.get(lazyTaxFactor, defaults.lazyTaxFactor);
      },
      setLazyTaxFactor: function (v) {
        return context.sharedStorage.set(lazyTaxFactor, v);
      },
      getParkAdmissionEnabled: function () {
        return context.sharedStorage.get(parkAdmissionEnabled, defaults.parkAdmissionEnabled);
      },
      setParkAdmissionEnabled: function (v) {
        return context.sharedStorage.set(parkAdmissionEnabled, v);
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
      },
      getIgnoreFreeRidesEnabled: function () {
        return context.sharedStorage.get(ignoreFreeRidesEnabled, defaults.ignoreFreeRidesEnabled);
      },
      setIgnoreFreeRidesEnabled: function (v) {
        return context.sharedStorage.set(ignoreFreeRidesEnabled, v);
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

      var value = config.getParkAdmissionEnabled() ? Math.floor(ride.value / 4) : ride.value;
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
        height: 125,
        title: 'Ride Price Manager',
        widgets: [makePluginEnabledCheckbox(20), makeParkAdmissioCheckbox(45), makeGoodValueCheckbox(60), makeLazyTaxLabel(75), makeLazyTaxDropdown(75), makeUnboundPriceCheckbox(92), makeIgnoreFreeRidesCheckbox(107)],
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
        onChange: function () {}
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

    var makeParkAdmissioCheckbox = function (y) {
      return makeCheckbox(y, "Guests are only willing to pay 1/4 as much if they paid for admission", "Does your park charge admission?", config.getParkAdmissionEnabled(), function (isChecked) {
        config.setParkAdmissionEnabled(isChecked);
      });
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

    var makeIgnoreFreeRidesCheckbox = function (y) {
      return makeCheckbox(y, "Having free transport rides has certain benefits.", "Ignore free rides", config.getIgnoreFreeRidesEnabled(), function (isChecked) {
        config.setIgnoreFreeRidesEnabled(isChecked);
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
      version: '1.1',
      authors: ['MarkG', 'Sadret'],
      type: 'remote',
      licence: 'MIT',
      main: main
    });

}());
