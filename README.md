# Ride Price Manager - a plugin for OpenRCT2
- Do you want to sqeeze as much cash as possible out of your guests?
- Are you annoyed when guests say a ride is "too expensive"?
- Do you hate spending time micro-managing the prices of your rides?
- Do you find it troublesome to repeatedly type ride stats into [RCT2 Ride Price Calculator](https://rct2calc.shottysteve.com/)?

Your troubles are long gone with ***Ride Price Manager***!

## Features
- Every in-game day, the plugin will _automagically_ update the prices of all your rides to the best possible price, as long as they are _open_ and have a _rating_.
- Ride prices will automatically update as they age.
- You can disable/re-enable the plugin in-game from its _control panel_, which is available **under the Map Dropdown**.
- There are also some other options the control panel:
  - Set different prices when scenarios are in "Pay to enter park/pay per ride" mode. Guests are willing to pay way less for rides if they were charged admission.
    - (I want this to be done automatically... see Future Features below)
  - Automatically set "Good Value" prices, instead of maximum acceptable prices. Guests will be think your rides are a great value.
  - Add a "Lazy Tax" to decrease ride prices. This is for people that think this plugin is overpowered or just want to re-balance the game a little bit.
  - Allow prices greater than $20.00 for high value rides.
    - Guests are willing to pay more than $20 for some rides, but you can't set a price to more than $20 via the UI. This plugin can bypass that check.

## Installation
1. Get a new (enough) version of OpenRCT2 (v0.2.6-c3921d9 from 2020/05/29 or newer)
   - Downloads are here: https://openrct2.org/downloads
2. Download the plugin file
   - Get [`/build/ride-price-manager.js`](build/ride-price-manager.js)
   - Or just right-click [this link](https://raw.githubusercontent.com/mgovea/openrct2-ride-price-manager/master/build/ride-price-manager.js) & "Save link as"
3. Put that file in your OpenRCT2 `plugin` folder.
   - It's typically in `C:\Users\{User}\Documents\OpenRCT2` on Windows.
   - For more info, see [OpenRCT2's info on Plugins](https://github.com/OpenRCT2/OpenRCT2/blob/develop/distribution/scripting.md).
4. Run OpenRCT2!
5. Once in a scenario, open the options window via the Map dropdown to configure the plugin.

## Possible Future Plans
- Check if this works with server play
  - And make it work with server play
- Automatically detect if a park charges admission
  - This will require an update in the plugin API
- Automatically set park prices & allow configuration of a max admission price.
  - This would help early-game ramp-up.
  - This will also require an update in the plugin API
- Manage shop prices
  - To do this optimally, weather info would need to be added to the plugin API
  - Adding subscriptions for weather events in the API would help too
  
## Feature Requests
If you want to request a feature or find a bug, open an issue on GitHub (as long as one doesn't exist already for the same thing). And if you like the sound of one of the Possible Future Plans and want it to happen, it's cool if you open an issue for it.

## Contributing
- Follow the first steps from Installation to get the correct version of OpenRCT2.
- Set `enable_hot_reloading = true` in your `/OpenRCT2/config.ini`
- Preferrably, clone this repository from within your plugins folder.
  - Right now, OpenRCT2 only loads `.js` files (and not `.ts`) within the plugin folder, so I put this whole project within the `/plugin/` folder.
- Run `npm run watch build`
- Make your changes.
- Make sure to update the version number in `package.json` and in `index.js`.
- Make a Pull Request.

## Thanks
- Thanks to [OpenRCT2](https://github.com/OpenRCT2/OpenRCT2) for revitalizing a sweet game & releasing the plugin API
- Thanks to **oli414** for the [boilerplate template](https://github.com/oli414/openrct2-plugin-boilerplate). I adapted it to fit TypeScript for this project before **wisnia74** came out with [a very well made and comprehensive TypeScript plugin template](https://github.com/wisnia74/openrct2-typescript-mod-template). You should definitely check that one out if you want to make your own plugin.
- And many many thanks to [IntelOrca](https://github.com/IntelOrca) for all of the Plugin support. The Plugin API is super fun, and I can't wait to see what all people make for it.
