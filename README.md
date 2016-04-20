# Standalone NodeCG Dashboard
[![Windows status](https://ci.appveyor.com/api/projects/status/jtvfi9yin53y4es1/branch/master?svg=true)](https://ci.appveyor.com/project/Lange/dashboard/branch/master)
[![Linux & OSX Status](https://travis-ci.org/nodecg/dashboard.svg?branch=master)](https://travis-ci.org/nodecg/dashboard)

> A standalone application for displaying a NodeCG Dashboard.

## Why?
Chrome 50 was released on April 13th, 2016. It removed the Object.observe method, which NodeCG's Replicant system relies on. 
NodeCG ships with an Object.observe polyfill that we thought would be enough to keep things working until the new 
Proxy-based Replicants system was ready, but this was not the case. The polyfill isn't perfect, 
and as a result some Replicant operations do not function. 
This effectively means that the NodeCG dashboard no longer works in any browser.

We are working on a new version of NodeCG (v0.8) that will work in Chrome 50.
Unfortunately, all previous versions will never work in Chrome again. This application will serve as the primary
way that users of older versions of NodeCG access their dashboards.

## Installation
Check the [Releases](https://github.com/nodecg/dashboard/releases) page to grab the latest installer for your operating system.
Once installed, the application will autoupdate.

### NOTICE
Due to a bug in Squirrel.Windows, the installer currently generates broken shortcuts on Windows.
To fix the shortcut, do the following:

1. Right-click on the shortcut and click "Properties"
2. In the "Target" box, scroll to the end and wrap `NodeCG Dashboard.exe` in quotes (`"NodeCG Dashboard.exe"`).
3. Click "OK"

## Credits
Developed by [Alex Van Camp](https://twitter.com/vancamp)  
Designed by [Chris Hanel](https://twitter.com/chrishanel)

## License
NodeCG is provided under the MIT license, which is available to read in the 
[LICENSE](https://github.com/nodecg/dashboard/blob/master/LICENSE) file.
