/**
 * Copyright 2013 Kinvey, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global $: true, Kinvey: true */
(function() {
  'use strict';

  // Setup.
  // ------

  // Initialize Kinvey.
  var promise = Kinvey.init({
    appKey    : 'kid_VTpS9qbe7q',
    appSecret : '5ae17c3bd8414d7f917c59a1c14a8fcd',
    sync      : {
      enable : true,
      online : navigator.onLine
    }
  });
  promise.then(function(activeUser) {
    // Preload templates.
    if(null === activeUser) {
      return Kinvey.User.create();
    }
  }).then(function(){
	$.when([$.Mustache.load('templates/search.html')]).then(function(){
		debugger;
		$.mobile.initializePage();// Render page.	
	});
  }, function(){alert('cant connect to server');});

  // On/offline hooks.
  $(window).on({
    offline : Kinvey.Sync.offline,
    online  : function() {
      // Some browsers fire the online event before the connection is available
      // again, so set a timeout here.
      setTimeout(function() {
        Kinvey.Sync.online();
      }, 10000);
    }
  });
  

  // Default mustache data filters.
  var mustacheData = {
    self: function() {
      return this.author._id === Kinvey.getActiveUser()._id ||
       (null != this.recipient && this.recipient._id === Kinvey.getActiveUser()._id);
    },
    date: function() {
      return new Date(this._kmd.lmt).toUTCString();
    },
    isSelect : function(){
    	return this.type == "select";
    },
    isCheckbox : function(){
    	debugger;
    	return this.type == 'checkbox';
    }
  };

  
  // Home.
  // -----
  var home = $('#home');
  home.on({
    /**
     * Init hook.
     */
    pageinit: function() {
      
      home.on('click', '#save', function() {
      	debugger;
        var button = $(this).addClass('ui-disabled');
        //TODO: data search
		$.mobile.changePage(route);
        var button = $(this).removeClass('ui-disabled');
      });
    },

    /**
     * Before show hook.
     */
    pagebeforeshow: function() {
      Kinvey.DataStore.find('search-options', null, {
    	success : function(response) {
    		window.searchOptions = response;
    		for (var i in response){
    			if (response[i].values){
    				var values = response[i].values;
    				var array = [];
    				for (var j in values){
    					array[array.length] = {'name':j, 'value' : values[j]};
    				}
    				response[i].values = array;
    			}
    		}
    		home.find('.search_form').mustache('search', $.extend({ searchOptions: window.searchOptions }, mustacheData)).listview('refresh');
    		home.find("select").each(function(){
    			if($(this).data('role') == 'slider'){
    				$(this).slider().slider('refresh');
    			} else {
    				$(this).selectmenu().selectmenu('refresh')
    			}
    		});
    	},
    	fail: function(){
    		debugger;
    	}
      });
      
    }
  });

  // maps.
  // --------
  var mobileDemo = { 'center': '57.7973333,12.0502107', 'zoom': 10 };
  var route   = $('#route');
  route.on({
  	pageinit : function(){
  		debugger;
  		$('#map_canvas').gmap({'center': mobileDemo.center, 'zoom': mobileDemo.zoom, 'disableDefaultUI':true, 'callback': function() {
			var self = this;
			self.addMarker({'position': this.get('map').getCenter() }).click(function() {
				self.openInfoWindow({ 'content': 'Hello World!' }, this);
			});
		}});
		
		
  		
		route.on('click',"#sliderOpen", function(){
			if (route.sliderOpened){
				$("#sliderOpen").text("Slide up to pause route");
				route.sliderOpened = false;
				$("#pauseRoute").animate({
					height: 0
				});
			} else {
				$("#pauseRoute").show().height(0);
				$("#pauseRoute").animate({
					height: route.contentHeight
				});
				$("#sliderOpen").text("Slide down to resume route");
				route.sliderOpened = true;
			}
			
			
		});
		
		route.on("click", "#checkin_btn", function(){
			$.mobile.changePage(checkins);
			
		});
		
  	},
  	pageshow : function() {
  		debugger;
  		$('#map_canvas').gmap('refresh'); 
  		var the_height = ($(window).height() - $(this).find('[data-role="header"]').height() - $(this).find('[data-role="footer"]').height());
  		route.contentHeight = the_height;
		
    	$(this).height($(window).height()).find('[data-role="content"]').height(the_height);
    	
    	
    	
  	}
  });
  
  var checkins   = $('#checkins');
  

  
}.call(this));