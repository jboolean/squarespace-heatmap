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
    return "saved"

def mongo_get(request):
    requestedVals = {}
    for value in request.args:
        data = request.args.getlist(value)
        print data
        vals = {}
        if "clicks" in data:
            requested = db.clicks.find_one({"name": value})
            vals["clicks"] = requested["value"]

        if "hovers" in data:
            print "hovers"
            requested = db.hovers.find_one({"name": value})
            vals["hovers"] = requested["value"]
        requestedVals[value] = vals
    return requestedVals

if __name__ == '__main__':
    app.run(debug=True)
