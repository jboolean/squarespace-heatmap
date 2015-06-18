from flask import Flask, request
from pymongo import MongoClient
import gridfs
import pymongo

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
        mongo_get(request)
    return "done"


def mongo_save(request):
    for value in request.form:

        data = request.form[value].encode('ascii','ignore')
        clickCount, hoverCount = eval(data)

        sendClicks = {"name" : value, "value": clickCount}
        sendHovers = {"name" : value, "value": hoverCount}

        db.clicks.save(sendClicks)
        db.hovers.save(sendHovers)

    print "saved"
    return "saved"

def mongo_get(request):
    print request.args
    for value in reest.args:
        print value
        print request.args[value]
        data = request.args[value].encode('ascii','ignore')
        if "clicks" in data:
            print value, list(db.clicks.find({"name": value}))
        if "hovers" in data:
            print value, list(db.hovers.find({"name": value}))
        #print mongo.find(value)

    return "none"

if __name__ == '__main__':
    app.run(debug=True)
