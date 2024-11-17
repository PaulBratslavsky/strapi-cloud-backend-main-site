'use strict';

/**
 * video-summary service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::video-summary.video-summary');
