from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from bson.json_util import dumps

from flask_pymongo import PyMongo

from flask_jsonpify import jsonify
import sys

import http.client

import pymongo


application = Flask(__name__)
api = Api(application)
CORS(application)


language = ""

mongo = PyMongo()
myclient = pymongo.MongoClient("mongodb+srv://sudan:xWWiTSeKjmkj89DH@cluster0-ivmmb.mongodb.net/test?retryWrites=true&w=majority")
mydb = myclient["Bookshare"]


def removeHTMLTags(text):
    text = text.replace("</p>", "")
    text = text.replace("<h1>", "")
    text = text.replace("</h1>", "")
    return text

def processText(text):
    text = removeHTMLTags(text)
    return text.split("<p>")

def getBookFromDB(book_name):
    if type(book_name) is not str:
        book_name = book_name.decode("utf-8")
    mycol = mydb[book_name]
    paragraphs = list(mycol.find())
    return paragraphs

def createChapterNavigation(paragraphs):
    chapters = []
    chapterDict = {}
    for idx, para in enumerate(paragraphs):
        if "Chapter" in para:
            chapters.append(para)
        if idx > 100:
            break
    for chapter in chapters:
        chapterDict[chapter] = next(i for i in reversed(range(len(paragraphs))) if paragraphs[i] == chapter)
    return chapterDict

@application.route('/')
def helloWorld():
    message = "Hello, world!"
    return "<div> Hello! </div>"

@application.route('/book')
def getParagraphs():
    paragraphs = getBookFromDB(request.args.get('title'))
    text = [x['text'] for x in paragraphs]
    chapters = createChapterNavigation(text)
    return jsonify({"books" : text, "chapters": chapters})

@application.route('/stories')
def getStories():
    mycol = mydb['Cnn Stories']
    stories = mycol.find_one()
    return dumps(stories)

@application.route('/nationalgeographic')
def getNationalGeographic():
    mycol = mydb['NationalGeographicKids']
    stories = mycol.find_one()
    if '_id' in stories.keys():
        del stories['_id']
    stories = {'article_names': dumps(stories.keys()), 'content': dumps(stories)}
    return (stories)

@application.route('/postquizidentifiers')
def postQuizIdentifiers():
    mycol = mydb['QuizSubmissions']
    guid = request.args.get("guid")
    age = request.args.get("age")
    email = request.args.get("email")
    visually_impaired = request.args.get("visuallyimpaired")
    data = {'guid': guid, 'age': age, 'email': email, 
        'visuallyimpaired' : visually_impaired}
    if (mycol.find({'guid': guid}).count() == 0):
        mycol.insert_one(data)
        return {"value": "success"}
    else:
        return {"value": "duplicate guid found"}


@application.route('/postquizresults')
def postQuizResults():
    mycol = mydb['QuizSubmissions']
    guid = request.args.get("guid")
    test = request.args.get("test")
    myquery = {"guid": guid}
    newvalues = {"$set" : {'test': test}}
    mycol.update_one(myquery, newvalues)
    return {"value" : "success"}

@application.route('/association')
def getWordAssociation():
    originalWord = request.args.get('word')
    conn = http.client.HTTPSConnection("twinword-word-graph-dictionary.p.rapidapi.com")
    headers = {
        'x-rapidapi-host': "twinword-word-graph-dictionary.p.rapidapi.com",
        'x-rapidapi-key': "884694c9f9msh86ce774b80786dcp191e83jsn6a5e6c22dd3f"
        }
    conn.request("GET", "/reference/?entry=" + originalWord, headers=headers)
    res = conn.getresponse()
    data = res.read()
    return data

if __name__ == "__main__":
    application.run(host='0.0.0.0')
