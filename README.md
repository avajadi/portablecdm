# Frontend, multiplatform mobile application
Contributors: 
Johan Berndtsson, Pontus Stjernström, Nicole Ascard

# Information for students of the Software Engineering Project Course
## How to build the Android version of the application from scratch
### Requirements
* Nodejs with npm accessible from your terminal (preferably version <= 5)
* Git installed and accessible from your terminal
* Android Studio version >= 3.0.1

### Cloning the repo
1. Use the terminal to CD into your destination folder
2. Run command: git clone https://github.com/blabla/portcdm-mobile-app

### Installing
1. CD into the App folder in the repo
2. Run npm install

### Important links
* https://www.bis.doc.gov/index.php/policy-guidance/encryption
* https://support.google.com/googleplay/android-developer/answer/113770

# Developer info
## Build version
### iOS
0. Change Expo account in .plist
1. Targets->Build Settings->Packaging->Product Bundle Idenfifier = SET
2. Targets->Build Settings->Packaging->Product Name = SET
3. Targets->Info->Bundle name = SET
4. Targets->Info->Bundle Identifier = SET
5. Targets->Info->Bundle display name
6. Archive
### For ad hoc
7. Export->Select Ad-Hoc->Manual sign->Select correct provisioning profile->Export

### Android
0. Change Expo account in MainActivity
1. Change applicationId to choice in build.gradle
2. Change app_name value in strings.xml

## Expo info
* Production username: avajadi
* Staging username: pontusstjerna

## Deployment checklist
* Check config/version.js
* Check components/about-view/index.js and append Changelog
* ALWAYS publish on staging (pontusstjerna) before production (avajadi)
* Push to git :)
