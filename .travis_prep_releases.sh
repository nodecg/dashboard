#!/usr/bin/env bash

if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then
	export RELEASE_PKG_FILE=$(ls dist/*-darwin-x64/*.dmg);
	export RELEASE_UPDATER_FILE=$(ls dist/*-darwin-x64/*-mac.zip);
else
	export RELEASE_PKG_FILE=$(ls dist/nodecg-dashboard-*-amd64.deb);
fi

echo "Deploying $RELEASE_PKG_FILE to GitHub releases."
echo "(Update package: $RELEASE_UPDATER_FILE)"
