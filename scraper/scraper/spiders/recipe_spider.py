import scrapy
from scraper.items import Recipe
from scrapy.loader import ItemLoader

class RecipeSpider(scrapy.Spider):
    name = "recipes"

    def start_requests(self):
        self.base_url = 'https://www.epicurious.com/search/?content=recipe&page='
        self.current_page = 1900
        urls = [self.base_url + str(1)]
        # urls = [base_url + str(page_number) for page_number in xrange(1, page_limit + 1)]
        
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        if response.status != 404:
            domain = 'https://www.epicurious.com'

            link_path = '//h4[@class="hed"]/a/@href'

            for href in response.xpath(link_path):
                yield scrapy.Request(domain + href.extract(), callback=self.parse_recipe)

            self.current_page += 1
            yield scrapy.Request(url=self.base_url+str(self.current_page), callback=self.parse)


    def parse_recipe(self, response): 
       
        def coalesce(x):
            if (x == []):
                return " "
            return x

        name_path = '//h1[@itemprop="name"]/text()' 
        author_path =  '//a[@class="contributor"]/@title'
        rating_path = '//span[@class="rating"]/text()' 
        published_date_path = '//span[@class="pub-date"]/text()' 
        description_path = '//div[@itemprop="description"]/p/text()' 
        ingredients_path = '//ul[@class="ingredients"]/li/text()' 
        instructions_path = '//ol[@class="preparation-steps"]/li/text()' 
        active_time_path = '//dd[@class="active-time"]/text()' 
        total_time_path = '//dd[@class="total-time"]/text()' 

        l = ItemLoader(item=Recipe(), response=response)

        if (l.get_xpath(name_path)):
            l.add_xpath('name', name_path)
        if (l.get_xpath(author_path)):
            l.add_xpath('author', author_path)
        if (l.get_xpath(rating_path)):
            l.add_xpath('rating', rating_path)
        if (l.get_xpath(published_date_path)):
            l.add_xpath('published_date', published_date_path)
        if (l.get_xpath(description_path)):
            l.add_xpath('description', description_path)
        if (l.get_xpath(ingredients_path)):
            l.add_xpath('ingredients', ingredients_path)
        if (l.get_xpath(instructions_path)):
            l.add_xpath('instructions', instructions_path)
        if (l.get_xpath(active_time_path)):
            l.add_xpath('active_time', active_time_path)
        if (l.get_xpath(total_time_path)):
            l.add_xpath('total_time', total_time_path)

        yield l.load_item()
