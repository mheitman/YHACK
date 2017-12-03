import requests
import json

GOOGLE_API_KEY = 'AIzaSyAHwf_cr7_74eJGebWn_oBQGue1SiSZD6I'
NEWS_API_KEY = '8e35262201b141f18ab63b79b5c2b7c9'
LOCATIONS = ["sublocality", "administrative_area_level_2", "administrative_area_level_1", "country"]


def check_importance(input_types):
    for x in input_types:
        if x in LOCATIONS:
            return True

    return False


# Geocoding API Key = AIzaSyAHwf_cr7_74eJGebWn_oBQGue1SiSZD6I
def get_city(lat, long):
    to_return = []
    url = ('https://maps.googleapis.com/maps/api/geocode/json?latlng='
          + str(lat) + ',' + str(long)
          + '&key=' + GOOGLE_API_KEY)

    response = requests.get(url)
    loaded_json = json.loads(response.content)
    if loaded_json['status'] == 'OK':
        address_components = loaded_json['results'][0]['address_components']
        for x in address_components:
            if check_importance(x['types']):
                to_return.append(x['long_name'])
        return to_return
    else:
        print(response)
        return -1


# get_articles takes in a list of keywords and makes a search based on that
# returns the list of related articles
# TODO: decide what data type to return if there was an error loading the page
def get_articles(keywords_list):
    keywords = ''
    for x in keywords_list:
        keywords += (x.replace(' ', '+') + '+')
    url = ('https://newsapi.org/v2/everything?'
        'q=' + keywords[:-1] + '&'
        'sortBy=relevance&'
        'apiKey=' + NEWS_API_KEY)
    response = requests.get(url)
    loaded_json = json.loads(response.content)
    if loaded_json['status'] == 'ok':
        return loaded_json['articles']
    else:
        return -1


def parse_article(article):
    data = dict()
    data["title"] = article["title"]
    data["author"] = article["author"]
    data["url"] = article["url"]
    data["imageUrl"] = article["urlToImage"]
    data["description"] = article["description"]
    data["date"] = article["publishedAt"]
    data["source"] = article["source"]["name"]
    json_data = json.dumps(data)
    return json_data


def parse_top_articles(article_list, number):
    to_return = []
    for i in range(min(number, len(article_list))):
        to_return.append(parse_article(article_list[i]))
    return to_return


def get_top_articles(lat,long):
    city = get_city(lat,long)
    if city is not -1:
        articles = get_articles(city)
        if articles is not -1:
            top_articles_json_list = parse_top_articles(articles,10)
            for x in top_articles_json_list:
                print(x)
            return top_articles_json_list
    else:
        return -1