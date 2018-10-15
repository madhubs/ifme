// @flow
import Cookies from 'js-cookie';
import * as MyI18n from 'i18n-js';
import { translations } from './translations';

const translationsResult = (scope, locale) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  translations[locale] && translations[locale][scope];

const lookupOverride = (scope, options) => {
  const result = MyI18n.lookup(scope, options) || translationsResult(scope, MyI18n.locale);
  // Generating client/app/libs/i18n/translations.js strips % from interpolation values
  // react_on_rails.rb does not provide functionality to change this
  return result && result.replace('{', '%{');
};

const setup = () => {
  if (translations) {
    MyI18n.defaultLocale = 'en';
    MyI18n.locale = Cookies.get('locale');
    MyI18n.translations = translations;
    return Object.assign({}, MyI18n, {
      lookup: (scope, options = {}) => lookupOverride(scope, options),
    });
  }
  throw new Error('Translations could not be loaded in the client');
};

export const I18n = setup();
