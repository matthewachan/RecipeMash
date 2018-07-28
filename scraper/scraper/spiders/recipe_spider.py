import scrapy

class RecipeSpider(scrapy.Spider):
    name = "recipes"

    def start_requests(self):
        base_url = 'https://www.epicurious.com/search/?content=recipe&page='
        page_limit = 1
        urls = [base_url + str(page_number) for page_number in xrange(1, page_limit + 1)]
        
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        domain = 'https://www.epicurious.com'

        for href in response.xpath('//h4[@class="hed"]/a/@href'):
            yield scrapy.Request(domain + href.extract(), callback=self.parse_recipe)

    def parse_recipe(self, response): 
        def coalesce(x):
            if (x == []):
                return " "
            return x

        yield {
            'name': coalesce(response.xpath('//h1[@itemprop="name"]/text()').extract())[0].strip(),
            'author': coalesce(response.xpath('//a[@class="contributor"]/@title').extract())[0].strip(),
            'rating': coalesce(response.xpath('//span[@class="rating"]/text()').extract())[0].strip(),
            'published_date': coalesce(response.xpath('//span[@class="pub-date"]/text()').extract())[0].strip(),
            'description': coalesce(response.xpath('//div[@itemprop="description"]/p/text()').extract())[0].strip(),
            'ingredients': coalesce(response.xpath('//ul[@class="ingredients"]/li/text()')).extract(),
            'instructions': coalesce(''.join(response.xpath('//ol[@class="preparation-steps"]/li/text()').extract())).strip(),
            'active_time': coalesce(response.xpath('//dd[@class="active-time"]/text()').extract())[0].strip(),
            'total_time': coalesce(response.xpath('//dd[@class="total-time"]/text()').extract())[0].strip() 
        }
