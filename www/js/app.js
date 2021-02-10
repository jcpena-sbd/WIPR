angular.module("wipr_wp", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","wipr_wp.controllers", "wipr_wp.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "WIPR WP" ;
		$rootScope.appLogo = "data/images/avatar/wipr-blu.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_television = false ;
		$rootScope.hide_menu_envivo = false ;
		$rootScope.hide_menu_youtube = false ;
		$rootScope.hide_menu_categories = false ;
		$rootScope.hide_menu_radioam = false ;
		$rootScope.hide_menu_radiofm = false ;
		$rootScope.hide_menu_about_us = false ;
		$rootScope.hide_menu_post_bookmark = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "wipr_wp",
				storeName : "wipr_wp",
				description : "The offline datastore for WIPR WP app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("wipr_wp.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("wipr_wp",{
		url: "/wipr_wp",
			abstract: true,
			templateUrl: "templates/wipr_wp-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("wipr_wp.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.bookmarks", {
		url: "/bookmarks",
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-bookmarks.html",
						controller: "bookmarksCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.categories", {
		url: "/categories",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-categories.html",
						controller: "categoriesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.corporacion", {
		url: "/corporacion",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-corporacion.html",
						controller: "corporacionCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.dashboard", {
		url: "/dashboard",
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.dashboard_bookmark", {
		url: "/dashboard_bookmark",
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-dashboard_bookmark.html",
						controller: "dashboard_bookmarkCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.dashboard_singles", {
		url: "/dashboard_singles/:id",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-dashboard_singles.html",
						controller: "dashboard_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("wipr_wp.envivo", {
		url: "/envivo",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-envivo.html",
						controller: "envivoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.faqs", {
		url: "/faqs",
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.help", {
		url: "/help",
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-help.html",
						controller: "helpCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.post_bookmark", {
		url: "/post_bookmark",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-post_bookmark.html",
						controller: "post_bookmarkCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.post_singles", {
		url: "/post_singles/:id",
		cache:true,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-post_singles.html",
						controller: "post_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("wipr_wp.posts", {
		url: "/posts/:categories",
		cache:true,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-posts.html",
						controller: "postsCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("wipr_wp.radioam", {
		url: "/radioam",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-radioam.html",
						controller: "radioamCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.radiofm", {
		url: "/radiofm",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-radiofm.html",
						controller: "radiofmCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.television", {
		url: "/television",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-television.html",
						controller: "televisionCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.users", {
		url: "/users",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-users.html",
						controller: "usersCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.youtube", {
		url: "/youtube",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-youtube.html",
						controller: "youtubeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wipr_wp.youtube_singles", {
		url: "/youtube_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"wipr_wp-side_menus" : {
						templateUrl:"templates/wipr_wp-youtube_singles.html",
						controller: "youtube_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})


// router by user


	$urlRouterProvider.otherwise("/wipr_wp/dashboard");
});
