from flask import Flask, request
from pymongo import MongoClient
import gridfs

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
        print request.form
        for value in request.form:
            clicks = db.clicks
            print clicks
            print db.hovers
            post = {'clicks': request.form[value]}
            print post
            #clicks.insert_one(post)
            #db.clicks.insert_one()
        print clicks.find_one()
    else:
        print request.form



if __name__ == '__main__':
    app.run()
