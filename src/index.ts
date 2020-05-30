import fixRidePrices from "./fixRidePrices";
import showWindow from "./window";

const main = function (): void {
    ui.registerMenuItem("Ride Price Manager", function (): void {
        showWindow();
    });

    context.subscribe("interval.day", () => {
        fixRidePrices();
    });

    fixRidePrices();
};

registerPlugin({
    name: 'Ride Price Manager',
    version: '1.0',
    authors: ['MarkG'],
    type: 'remote',
    main: main
});
