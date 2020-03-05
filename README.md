# Google Shopping Scraper
Google Shopping Scraper is an [Apify actor](https://apify.com/actors) for extracting data from [Google Shopping](https://www.google.com/shopping) web site.
It scrapes the first result page and details about each product and its sellers.

- [Input](#input)
- [Output](#output)
- [Extend output function](#extend-output-function)
- [Open an issue](#open-an-issue)

### Input

| Field | Type | Description |
| ----- | ---- | ----------- |
| queries | Array of Strings | List of queries to search for |
| countryCode | String | Country selected from enum (value is ISO-3166 Alpha-2 country code) |
| maxPostCount | Integer | Limit of the results to be scraped per page (0 means no limit) |
| isAdvancedResults | Array of Strings | Check it if you want more data into your results |

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
Each item will contain the search term and all values keyed by the corresponding date.

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
      "price": "$1650.00",
      "totalPrice": "$1796.44",
      "additionalPrice": ""
    }
  ],
  "price": "$1979.10",
  "merchantLink": "http://www.google.com/aclk?sa=l&ai=DChcSEwjp_vSpooPoAhUMlLMKHR6ODhsYABBGGgJxbg&sig=AOD64_3BSHnJWpFXjeoJyysFuEev97t7Ew&ctype=5&q=&ved=0ahUKEwjFo_GpooPoAhV0mHIEHfKkDGAQg-UECOIG&adurl="
}
```

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

### Open an issue
If you find any bug, please create an issue on the actor [Github page](https://github.com/emastra/google-shopping-scraper).
