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
//Splash screen
var splash = $('#splash');
splash.on({
    pageinit: function () {
        // Initialize Kinvey.
        var promise = Kinvey.init({
            appKey: 'MY_APP_KEY',
            appSecret: 'MY_APP_SECRET',
            sync: {
                enable: true,
                online: navigator.onLine
            }
        });
        promise.then(function (activeUser) {
            active_user = activeUser;

        }).then(function () {
            if (null !== active_user) {
                loadShipment();
            } else {
                console.log("changePage login");
                current_page = login_page;
                $.mobile.changePage(login);
            }
        }, function () {
            navigator.notification.alert("Can't connect to Kinvey server",function(){},'Connection error','OK');
        });
    }
});

