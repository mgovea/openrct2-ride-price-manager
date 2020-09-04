/// <reference path="../../openrct2.d.ts" />

import config, { LazyTaxOption, lazyTaxOptions } from "./config";

const lQuote = decodeURI("%E2%80%9C");
const rQuote = decodeURI("%E2%80%9D");

let window: Window | undefined;

const showWindow = function (): void {
    if (window) {
        window.bringToFront();
        return;
    }

    const windowDesc: WindowDesc = {
        classification: 'ride_management',
        width: 240,
        height: 110,
        title: 'Ride Price Manager',
        widgets: [
            makePluginEnabledCheckbox(20),
            makeIgnoreFreeRidesCheckbox(45),
            makeGoodValueCheckbox(60),
            makeLazyTaxLabel(75),
            makeLazyTaxDropdown(75),
            makeUnboundPriceCheckbox(92),
        ],
        onClose: () => { window = undefined; },
    };
    window = ui.openWindow(windowDesc);
}

const makeCheckbox = function (
    y: number,
    tooltip: string,
    text: string,
    isChecked: boolean,
    onChange: (isChecked: boolean) => void,
): CheckboxWidget {
    return {
        type: "checkbox",
        x: 5,
        y: y,
        width: 210,
        height: 10,
        tooltip: tooltip,
        text: text,
        isChecked: isChecked,
        onChange: onChange,
    };
}

const makeIgnoreFreeRidesCheckbox = function (y: number): CheckboxWidget {
    return makeCheckbox(
        y,
        "Prevent the plugin from affecting rides that are currently free. "
        + "Recommended for transport rides & scenarios with a Park Entrance Fee.",
        `Ignore free rides`,
        config.getIgnoreFreeRidesEnabled(),
        (isChecked: boolean) => {
            config.setIgnoreFreeRidesEnabled(isChecked);
        },
    );
}

const makeGoodValueCheckbox = function (y: number): CheckboxWidget {
    return makeCheckbox(
        y,
        "Charge 1/4 as much so guests think your rides are good value",
        `Enable ${lQuote}Good Value${rQuote} Pricing`,
        config.getGoodValueEnabled(),
        (isChecked: boolean) => {
            config.setGoodValueEnabled(isChecked);
        },
    );
}

const makeLazyTaxLabel = function (y: number): LabelWidget {
    return {
        type: "label",
        x: 5,
        y: y,
        width: 210,
        height: 10,
        tooltip: `Reduce prices to compensate for the assistance the plugin gives`,
        text: `${lQuote}Lazy Tax${rQuote}`,
        onChange: () => { },
    }
}

const makeLazyTaxDropdown = function (y: number): DropdownWidget {
    return {
        type: "dropdown",
        x: 72,
        y: y,
        width: 40,
        height: 13,
        items: lazyTaxOptions.map((v: LazyTaxOption) => v.s),
        selectedIndex: lazyTaxOptions
            .map((v: LazyTaxOption) => v.n)
            .indexOf(config.getLazyTaxFactor()),
        onChange: (index: number) => {
            config.setLazyTaxFactor(lazyTaxOptions[index].n);
        },
    }
}

const makePluginEnabledCheckbox = function (y: number): CheckboxWidget {
    return makeCheckbox(
        y,
        "Unchecking completely disables the plugin",
        `Enable automatic Ride Price Management`,
        config.getPluginEnabled(),
        (isChecked: boolean) => {
            config.setPluginEnabled(isChecked);
        },
    );
}

const makeUnboundPriceCheckbox = function (y: number): CheckboxWidget {
    return makeCheckbox(
        y,
        "Via the UI, the max price is $20.00 - Enable this to allow the plugin to set higher prices",
        `Allow unbound prices`,
        config.getUnboundPriceEnabled(),
        (isChecked: boolean) => {
            config.setUnboundPriceEnabled(isChecked);
        },
    );
}

export default showWindow;
