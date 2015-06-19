from flask import Flask, request
from pymongo import MongoClient
from bson.son import SON
import gridfs
import pymongo
import ast
import json

app = Flask(__name__, static_folder='dist')

client = MongoClient()
client = MongoClient('localhost', 27017)
db = client['track-database']
clicks = db['clicks']
hovers = db['hovers']

@app.route('/', methods = ['GET','POST'])
def signal():

    if request.method == 'POST':

        print "POST"
        mongo_save(request)
    else:
        print "GET"
        print mongo_get(request)
    return "done"


def mongo_save(request):
    print request.form
    for value in request.form:

        data = request.form[value].encode('ascii','ignore')

        clickCount, hoverCount = ast.literal_eval(data)

        print clickCount, hoverCount
        if clickCount == 0:
            return "saved"
        if hoverCount == 0:
            return "saved"

        if db.clicks.find_one({"name": value}) != None:
            print "CLICKS NOT UNIQUE"
            print db.clicks.find_one({"name": value})
            db.clicks.find_one_and_update({"name": value}, {'$inc': {'value': clickCount}})
            return "saved"
        if db.hovers.find_one({"name": value}) != None:
            print "HOVERS NOT UNIQUE"
            #print db.clicks.find_one({"name": value})
            db.clicks.find_one_and_update({"name": value}, {'$inc': {'value': hoverCount}})
            return "saved"

        sendClicks = {"name" : value, "value": clickCount}
        sendHovers = {"name" : value, "value": hoverCount}
        #oldVal = db.clicks.find_one({"name": value})
        db.clicks.save(sendClicks)
        db.hovers.save(sendHovers)
        clickCount, hoverCount = 0,0

    print "saved"
    return ("saved", 200, ["Access-Control-Allow-Origin: *"])

def mongo_get(request):
    print request.args
    for value in request.args:
        data = request.args[value].encode('ascii','ignore')
        if "clicks" in data:
            requested = db.clicks.find_one({"name": value})
            return requested["value"]

        if "hovers" in data:
            requested = db.hovers.find_one({"name": value})
            return requested["value"]
        return "improper request"
        #print mongo.find(value)

    return "none"

if __name__ == '__main__':
    app.run(debug=True)
