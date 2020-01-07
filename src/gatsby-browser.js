import ReactGA from "react-ga"
import Cookies from "js-cookie"
import 'clientjs'

const COOKIE_GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_COOKIES_ENABLED = "gatsby-plugin-google-analytics-gdpr_cookies-enabled"

// the following running modes are used with window.GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_RUNNING_WITH_MODE
const GA_MODE_RUNNING_COOKIES_DISABLED = "runningCookiesDisabled"
const GA_MODE_RUNNING_COOKIES_ENABLED = "runningCookieEnabled"

function determineClientId() {
    const client = new ClientJS() // eslint-disable-line no-undef
    const fingerprint = client.getFingerprint()
    return fingerprint
}

function initializeGA(pluginOptions) {
    var gaOptions = {}
    if (!isCookiesEnabled()) { 
        const clientFingerprint = determineClientId()
        gaOptions = {
            storage: "none", // disable cookies for googe analytics
            clientId: clientFingerprint // set custom client fingerprint 
        }
        window.GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_RUNNING_WITH_MODE = GA_MODE_RUNNING_COOKIES_DISABLED
    } else {
        window.GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_RUNNING_WITH_MODE = GA_MODE_RUNNING_COOKIES_ENABLED
    }

    var ractGaOptions = {'gaOptions': gaOptions}
    if (pluginOptions.reactGaOptions !== undefined) {
        gaOptions = {...pluginOptions.reactGaOptions.gaOptions, ...gaOptions} 
        ractGaOptions = {...pluginOptions.reactGaOptions, ...{'gaOptions': gaOptions}}
    } 
    
    ReactGA.initialize(pluginOptions.trackingId, ractGaOptions)
    ReactGA.set({ anonymizeIp: isAnonymizeIpEnabled(pluginOptions) })
}

function isCookiesEnabled() {
    return Cookies.get(COOKIE_GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_COOKIES_ENABLED) === "true"
}

function isAnonymizeIpEnabled(pluginOptions) {
    return (pluginOptions.anonymizeIP !== undefined) ? pluginOptions.anonymizeIP : true
}

function isDevelopmentEnabled(pluginOptions) {
    return (pluginOptions.enableDevelopment !== undefined) ? pluginOptions.enableDevelopment : false
}

export const onClientEntry = (_, pluginOptions = {}) => {
    if (!pluginOptions.trackingId) {
        console.log("The Google Analytics GDPR plugin requires a tracking ID.")
        return null
    }
    if (process.env.NODE_ENV !== 'production' && !isDevelopmentEnabled(pluginOptions)) {
        return null
    }
    // start with setting from cookie if available
    // if no cookie settings is available, start with gatsby plugin settings 'autoStartWithCookiesEnabled'
    // if no plugin setting ist available, start with default setting (autoStartWithCookiesEnabled = false)
    if (Cookies.get(COOKIE_GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_COOKIES_ENABLED) === undefined) {
        var autoStartWithCookiesEnabled = pluginOptions.autoStartWithCookiesEnabled;
        autoStartWithCookiesEnabled = (autoStartWithCookiesEnabled !== undefined) ? autoStartWithCookiesEnabled : false;
        Cookies.set(COOKIE_GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_COOKIES_ENABLED, ""+autoStartWithCookiesEnabled);
    }

    initializeGA(pluginOptions); 
  }

  function isGARunningInCorrectMode() {
    const runningWithCookiesEnabled = window.GATSBY_PLUGIN_GOOGLE_ANALYTICS_GDPR_RUNNING_WITH_MODE === GA_MODE_RUNNING_COOKIES_ENABLED;
    return (isCookiesEnabled() === runningWithCookiesEnabled) 
  }
  
  export const onRouteUpdate = ({ location }, pluginOptions = {}) => {
    if (!pluginOptions.trackingId) {
        console.log("The Google Analytics GDPR plugin requires a tracking ID.")
        return null
    }
    if (process.env.NODE_ENV !== 'production' && !isDevelopmentEnabled(pluginOptions)) {
        return null
    }

    // restart google analytics with correct settings if needed
    if (!isGARunningInCorrectMode()) {
        ReactGA.ga("remove");
        initializeGA(pluginOptions)
    }

    ReactGA.set({ page: location.pathname, anonymizeIp: isAnonymizeIpEnabled(pluginOptions) });
    ReactGA.pageview(location.pathname);
  }