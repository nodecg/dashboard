# nodecg-dashboard
> A standalone application for displaying a NodeCG Dashboard.

## Why?

Chrome 50 was released on April 13th, 2016. It removed the `Object.observe` method, which NodeCG's Replicant system relies on. 
NodeCG ships with an `Object.observe` polyfill that we thought would be enough to keep things working until the new 
[Proxy-based Replicants system](https://github.com/nodecg/nodecg/pull/163) was ready, but this was not the case. 
The polyfill isn't perfect, and as a result some Replicant operations do not function. 
This effectively means that the NodeCG dashboard no longer works in any browser.

## A short-term solution

To address this problem in the short term while we complete the re-write of Replicants, 
we have created an [Electron](http://electron.atom.io/) application that uses a build of CEF which still supports `Object.observe`.

## Install Instructions (Windows)
1. [Download this zip file.](https://github.com/nodecg/nodecg-dashboard/archive/master.zip)
2. Extract the zip.
3. Double-click `setup.bat`.
 - If Windows pops up a security message, click "Run Anyways".
4. Enter the URL to your NodeCG Dashboard (example: `http://localhost:9090`)
5. You should see the following:
<img src="http://i.imgur.com/J4dD0as.png">
6. Double-click the newly-created "NodeCG Dashboard" shortcut to open your dashboard.

If you ever need to change your dashboard URL, just edit `dashboard-url.txt` in Notepad.