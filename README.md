# Ride Price Manager - a plugin for OpenRCT2
- Do you want to sqeeze as much cash as possible out of your guests?
- Are you annoyed when guests say a ride is "too expensive"?
- Do you hate spending time micro-managing the prices of your rides?
- Do you find it troublesome to repeatedly type ride stats into [RCT2 Ride Price Calculator](https://rct2calc.shottysteve.com/)?

Your troubles are long gone with ***Ride Price Manager***!

## Using the Plugin
- First, follow the installation instructions below
- Once installed, the plugin should work automatically in game. It will _automagically_ update the prices of all your rides every in-game day.
  - By default, the plugin chooses the highest price that guests are willing to pay for a ride.
  - That number is determined by ride rating, ride age, and other factors.
- You can configure the plugin via the "Ride Price Manager" _control panel_, which is available **under the Map Dropdown** on the top bar. There, you can:
  - disable/re-enable the plugin.
  - make the plugin ignore free rides. It's useful to make transport rides free, as guests will always take them, no matter how unhappy or unsatisfied they are.
  - tell the plugin to set lower prices to make guests think your rides are "Good Value".
  - add a "Lazy Tax" to decrease ride prices. This is for people that think this plugin is overpowered or just want to re-balance the game a little bit.
  - allow prices greater than $20.00 for high value rides.
    - Guests are willing to pay more than $20 for some rides, but you can't set a price to more than $20 via the UI. This allows the plugin to bypass that check.
- There are also two buttons in the _control panel_:
  - "Make ALL Rides FREE" which does just that. This may be useful in conjunction with the "Ignore free rides" option.
  - "Force Recalculate ALL Prices Now" also does what it says on the tin. Note that it doesn't use the "Ignore free rides" option, and recalculates free rides.

## Installation
1. Install a compatible version of OpenRCT2 (requires [`0.3.0-develop-bc33ef3`](https://openrct2.org/downloads/develop/v0.3.0-bc33ef3) released 2020/09/03 or [newer](https://openrct2.org/downloads/develop/latest))
   - Downloads are here: https://openrct2.org/downloads
2. Download the plugin file here: https://github.com/mgovea/openrct2-ride-price-manager/releases/latest
3. Put that file in your OpenRCT2 `plugin` folder.
   - It's typically in `C:\Users\{User}\Documents\OpenRCT2` on Windows.
   - For more info, see [OpenRCT2's info on Plugins](https://github.com/OpenRCT2/OpenRCT2/blob/develop/distribution/scripting.md).
4. Run OpenRCT2!
5. Once in a scenario, open the options window via the Map dropdown to configure the plugin.

## Multiplayer
This plugin is now updated to work in Multiplayer! However, there are some things to know...

- The plugin must be installed on the server to automatically update prices every in-game day.
- When the prices are updated daily, only the config on the server is used.
- Any player with the plugin can still use the "Force recalculate" and "Make rides free" buttons. There are no permissions. File an issue if you are dealing with griefers.
- For the recalculate button, the client's config is used, but will be bulldozed when server recalculates prices on the next in-game day.

If you run the server in a "headless state" (you're not playing on the host), you will have to manually edit the config file. In this case, you will need to edit the `plugin.store.json` file (typically in `C:\Users\{User}\Documents\OpenRCT2`). If that file doesn't exist, use the following as the file contents. If some keys already exist, just add the `RidePriceManager` block to what's already there. And don't mess up the commas!

```
{
  "RidePriceManager": {
    "pluginEnabled": true,
    "ignoreFreeRidesEnabled": true,
    "goodValueEnabled": false,
    "lazyTaxFactor": 0,
    "unboundPriceEnabled": false
  }
}
```

## Possible Future Plans
- Address any open [issues](https://github.com/mgovea/openrct2-ride-price-manager/issues).
- Have better tools for managing the price of transport rides.
- Automatically set park prices & allow configuration of a max admission price.
  - This would help early-game ramp-up.
- Manage shop prices
  - To do this optimally, weather info would need to be added to the plugin API
  - Adding subscriptions for weather events in the API would help too

## Feature Requests
If you want to request a feature or find a bug, open an issue on GitHub (as long as one doesn't exist already for the same thing). And if you like the sound of one of the Possible Future Plans and want it to happen, it's cool if you open an issue for it.

## Contributing
- Follow the first steps from Installation to get a correct version of OpenRCT2.
- Set `enable_hot_reloading = true` in your `/OpenRCT2/config.ini`
  - It's typically in `C:\Users\{User}\Documents\OpenRCT2` on Windows.
- Clone this repository wherever you'd like.
- Put the TypeScript API declaration file (`openrct2.d.ts`) in the `lib` folder.
  - The easy way is to copy it from the installation folder (e.g. `C:\Program Files\OpenRCT2\openrct2.d.ts`)
  - The cool way is to make a symbolic link so that the copy in `lib` stays up to date whenever the game is updated. To do this (on Windows),
    - Run a Command Prompt as Administrator
    - `cd` to the repository
    - `mklink .\lib\openrct2.d.ts "C:\Program Files\OpenRCT2\openrct2.d.ts"`
- Edit `ride-price-manager\rollup.config.dev.js` so that it puts the build in your plugin folder. Sorry that this is custom to me :O
- Run `npm run watch`
- Make your changes.
- Make sure to update the version number in `package.json` and in `index.js`.
- Commit your changes (without including the rollup config) and Make a Pull Request.

## Thanks
- Thanks to [OpenRCT2](https://github.com/OpenRCT2/OpenRCT2) for revitalizing a sweet game & releasing the plugin API.
- This plugin is powered by **wisnia74**'s [very well made and comprehensive TypeScript plugin template](https://github.com/wisnia74/openrct2-typescript-mod-template). I highly recommend you use that one if you want to make your own plugin. So thank you, wisnia!
- Originally, this plugin was powered by **oli414**'s [boilerplate template](https://github.com/oli414/openrct2-plugin-boilerplate) (which I adapted to support TypeScript, but it still wasn't as nice as the new plugin template). Thanks oli for helping me get the ball rolling :)
- Thanks to [Marcel Vos](https://www.youtube.com/channel/UCBlXovStrlQkVA2xJEROUNg) for getting me back into RCT2.
- And many many thanks to [IntelOrca](https://github.com/IntelOrca) for all of the Plugin support. The Plugin API is super fun, and I can't wait to see what all people make for it.
