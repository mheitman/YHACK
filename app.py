import json
from flask import Flask, request, redirect, Response
from requests_oauthlib import OAuth1
import requests
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

CONSUMER_API_KEY = "wQbdzvNEOcMOe12z77Y6Miqvc"
CONSUMER_API_SECRET = "s5DEhz0Amr5Ey8pgZWNeDiwY9BF1yEcosh2S2IFeUIP4LBBtPT"
ACCESS_TOKEN = "628291152-pbJZ0i8mGVxwmWzgPsVztZXxT4S8TaRF7ghC0icK"
ACCESS_TOKEN_SECRET = "9F7DXNN0pXOSLIyWfz5EMJ4jqIwV6VAGaEpNNAkHUPgHL"


url = "https://api.twitter.com/1.1/account/verify_credentials.json"
auth = OAuth1(CONSUMER_API_KEY, CONSUMER_API_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)


@app.route("/", methods=["POST"])
def test():
    print(request.form.get("Lat"))
    return "hid"


@app.route("/tweets", methods=["POST","OPTIONS"])
def test_tweets():
    lat = request.form.get("Lat")
    lng = request.form.get("Lng")
    KEYWORDS = ["the", "i", "a", "to"]
    result = []
    acc = []
    for word in KEYWORDS:
        url = ("https://api.twitter.com/1.1/search/tweets.json?q=" + word + "&result_type=recent&lang=en&count=5&"
               + "geocode=" + lat + "," + lng + ",50km")
        response = requests.get(url, auth=auth)
        if response.status_code == 200:
            loaded_json = json.loads(response.content)
            statuses = loaded_json["statuses"]
            result += statuses
            print("Success")
        else:
            print("get from twitter api error")
    for i in range(1,5):
        item = result[i]
        print(item["user"]["screen_name"])
        acc += [{"handle" : item["user"]["screen_name"], "text" : item["text"], "url" : item["user"]["url"]}]
    to_return = json.dumps({"results": acc})
    return to_return


if __name__ == "__main__":
    app.run()
