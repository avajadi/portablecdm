# Frontend, multiplatform mobile application
Contributors: 
Johan Berndtsson, Pontus Stjernström, Nicole Ascard

## Current issues
* Currently empty

## Future updates
* List of favorite port calls

## Suggested updates
* Dynamic loading of port calls
* Summary of sent message (instead of current verification) as popup

### Important links
* https://www.bis.doc.gov/index.php/policy-guidance/encryption
* https://support.google.com/googleplay/android-developer/answer/113770

### Release notes 1.1.1
* Added red line on operations for visualizing current time
* Locations are now sorted on locations already mentioned by the port call
* Lots of code refactoring

## Release notes 1.1
* Added icons for TARGET and RECOMMENDED time types
* Added feature to search by IMO and MMSI number
* Added feature to search by name in Favorite Vessels list
* Added IMO to search results in Favorite Vessel list
* Removed the RELIABILITY: % text from state details when no reliabilities are available

### Release notes 1.0.4
* Fixed a bug where reliabilities would not be fetched when using keycloak
* Removed autocorrect for the search bar in state selection
* Added confirmation when sending messages
* Added support for sending through HTTPS
* Added confirmation for sent message success and failure
* Updated error handling for missing "at"-location

### Release notes 1.0.3
* Fixed SeaSWIM login for at least QA, SEGOT and DEV servers
* Improved return from error view
* Revisited the Legacy Login modal
* Added back arrow for iOS users
* Many other improvements for future updates