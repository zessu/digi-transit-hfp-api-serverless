"use strict";

// async-mqtt is suggested :)
// const mqtt = require("async-mqtt");

const HSL_ENDPOINT = "mqtts://mqtt.hsl.fi:8883";

const DEFAULT_DURATION = 5 * 60 * 1000;

/**
 * Construct subscription topics
 *
 * @param {string} mode - enum[train, bus, tram]
 * @param {string} routeId - e.g: 1114, 1077N etc.
 */
function constructTopic(mode, routeId) {
  return `/hfp/v2/journey/ongoing/vp/${mode}/+/+/${routeId}/1/+/+/+/+/#`;
}

module.exports.subscribeVehicleLocation = async () => {
  // TODO
};
