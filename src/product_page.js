const Apify = require('apify');
const { applyFunction } = require('./utils');


function getSellers(productElement, $, linkPrefix) {
    // get all sellers
    const sellerRows = productElement.find('#sh-osd__online-sellers-cont .sh-osd__offer-row');

    const results = [];

    // For each seller, get data and push it to results array
    sellerRows.each(function () {
        const row = $(this);

        const price = row.find('td:nth-child(3)').text().trim().replace(',', '');
        const additionalPrice = row.find('.sh-osd__content table tbody tr:nth-child(2) td:first-child').text().trim().replace(',', '');
        let totalPrice = row.find('.sh-osd__total-price').text().trim().replace(',', '');
        if (!totalPrice) totalPrice = price;
        const ratingDiv = row.find('.sh-osd__merchant-info-container > div');
        let rating = '';
        let ratingCount = 0;
        if (ratingDiv.text().trim().length > 0) {
            rating = row.find('.sh-osd__merchant-info-container > div > span').text().trim();
            ratingCount = row.find('.sh-osd__merchant-info-container > div > a').text().trim();
        }

        results.push({
            productLink: `${linkPrefix}${row.find('.sh-osd__seller-link').prop('href')}`,
            merchant: row.find('.sh-osd__seller-link span:first-child').text().trim(),
            merchantMetrics: `${rating} ${ratingCount}`.trim(),
            details: row.find('td.SH30Lb:nth-child(2) > div').text().trim(),
            price,
            totalPrice,
            additionalPrice,
        });
    });

    // return results array
    return results;
}


async function handleProductPage({ request, $ }, isAdvancedResults, evaledFunc) {
    const { hostname } = request.userData;
    let { result } = request.userData;

    const linkPrefix = `http://${hostname}`;

    const productElement = $('div[class^="sg-product"]');

    // Page does not contain product details end here
    if (!productElement.length) {
        // if basic results, re-initialize result object with relevant props
        if (!isAdvancedResults) {
            result = {
                shoppingId: result.shoppingId,
                productName: result.productName,
                description: result.description,
                merchantMetrics: result.merchantMetrics,
                seller: result.productDetails ? result.productDetails.sellers : null,
                price: result.price,
                merchantLink: result.merchantLink
            }
        }

        // if extended output fnction exists, apply it now.
        if (evaledFunc) result = await applyFunction($, evaledFunc, result);

        await Apify.pushData(result);
    }

    const productDetails = {};

    // get product images and add it to productDetails
    const imageElements = productElement.find('div.main-image img[class*="__image"]');
    if (imageElements.length) {
        productDetails.images = [];
        imageElements.each(function () {
            productDetails.images.push($(this).attr('src'));
        });
    }

    // get sellers data and add it to productDetails
    productDetails.sellers = getSellers(productElement, $, linkPrefix);

    // add productDetails to result object
    result.productDetails = productDetails;

    // grab description
    const descriptionSpan = productElement.find('p.sh-ds__desc span[style="display:none"]');
    if (descriptionSpan) result.description = descriptionSpan.text().replace('« less', '');

    // if basic results, re-initialize result object with relevant props
    if (!isAdvancedResults) {
        result = {
            shoppingId: result.shoppingId,
            productName: result.productName,
            description: result.description,
            merchantMetrics: result.merchantMetrics,
            seller: result.productDetails.sellers,
            price: result.price,
            merchantLink: result.merchantLink
        }
    }

    // if extended output fnction exists, apply it now.
    if (evaledFunc) result = await applyFunction($, evaledFunc, result);

    await Apify.pushData(result);

    // slow down scraping to avoid being blocked by google
    await Apify.utils.sleep(1000);
}

module.exports = {
    handleProductPage,
};
