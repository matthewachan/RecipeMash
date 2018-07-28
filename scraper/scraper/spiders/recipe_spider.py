import scrapy

class RecipeSpider(scrapy.Spider):
    name = "recipes"

    def start_requests(self):
        base_url = 'https://www.epicurious.com/search/?content=recipe&page='
        page_limit = 2
        urls = [base_url + str(page_number) for page_number in xrange(1, page_limit + 1)]
        
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        domain = 'https://www.epicurious.com'

        for recipe in response.xpath('//h4[@class="hed"]/a'):
            print(recipe.xpath('text()').extract() + [domain + recipe.xpath('@href').extract()[0]])
