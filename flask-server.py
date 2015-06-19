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
        return "POSTED"
    else:
        print "GET"
        return str(json.dumps(mongo_get(request)))



def mongo_save(request):
    print request.form
    for value in request.form:

        data = request.form[value].encode('ascii','ignore')

        clickCount, hoverCount = ast.literal_eval(data)
        print data
        print clickCount, hoverCount
        if clickCount == 0:
            return "saved"
        if hoverCount == 0:
            return "saved"

        if db.clicks.find_one({"name": value}) != None:
            check_click_unique(value, clickCount)
        if db.hovers.find_one({"name": value}) != None:
            check_hover_unique(value, hoverCount)

        sendClicks = {"name" : value, "value": clickCount}
        sendHovers = {"name" : value, "value": hoverCount}
        #oldVal = db.clicks.find_one({"name": value})
        db.clicks.insert_one(sendClicks)
        db.hovers.insert_one(sendHovers)
        clickCount, hoverCount = 0,0
    headers = {}

    print "saved"
    return ("saved", 200, ["Access-Control-Allow-Origin: *"])

def check_click_unique(value, clickCount):
    print "CLICKS NOT UNIQUE"
    print db.clicks.find_one({"name": value})
    db.clicks.find_one_and_update({"name": value}, {'$inc': {'value': clickCount}})
    return "saved"

def check_hover_unique(value, hoverCount):
    print "HOVERS NOT UNIQUE"
    db.hovers.find_one_and_update({"name": value}, {'$inc': {'value': hoverCount}})
    return "saved"

def mongo_get(request):
    requestedVals = {}
    for value in request.args:
        data = request.args.getlist(value)
        print data
        vals = {}
        if "clicks" in data:
            requested = db.clicks.find_one({"name": value})
            if requested != None:
                vals["clicks"] = requested["value"]

        if "hovers" in data:
            print "hovers"
            requested = db.hovers.find_one({"name": value})
            if requested != None:
                vals["hovers"] = requested["value"]
        requestedVals[value] = vals
    return requestedVals

if __name__ == '__main__':
    app.run(debug=True)
