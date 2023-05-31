/* global Module */

/* Magic Mirror
 * Module: MMM-DaikinAirbase
 *
 * By Matt Thurling
 * (Forked from MMM-Daikin made by Kyrill Meyer)

 * MIT Licensed.
 */
 
 Module.register('MMM-DaikinAirbase', {
    defaults: {
        ipAddress: 'DaikinAirbase',
        refreshInterval: 1000 * 60 * 1, // 1 minute
        animationSpeed: 1 * 1000, // 1 seconds
    },

    fanRateValue: {
        "0": "FAN_AUTO",
        "1": "FAN_LOW",
        "3": "FAN_MID",
        "5": "FAN_HIGH",
        "1a": "FAN_LOW_AUTO",
        "3a": "FAN_MID_AUTO",
        "5a": "FAN_HIGH_AUTO",
    },

    icons: {
        "status-off": "fa-toggle-off",
        "status-on": "fa-toggle-on",
        "mode-fan": "fa-retweet",
        "mode-heat": "fa-sun",
        "mode-cool": "fa-snowflake",
        "mode-auto": "fa-font",
        "mode-dehumidify": "fa-droplet-slash",
        "fan-speed": "fa-fan",
        "outdoor-temp": "fa-cloud-sun",
        "indoor-temp": "fa-thermometer-half",
        "target-temp": "fa-crosshairs",
    },

    start() {
        Log.info("Starting module: " + this.name);

        this.loaded = false;
        this.stats = {};
        this.getDaikinAirbaseStats();

        const self = this;
        setInterval(function() {
            self.getDaikinAirbaseStats();
            self.updateDom();
        }, this.config.refreshInterval);
    },

    getDaikinAirbaseStats() {
        Log.info("MMM-DaikinAirbase: getting stats");
        this.sendSocketNotification(
            'GET_DAIKIN_AIRBASE_STATS',
            this.config
        );
    },

    getDom() {
        if (this.error) {
            return this.renderError();
        }
        if (!this.loaded) {
            return this.renderLoading();
        }
        return this.renderStats();
    },

    renderError() {
        let wrapper = document.createElement('div');
        wrapper.className = 'dimmed light small';
        wrapper.innerHTML = this.error;
        return wrapper;
    },

    renderLoading() {
        let wrapper = document.createElement('div');
        wrapper.className = 'dimmed light small';
        wrapper.innerHTML = this.translate('LOADING');
        return wrapper;
    },

    renderStats() {
        let wrapper = document.createElement('table');
        wrapper.className = 'small';
        wrapper.innerHTML = `
            <tr>
                <td class="name">${this.stats.name}</td>
                ${this.renderPower()}
                ${this.renderMode()}
                ${this.renderItem("fan-speed", this.translate(this.fanRateValue[this.stats.fanRate]), !this.stats.power)}
            </tr>
            <tr>
                <td/>
                ${this.renderItem("outdoor-temp", this.stats.outdoorTemperature + "°")}
                ${this.renderItem("indoor-temp", this.stats.indoorTemperature + "°")}
                ${this.renderItem("target-temp", this.stats.targetTemperature + "°", !this.stats.power)}
            </tr>
        `;
        return wrapper;
    },

    renderItem(iconToUse, value, dimmed) {
        return `
                <td class="bin title ${dimmed ? "dimmed" : "bright"}">
                    <i class="fas ${this.icons[iconToUse]}"></i> ${value}
                </td>
            `;
    },

    renderPower() {
        if (this.stats.power) {
            return this.renderItem("status-on", this.translate('ON'), !this.stats.power);
        }
        return this.renderItem("status-off", this.translate('OFF'), !this.stats.power);
    },

    renderMode() {
        switch (this.stats.mode) {
            case "0":
                return this.renderItem("mode-fan", this.translate('FAN'), !this.stats.power);
            case "1":
                return this.renderItem("mode-heat", this.translate('HEAT'), !this.stats.power);
            case "2":
                return this.renderItem("mode-cool", this.translate('COOL'), !this.stats.power);
            case "3":
                return this.renderItem("mode-auto", this.translate('AUTO'), !this.stats.power);
            case "7":
                return this.renderItem("mode-dehumidify", this.translate('DEHUM'), !this.stats.power);
        }
    },

    socketNotificationReceived(notification, payload) {
        switch (notification) {
            case 'DAIKIN_AIRBASE_STATS':
                this.error = '';
                this.loaded = true;
                this.stats = payload;
                break;
            case 'DAIKIN_AIRBASE_ERROR':
                this.error = payload;
                break;
        }

        this.updateDom(this.config.animationSpeed);
    },

    getScripts() {
        return [];
    },

    getTranslations() {
        return {
            en: 'translations/en.json',
        };
    },
});
