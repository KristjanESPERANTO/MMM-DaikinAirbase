/* MagicMirror²
 * Node Helper: MMM-DaikinAirbase
 *
 * By Matt Thurling
 * MIT Licensed.
 */

const http = require("node:http");
const Log = require("logger");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

    start () {
        Log.log(`Starting node helper: ${this.name}`);
    },

    socketNotificationReceived (notification, payload) {
        const self = this;

        if (notification === "GET_DAIKIN_AIRBASE_STATS") {
            self.started = true;
            if (!payload || !payload.ipAddress) {
                self.sendSocketNotification("DAIKIN_AIRBASE_ERROR", "ipAddress not configured!");
                return;
            }

            const getBasicInfo = self.getDaikinAirbasePromise(payload.ipAddress, "/skyfi/common/basic_info", "basicInfo");
            const getControlInfo = self.getDaikinAirbasePromise(payload.ipAddress, "/skyfi/aircon/get_control_info", "controlInfo");
            const getSensorInfo = self.getDaikinAirbasePromise(payload.ipAddress, "/skyfi/aircon/get_sensor_info", "sensorInfo");

            Promise.all([getBasicInfo, getControlInfo, getSensorInfo]).then((returnedStats) => {
                const processedInfo = {};
                for (const data of returnedStats) {
                    if (data.basicInfo) {
                        // the name is returned as a set of hex decimals
                        const nameCharHexArray = data.basicInfo.name.substring(1).split("%");
                        let translatedName = "";
                        for (character of nameCharHexArray) {
                            translatedName += String.fromCharCode(parseInt(character, 16));
                        }
                        processedInfo.name = translatedName;
                    }
                    if (data.controlInfo) {
                        processedInfo.power = data.controlInfo.pow;
                        processedInfo.mode = data.controlInfo.mode;
                        processedInfo.targetTemperature = data.controlInfo.stemp;
                        processedInfo.fanRate = data.controlInfo.f_rate;
                    }
                    if (data.sensorInfo) {
                        processedInfo.indoorTemperature = data.sensorInfo.htemp;
                        processedInfo.outdoorTemperature = data.sensorInfo.otemp;
                    }
                }
                self.sendSocketNotification("DAIKIN_AIRBASE_STATS", processedInfo);
            });
        }
    },

    getDaikinAirbasePromise (address, apiPath, resultName) {
        return new Promise((resolve) => {
            const options = {
                host: address,
                method: "GET",
                path: apiPath,
                headers: {
                    Accept: "*/*"
                }
            };
            const dataReq = http.request(options, (response) => {
                if (response.statusCode != 200) {
                    Log.error(`data request error: ${response.statusCode}`);
                    this.sendSocketNotification("DAIKIN_AIRBASE_ERROR", `Could not retrieve ${resultName}`);
                }
                response.on("data", (data) => {
                    const returnObject = {};
                    // convert the key value pairs to json
                    returnObject[resultName] =JSON.parse(
                            `{"${new String(data).replace(/,/g, "\", \"").replace(/[=]/g, "\": \"")}"}`
                        );
                    resolve(returnObject);
                });
            });
            dataReq.on("error", (error) => {
                Log.error(`Failed to retrieve ${resultName}! error: ${error}`);
                this.sendSocketNotification("DAIKIN_AIRBASE_ERROR", `Could not retrieve ${resultName}`);
            });
            dataReq.end();
        });
    }
});
