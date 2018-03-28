# Frontend, multiplatform mobile application
Contributors: 
Johan Berndtsson, Pontus Stjernström, Nicole Ascard

# Information for students of the Software Engineering Project Course
## How to build the Android version of the application from scratch
### Requirements
* Nodejs with npm accessible from your terminal (preferably version <= 5)
* Git installed and accessible from your terminal
* Android Studio version >= 3.0.1

Might need to add npm or git to your PATH in your operating system in order to access
them from the terminal. Both can be tested with command 'git --version' or 'npm --version'.

### Cloning the repo
1. Use the terminal to CD into your destination folder
2. Run command: git clone https://github.com/blabla/portcdm-mobile-app

### Installing EXPO
1. CD into the App folder in the repo
2. Run npm install
3. Install exponent CLI with: npm install -g exp
4. Run exp start and create an account if you don't have one already. One per application should be enough.
5. Make sure your development url is visible in terminal.

### Installing and building with Android Studio
1. Start Android Studio and select Open project.
2. Open the folder 'android' inside App in the repo.
3. Press OK or the default button all the way.
4. Follow gradle prompts and install missing SDK platforms and build tools. (there are quite a lot)
4.1. If you get the error similar to 'A problem with running prepare-detached-build.sh' when syncing with gradle, you might need to change the rights to the script. This happened on both Ubuntu and Mac OS. Go through the terminal to the repo portcdm-mobile-app/App/android/detach-scripts and run command 'sudo chmod +x prepare-detached-build.sh'.
5. If and only if you can successfully build the project (with or without warnings) by pressing the green hammer up to the right, navigate to the MainActivity class in app/java/host.exp.exponent/MainActivity and change line 21 to your account. For example, if your account name is kalle88, your expo publishedUrl would be exp://exp.host/@kalle88/portcdm-app'.
6. Click Play button

The following steps are optional but recommended, if you want to run the App on an emulator and not on a real Android phone connected with USB to your machine. If you previously have developed 
Android apps you also might have an installed emulator already.

7. Click 'Create New Virtual Device'.
8. Select Nexus 5X (at least recommended) and click Next
9. Download and select a system image with preferably API level 25 (Android 7.1.1). It is recommended to download a x86_64 for 64 bit operating systems. Other versions will probably work as well.
10. Name your AVD (Android Virtual Device) and press Finish.
11. Select your emulator that you just created and press OK. Don't forget that exp needs to be started in the background with exp start.
12. The phone should now start and connect to your exp account.

### Building an APK that can be distributed
1. Run command exp --publish to compile and publish the JavaScript parts of the project.
2. In Android studio, go to Build -> Generate Signed APK...
3. To sign your app you need to create a key store. One per group should be enough and it can be saved in the repo as long as you keep the password secret. Click 'Create new...' and enter some information. Everything is not mandatory.
4. When you have selected your key, press Next. Select flavor 'prod' and check both checkboxes and click 'Finish'.
5. The building can take a while and when successful, the apk can be found in portcdm-mobile-app/App/android/app/prod/release/app-prod-release.apk.

### General tips and tricks for students :)
* React Native is a JavaScript based library for developing mobile apps.
* exp = Expo = Exponent is a kind of platform for React Native and distributing JavaScript code
* exp can be buggy. If it cannot be started, simply restart or run with exp start --tunnel to force tunnel mode. Read more about how to use exp here: https://docs.expo.io/versions/latest/guides/exp-cli.html
* If, for some reason, your app can't find your expo account, you sometimes must change the DEVELOPMENT_URL under app/java/host.exp.exponent/generated/DetachBuildConstants but it shouldn't be needed.
* When the device is running, you can see options with Ctrl + M or Cmd + M.
* If something breaks with the emulator, always try restarting first.
* When developing in JavaScript and exp is running, live reload should be enabled. Everytime someting is saved in a file inside the App folder, the app will reload automatically. If it does not, you can use Cmd / Ctrl + M.
* Google is your friend.



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

## Deployment checklist
* Check config/version.js
* Check components/about-view/index.js and append Changelog
* ALWAYS publish on staging (pontusstjerna) before production (avajadi)
* Push to git :)

### Important links
* https://www.bis.doc.gov/index.php/policy-guidance/encryption
* https://support.google.com/googleplay/android-developer/answer/113770
