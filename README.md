## OctopusApp

![Screenshots](https://raw.githubusercontent.com/rotoxl/octopus_app/master/screenshots/comp.png "Screenshots")

This is the repository of the app, built for Android and iOS, and based on [Cordova] (https://cordova.apache.org/) & [materializecss.com](http://materializecss.com/). 

[![Demo](https://raw.githubusercontent.com/rotoxl/octopus_app/master/screenshots/shop-browser.png)](http://app.octopusapp.es/prod.html) [![Free download /Android](https://raw.githubusercontent.com/rotoxl/octopus_app/master/screenshots/shop-android.png)](https://play.google.com/store/apps/details?id%3Des.octopusapp.clo&sa=D&ust=1498201723241000&usg=AFQjCNF_EGJsoy7ekebtyKi-0o_3hSlgjQ) [![Free download /iOS](https://raw.githubusercontent.com/rotoxl/octopus_app/master/screenshots/shop-ios.png)](https://itunes.apple.com/es/app/octopus-test-oposiciones-y/id1027449575?l%3Des%26ls%3D1%26mt&sa=D&ust=1498201723243000&usg=AFQjCNG34Ax4d7S9j6kvcFrzdokFeG9Cfw)
    
It has been reviewed in the following digital media:

* [La Vanguardia](http://www.lavanguardia.com/tecnologia/aplicaciones/20161020/411159472223/mejores-apps-oposiciones.html&sa=D&ust=1498201723247000&usg=AFQjCNFRN-XAyY9bfqnMChTlsC-ysTuqPg)
* [A todo curso](http://www.atodocurso.com/noticias/octopus-oposiciones-para-ayudarte-con-los-tests&sa=D&ust=1498201723247000&usg=AFQjCNHFNkBBoLXZzFTOnzIoMwATY8mw5w)
* [Apps Zoom](http://es.appszoom.com/android-app/octopus-official-cert-exams-sfgba.html&sa=D&ust=1498201723246000&usg=AFQjCNFn7ZUWDXP_sXdeuI-YajqQMWBXUw)
* [Read Write Web](http://www.readwriteweb.es/octopus-test-oposiciones/&sa=D&ust=1498201723246000&usg=AFQjCNE6Je4qkSEjehNRPbSaZB2TGzkM7g)
* [Formación y estudios](http://www.formacionyestudios.com/3-aplicaciones-moviles-te-ayudaran-oposicion.html&sa=D&ust=1498201723245000&usg=AFQjCNGBy2Q-fATBIyPRNJX0Upo4hCPPdQ)
* [El Androide Libre](http://www.elandroidelibre.com/2016/02/aplicaciones-para-examenes-oficiales-y-oposiciones.html&sa=D&ust=1498201723244000&usg=AFQjCNFeLmc3VYWVkwSCSqvCIcVBZSeeBQ)
* [Moviles Celular](http://www.movilescelular.com/aplicaciones-para-examenes-oficiales-y-oposiciones/&sa=D&ust=1498201723244000&usg=AFQjCNEl6q80dEwFLj6qOOAHc9xtDpZ5Ig)
* [Phonegap Spain](https://t.co/b5DPrFo433&sa=D&ust=1498201723243000&usg=AFQjCNFU4RW4tYyH7Oun0kXe4nVtecXMzQ)

Out of the box it's able to:

* [InApp purchases](https://github.com/j3k0/cordova-plugin-purchase)
* [Ads via admob](https://github.com/floatinghotpot/cordova-admob-pro)
* [App rate & review](https://github.com/pushandplay/cordova-plugin-apprate)
* [Analytics](https://github.com/danwilson/google-analytics-plugin)
* [Deep linking](https://github.com/EddyVerbruggen/Custom-URL-scheme)
* [Social Sharing](https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin)
* [Crosswalk](https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview)
* [Content syncing](https://github.com/phonegap/phonegap-plugin-contentsync)

## Deploy
### As webapp
`src` folder is ready to be uploaded to a PHP+MySQL server. You just need to:

* create database (scripts located in `database` folder)
* configure database access at `src/paramBD.nosvn.php`
* configure absolute path at `app.js` (relative path is not recomended beacause its also meant to be built as app)

### As cordova app

```
cordova create es.myawesomeapp.app
cd es.myawesomeapp.app

rm -rf www/*
rsync -a -c ../src www 

cordova plugin add cordova-plugin-device

cordova platform add android

cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-network-information

cordova plugin add https://github.com/EddyVerbruggen/cordova-plugin-actionsheet.git
cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git

cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git

cordova plugin add https://github.com/j3k0/cordova-plugin-purchase  --variable BILLING_KEY="** secret **"

cordova plugin add https://github.com/ptgamr/cordova-google-play-game.git --variable APP_ID=secret

cordova plugin add cordova-plugin-whitelist
cordova plugin add https://github.com/danwilson/google-analytics-plugin.git

cordova plugin add cordova-plugin-crosswalk-webview

cordova plugin add https://github.com/EddyVerbruggen/LaunchMyApp-PhoneGap-Plugin.git --variable URL_SCHEME=esoctopusapp

echo "¡Terminado! Recuerda añadir a AndroidManifest las líneas necesarias para la customURL (+info en config.xml)" 

```




