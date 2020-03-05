const Apify = require('apify');
const { REQUEST_TYPES } = require('./consts');

function countryCodeToGoogleHostname(countryCode) {
    const suffix = countryCode.toLowerCase();
    switch (suffix) {
        case 'us':
            return 'www.google.com';
        default:
            return `www.google.${suffix}`;
    }
}

function prepareRequestList(queries, countryCode) {
    const hostname = countryCodeToGoogleHostname(countryCode);
    const sources = queries.map((query) => {
        const url = `http://${hostname}/search?q=${encodeURIComponent(query)}&tbm=shop`;

        return new Apify.Request({
            url,
            userData: {
                type: REQUEST_TYPES.SEARCH_PAGE,
                query,
                hostname,
            },
        });
    });
    return Apify.openRequestList('products', sources);
}

module.exports = {
    prepareRequestList,
};
