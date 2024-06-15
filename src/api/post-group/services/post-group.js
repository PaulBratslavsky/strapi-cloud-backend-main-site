'use strict';

/**
 * post-group service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post-group.post-group');
