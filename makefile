cmain:
	cordova platform add android

	cordova -d plugin add https://github.com/phonegap/phonegap-facebook-plugin.git --variable APP_ID="1916811611870927" --variable APP_NAME="Eureka"

	android update project --subprojects --path "platforms/android" --target android-28 --library "CordovaLib"

	android update project --subprojects --path "platforms/android" --target android-28 --library "com.phonegap.plugins.facebookconnect/FacebookLib"

	cd platforms/android/

	ant clean

	cd com.phonegap.plugins.facebookconnect/FacebookLib

	ant clean

	open -e AndroidManifest.xml

	// change your minSdkVersion and your targetSdkVersion to your environment settings for me it was:
	// <uses-sdk android:minSdkVersion="14" android:targetSdkVersion="17" />

	ant release

	cd ../../../..

	cordova build android
