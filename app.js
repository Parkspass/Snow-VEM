/*jshint esversion: 6 */

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js')
        .then((reg) => console.log("Service Worker Registered", reg))
        .catch((err) => console.log("Service Worker Not Registered", err));
}

var app = new Vue({
    el: '#app',
    data: {
        dialogm1: '',
        dialog: false,
        showInstallMessage: false,
        showAndroidInstallMessage: false,
        page: 'main',
        trails: [
            "Butterfly Trail",
            "Cinder Cone Trail",
            "Hidden Pinyon Trail",
            "Jenny's Canyon",
            "Johnson Canyon (Johnson's Arch) Trail",
            "Lava Flow Overlook",
            "Petrified Dunes",
            "Pioneer Names",
            "Snow Canyon Overlook Trail",
            "Snow Canyon State Park Petroglyphs",
            "Scout Cave Trail",
            "Whiterocks Amphitheater",
        ],
        weatherConditions: ['Sunny', 'Mostly Sunny', 'Cloudy', 'Thunder Storms', 'Rain Showers', 'Rain', 'Sleet', 'Snow', 'Haze', 'Smokey'],
        visitations: ['Not busy', 'Not too busy', 'Little busy', 'Busy as it gets'],
        statuses: ['Clear', 'Minor Issue', 'Significant Issue', 'Closed or Major Issue'],
        conditions: ['Dry/Normal Summer Conditions', 'Mostly Dry (some water)', 'Wet and Slippery', 'Snow', 'Some Snow', 'Snow and Ice'],

        currentName: 'Add Staff/Vip Name(s)',
        currentDate: '',
        currentTrail: 'Select Trail or Segment Name',
        currentWeather: 'Select Weather',
        currentNotes: 'Add Notes',
        currentVisitation: 'Select Visitation',
        currentStatus: 'Select Trail Status',
        currentCondition: 'Select Trail Conditions',
        
        hamburger_selected: false,
        name_selected: false,
        date_selected: false,
        trail_selected: false,
        weather_selected: false,
        notes_selected: false,
        visitation_selected: false,
        status_selected: false,
        condition_selected: false,

        footUp: 0,
        footDown: 0,

        startTime: '',
        endTime: '',
        latitude: '',
        longitude: '',
        nameError: false,
        dateError: false,
    },
    created: function(){
        this.loadDate();
        this.PWA_popup();
    },
    //used to find location:
    mounted(){
        
        function error() {
            status.textContent = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {
            status.textContent = 'Geolocation is not supported by your browser';
        }
        else {
            status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(this.handleGetGeoLocation, error);
        }
    },
    methods: {
        PWA_popup: function(){
            const isIos = () => {
                const userAgent = window.navigator.userAgent.toLowerCase();
                return /iphone|ipad|ipod/.test( userAgent );
            };
              // Detects if device is in standalone mode
            const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
              
              // Checks if should display install popup notification:
            if (isIos() && !isInStandaloneMode()) {
                this.showInstallMessage = true;
            }else if(!isIos() && !isInStandaloneMode()) {
                this.showAndroidInstallMessage = true;
            }

            setTimeout(() => this.showInstallMessage = false, 15000);
            setTimeout(() => this.showAndroidInstallMessage = false, 15000);
        },
        // LOCATION
        handleGetGeoLocation(pos){
            var crd = pos.coords;

            const status = document.querySelector('#status');
            const latitude  = crd.latitude;
            const longitude = crd.longitude;

            this.latitude = latitude;
            this.longitude = longitude;
        },
        // HAMBURGER
        hamburgerClicked: function(){
            this.hamburger_selected = true;
        },

        // INPUTS
        loadDate: function(){
            var date = new Date();
            var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

            var fulldate = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
            this.currentDate = fulldate;
            this.startTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        },
        nameClicked: function(){
            this.name_selected = true;
            if (this.currentName == "Add Staff/Vip Name(s)"){
                this.currentName = "";
            }
        },
        outside: function(){
            this.name_selected = false;
            this.nameError = false;
            if(this.currentName == "" || this.currentName == "Add Staff/Vip Name(s)"){
                this.currentName = "Add Staff/Vip Name(s)";
                this.nameError = true;
            }
        },
        trailClicked: function(){
            this.page = "trailSelect";
            this.name_selected = false;
        },
        weatherClicked: function(){
            this.page = "weatherSelect";
        },
        scroll: function(index){
            document.getElementById(index).scrollIntoView();
        },
        hide: function(){
            this.notes_selected = false;
        },
        closeEvent: function () {
            this.hide();
        },

        // BUTTONS
        doneClicked: function(){
            this.notes_selected = false;
            if(this.currentNotes == ""){
                this.currentNotes = "Add Notes";
            }
        },
        sendClicked: function(){
            var endDate = new Date();
            this.endTime = endDate.getHours() + ":" + endDate.getMinutes() + ":" + endDate.getSeconds();
            this.checkNulls();
            if (this.currentName && this.currentName != "Add Staff/Vip Name(s)" && this.currentDate) {
                //The email call should go here:
                //->
                var park = "Snow%20Canyon%20Data%20Submission";
                window.location.href="mailto:" + "?subject=" + park + "&body=" + 
                    this.currentName + ";" +
                    this.currentDate + ";" +
                    this.startTime + ";" +
                    this.endTime + ";" +
                    this.currentTrailSending + ";" +
                    this.latitude + ";" +
                    this.longitude + ";" +
                    this.footUp + ";" + 
                    this.footDown + ";" +
                    this.currentWeatherSending + ";" + 
                    this.currentVisitationSending + ";" +
                    this.currentStatusSending + ";" + 
                    this.currentConditionSending + ";" +
                    this.currentNotesSending + ";"
                ;
            }else {
                if (!this.currentName || this.currentName == "Add Staff/Vip Name(s)") {
                    this.nameError = true;
                }
                if (!this.currentDate) {
                    this.dateError = true;
                }
            }
        },
        checkNulls: function(){
            if (this.currentTrail == "Select Trail or Segment Name"){
                this.currentTrailSending = null;
            }else{
                this.currentTrailSending = this.currentTrail;
            }

            if(this.currentWeather == "Select Weather"){
                this.currentWeatherSending = null;
            }else{
                this.currentWeatherSending = this.currentWeather;
            }

            if(this.currentNotes == "Add Notes"){
                this.currentNotesSending = null;
            }else{
                this.currentNotesSending = this.currentNotes;
            }

            if(this.currentVisitation == "Select Visitation"){
                this.currentVisitationSending = null;
            }else{
                this.currentVisitationSending = this.currentVisitation;
            }

            if(this.currentStatus == "Select Trail Status"){
                this.currentStatusSending = null;
            }else{
                this.currentStatusSending = this.currentStatus;
            }

            if(this.currentCondition == "Select Trail Conditions"){
                this.currentConditionSending = null;
            }else{
                this.currentConditionSending = this.currentCondition;
            }
        },
    },
});

