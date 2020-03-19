# Google Shopping Scraper
Google Shopping Scraper is an [Apify actor](https://apify.com/actors) for extracting data from [Google Shopping](https://www.google.com/shopping) web site, in any country domain. It scrapes the first result page and details about each product and its sellers. It is build on top of [Apify SDK](https://sdk.apify.com/) and you can run it both on [Apify platform](https://my.apify.com) and locally.

- [Input](#input)
- [Output](#output)
- [Google SERP](#google-serp)
- [Expected CU consumption](#expected-cu-consumption)
- [Extend output function](#extend-output-function)
- [Open an issue](#open-an-issue)

### Input

| Field | Type | Description |
| ----- | ---- | ----------- |
| queries | Array of Strings | (required) List of queries to search for |
| countryCode | String | (required) Provide the country to search in (choose from the country list when using the editor, provide the country code when using JSON) |
| maxPostCount | Integer | Limit of the results to be scraped per page, 0 means no limit. Currently the actor scrapes only the 1st page (20 results) |
| isAdvancedResults | Boolean | Check this if you want to scrape more data. Your dataset items will have more fields including `merchantName` and `reviews` |
| extendOutputFunction | string | Function that takes a JQuery handle ($) as argument and returns data that will be merged with the default output. More information in [Extend output function](#extend-output-function) |

INPUT Example:

```
{
  "queries": [
    "iphone 11 pro"
  ],
  "countryCode": "US",
  "maxPostCount": 1,
  "isAdvancedResults": false
}
```

### Output

Output is stored in a dataset.
Example of one output item:
```
{
  "shoppingId": "7427975830799030963",
  "productName": "24k Gold Plated Apple Iphone 11 Pro Max - 256 Gb Silver Unlocked Cdma",
  "description": "Shoot amazing videos and photos with the Ultra Wide, Wide, and Telephoto cameras. Capture your best low-light photos with Night mode. Watch HDR movies and shows on the 6.5-inch Super Retina XDR display the brightest iPhone display yet. Experience unprecedented performance with A13 Bionic for gaming, augmented reality (AR), and photography. And get all-day battery life and a new level of water resistance. All in the first iPhone powerful enough to be called Pro.« less",
  "merchantMetrics": "",
  "seller": [
    {
      "productLink": "http://www.google.com/aclk?sa=L&ai=DChcSEwiT8NStooPoAhUJjrMKHf6KDlkYABABGgJxbg&sig=AOD64_2y1iAG2xTUTL-jllVQRjqJyIg9rw&adurl=&ctype=5",
      "merchant": "eBay",
      "merchantMetrics": "0",
      "details": "· Free shipping",
      "price": "$1,650.00",
      "totalPrice": "$1,796.44",
      "additionalPrice": ""
    }
  ],
  "price": "$1,979.10",
  "merchantLink": "http://www.google.com/aclk?sa=l&ai=DChcSEwjp_vSpooPoAhUMlLMKHR6ODhsYABBGGgJxbg&sig=AOD64_3BSHnJWpFXjeoJyysFuEev97t7Ew&ctype=5&q=&ved=0ahUKEwjFo_GpooPoAhV0mHIEHfKkDGAQg-UECOIG&adurl="
}
```

**Note about price format**
Different countries has different price formats, currently the actor leaves the price format as it is found on the page.

### Google SERP
The actor uses Google SERP Proxy to scrape localized results. For more information, check the [documentation](https://docs.apify.com/proxy/google-serp-proxy).

### Extend output function

You can use this function to update the default output of this actor. This function gets a JQuery handle `$` as an argument so you can choose what data from the page you want to scrape. The output from this will function will get merged with the default output.

The **return value** of this function has to be an **object**!

You can return fields to achieve 3 different things:
- Add a new field - Return object with a field that is not in the default output
- Change a field - Return an existing field with a new value
- Remove a field - Return an existing field with a value `undefined`

The following example will add a new field:
```
($) => {
    return {
        comment: 'This is a comment',
    }
}
```

### Expected CU consumption
Expected compute units is 0.0272 every 10 products.

### Open an issue
If you find any bug, please create an issue on the actor [Github page](https://github.com/emastra/google-shopping-scraper).
