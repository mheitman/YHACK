import requests
import json


def get_top_article(city):
    url = ('https://newsapi.org/v2/everything?'
              'q=' + city + '&'
              'from=2017-12-02&'
              'sortBy=popularity&'
              'apiKey=8e35262201b141f18ab63b79b5c2b7c9')
    response = requests.get(url)
    loaded_json = json.loads(response.content)
