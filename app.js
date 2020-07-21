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
        statuses: ['Clear', 'Minor Issue', 'Significant Issue', 'Closed or Major Issue'],

        currentName: 'Add Staff/Vip Name(s)',
        currentDate: '',
        currentTrail: 'Select Trail or Segment Name',
        currentWeather: 'Select Weather',
        currentStatus: 'Select Trail Status',
        currentNotes: 'General Observations',
        currentTrailsign: 'Trail/Sign Issues',
        
        hamburger_selected: false,
        name_selected: false,
        date_selected: false,
        trail_selected: false,
        foot_selected: true,
        dog_selected: false,
        status_selected: false,
        notes_selected: false,
        trailsign_selected: false,

        foot: 0,
        dog: 0,
        footRotation: 180,
        dogRotation: 0,

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
            return fulldate;
        },
        nameClicked: function(){
            this.name_selected = true;
            this.date_selected = false;
            if (this.currentName == "Add Staff/Vip Name(s)"){
                this.currentName = "";
            }
            if(this.currentDate == ""){
                this.currentDate = this.loadDate();
            }
        },
        nameCheck: function(){
            this.nameError = false;
            if(this.currentName == "" || this.currentName == "Add Staff/Vip Name(s)"){
                this.currentName = "Add Staff/Vip Name(s)";
                this.nameError = true;
            }
        },
        dateClicked: function (){
            this.date_selected = true;
            this.name_selected = false;
            this.nameCheck();
        },
        outside: function(){
            this.name_selected = false;
            this.date_selected = false;
            this.nameError = false;
            this.dateError = false;
            this.nameCheck();
            if(this.currentDate == ""){
                this.currentDate = this.loadDate();
            }
        },
        trailClicked: function(){
            this.nameCheck();
            this.page = "trailSelect";
            this.name_selected = false;
            this.date_selected = false;
            if(this.currentDate == ""){
                this.currentDate = this.loadDate();
            }
        },
        footClicked: function(){
            if (this.foot_selected == true){
                this.foot_selected = false;
                this.footRotation = 0;
            }else{
                this.foot_selected = true;
                this.footRotation = 180;
            }
        },
        dogClicked: function(){
            if (this.dog_selected == true){
                this.dog_selected = false;
                this.dogRotation = 0;
            }else{
                this.dog_selected = true;
                this.dogRotation = 180;
            }
        },
        notesClicked: function(){
            this.notes_selected = true;
            this.currentNotes = "";
        },
        trailsignClicked: function(){
            this.trailsign_selected = true;
            this.currentTrailsign = "";
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
                this.currentNotes = "General Observations";
            }
            this.trailsign_selected = false;
            if(this.currentTrailsign == ""){
                this.currentTrailsign = "Trail/Sign Issues";
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
                    this.foot + ";" + 
                    this.dog + ";" +
                    this.currentStatusSending + ";" + 
                    this.currentNotesSending + ";" +
                    this.currentTrailsignSending + ";"
                ;
            }else {
                if (!this.currentName || this.currentName == "Add Staff/Vip Name(s)") {
                    this.nameError = true;
                }
            }
        },
        checkNulls: function(){
            if (this.currentTrail == "Select Trail or Segment Name"){
                this.currentTrailSending = null;
            }else{
                this.currentTrailSending = this.currentTrail;
            }

            if(this.currentNotes == "General Observations"){
                this.currentNotesSending = null;
            }else{
                this.currentNotesSending = this.currentNotes;
            }

            if(this.currentTrailsign == "Trail/Sign Issues"){
                this.currentTrailsignSending = null;
            }else{
                this.currentTrailsignSending = this.currentTrailsign;
            }

            if(this.currentStatus == "Select Trail Status"){
                this.currentStatusSending = null;
            }else{
                this.currentStatusSending = this.currentStatus;
            }
        },
    },
});

