
import contentTypeBuilder from '@strapi/plugin-content-type-builder/strapi-admin';
import email from '@strapi/plugin-email/strapi-admin';
import upload from '@strapi/plugin-upload/strapi-admin';
import strapiCloud from '@strapi/plugin-cloud/strapi-admin';
import i18N from '@strapi/plugin-i18n/strapi-admin';
import usersPermissions from '@strapi/plugin-users-permissions/strapi-admin';
import previewButton from 'strapi-plugin-preview-button/strapi-admin';


const plugins = {
  'content-type-builder': contentTypeBuilder,
  'email': email,
  'upload': upload,
  'strapi-cloud': strapiCloud,
  'i18n': i18N,
  'users-permissions': usersPermissions,
  'preview-button': previewButton,
};

export default plugins;
