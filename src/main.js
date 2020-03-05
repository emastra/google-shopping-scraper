//TOTH: 8

const Apify = require('apify');
const { log } = Apify.utils;
const { checkAndEval } = require('./utils');

const { REQUEST_TYPES } = require('./consts');
const { prepareRequestList } = require('./requestList');
const { handleSearchPage } = require('./search_page');
const { handleProductPage } = require('./product_page');

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');

    // Validate the input
    if (!input) throw new Error('Missing configuration');

    const {
        queries,
        countryCode,
        maxPostCount,
        isAdvancedResults,
        extendOutputFunction = null,
    } = input;

    if (!queries || !queries.length || !countryCode) {
        throw new Error('Missing configuration');
    }

    // Prepare the initial list of google shopping queries and request queue
    const requestList = await prepareRequestList(queries, countryCode);
    log.info('Search URLs:');
    requestList.sources.forEach(s => console.log('  ', s.url));

    const requestQueue = await Apify.openRequestQueue();

    // if exists, evaluate extendOutputFunction
    let evaledFunc;
    if (extendOutputFunction) evaledFunc = checkAndEval(extendOutputFunction);

    // Configure the crawler
    const crawler = new Apify.CheerioCrawler({
        requestList,
        requestQueue,
        useApifyProxy: true,
        apifyProxyGroups: ['GOOGLE_SERP'],
        // apifyProxyGroups: ['RESIDENTIAL'],
        useSessionPool: true,
        handlePageFunction: (params) => {
            const { request } = params;
            if (request.userData.type === REQUEST_TYPES.SEARCH_PAGE) return handleSearchPage(params, requestQueue, maxPostCount, isAdvancedResults, evaledFunc);
            return handleProductPage(params, isAdvancedResults, evaledFunc);
        },
        handleFailedRequestFunction: async ({ request }) => {
            log.warning(`Request ${request.url} failed too many times`);

            await dataset.pushData({
                '#debug': Apify.utils.createRequestDebugInfo(request),
            });
        },
    });

    // Process the queries
    await crawler.run();

    // Log the finish message, so that the user sees that the scraping is finished
    log.info('Processed all items');
});
