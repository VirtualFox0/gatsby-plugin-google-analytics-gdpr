exports.onPreInit = ({ reporter }, options) => {
    if (!options.trackingId) {
      reporter.warn(
        `The Google Analytics GDPR plugin requires a tracking ID.`
      )
    }
}