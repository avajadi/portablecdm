# Frontend, multiplatform mobile application
Contributors: 
Johan Berndtsson
Pontus Stjernström
Nicole Ascard

## Current issues
* Currently empty

## Future updates
* Recommended and target time types support
* Show where the current time is on the timeline
* Search on vessel name in Favorite Vessels
* Search on IMO in Port Call view

## Suggested updates
* Dynamic loading of port calls
* Summary of sent message (instead of current verification) as popup
* Improved legacy login

### Important links
* https://www.bis.doc.gov/index.php/policy-guidance/encryption
* https://support.google.com/googleplay/android-developer/answer/113770


# Release notes 1.0.4
* Fixed a bug where reliabilities would not be fetched when using keycloak
* Removed autocorrect for the search bar in state selection
* Added confirmation when sending messages
* Added support for sending through HTTPS
* Added confirmation for sent message success and failure
* Updated error handling for missing "at"-location

# Release notes 1.0.3
* Fixed SeaSWIM login for at least QA, SEGOT and DEV servers
* Improved return from error view
* Revisited the Legacy Login modal
..* Added logos
..* Added back arrow for iOS users
* Many other improvements for future updates