# gatsby-plugin-google-analytics-gdpr

Gatsby plugin to add google analytics in a gdpr form.

## Install

`npm install --save gatsby-plugin-google-analytics-gdpr`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics-gdpr`,
      options: {
        // The property ID; the tracking code won't be generated without it.
        trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID", 
        // Optional parameter (default false) - Enable analytics in development mode.
        enableDevelopment: true, // default false
        // Optional parameter (default true) - Some countries (such as Germany) require you to use the _anonymizeIP function for Google Analytics. Otherwise you are not allowed to use it.
        anonymizeIP: true,
        // Optional parameter (default false) - Starts google analytics with cookies enabled. In some countries (such as Germany) this is not allowed.
        autoStartWithCookiesEnabled: false, 
        // Optional parameter - Configuration for react-ga and google analytics 
        reactGaOptions: {
            debug: true,
            gaOptions: {
                sampleRate: 10
            }
        }
      },
    },
  ],
}
```
Note that this plugin is disabled while running `gatsby develop`. This way, actions are not tracked while you are still developing your project. Once you run `gatsby build` the plugin is enabled. Test it with `gatsby serve`.
You can use this plugin in development mode, if you set the plugin option `enableDevelopment`.

## How it works
By default this plugin starts google analytics without cookies and with a generated clientId to make it GDPR compliant. Google Analytics will be started on `onClientEntry`.
As soon as the user accepts your cookie policy, you can set the cookie `gatsby-plugin-google-analytics-gdpr_cookies-enabled`.
Depending on the user input the value should be `true` or `false`. 
If the cookie is set to true, Google Analytics will be restarted with enabled cookies. 
If the cookie is set to false, Google Analytics will continue without cookies.
If the user withdraws the choice, set the cookie to false und Google Analytics will be restarted in the correct mode.

The page view will be tracked on `onRouteUpdate`.
This plugin uses [react-ga](https://github.com/react-ga/react-ga) internally.

__Important:__ Please keep in mind to set the cookies. Otherwise the tracking won't work! Tracking won't happen at all if there are no cookies or they are set so false.

## Options

### `trackingId`

Here you place your Google Analytics tracking id.

## Optional Fields

### `enableDevelopment`

Enable analytics in development mode.

### `anonymizeIP`

Some countries (such as Germany) require you to use the
[\_anonymizeIP](https://support.google.com/analytics/answer/2763052) function for
Google Analytics. Otherwise you are not allowed to use it. 

### `autoStartWithCookiesEnabled`

Starts google analytics with cookies enabled. In some countries (such as Germany) this is not allowed.

### `reactGaOptions`

This plugin uses [react-ga](https://github.com/react-ga/react-ga) internally. Use this option to configure `react-ga`.

It is also possible to configure Google Analytics with Create Only Fields documented in [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#create). 

```javascript
reactGaOptions: {
    debug: true,
    gaOptions: { // google analytics create only fields
        sampleRate: 10
    }
}
```

The plugin overwrites some `gaOptions` to ensure other options like disabled cookies.

## Troubleshooting

### No actions are tracked

#### Check the tracking ID

Make sure you supplied the correct Google Analytics tracking ID. It should look like this: `trackingId: "UA-111111111-1"`