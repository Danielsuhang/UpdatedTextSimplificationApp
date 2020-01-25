from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin

from flask_pymongo import PyMongo

from flask_jsonpify import jsonify
import sys

import pymongo


app = Flask(__name__)
api = Api(app)
CORS(app)


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

# def addParagraphToDB(processed_paragraph):
#     for i in range(len(processed_paragraph)):
#         mycol.insert_one({'index' : i, 'text' : processed_paragraph[i]})

# def deleteAllParagraphsBefore(mycol, paragraphs, index):
#     for i in range(index):
#         mycol.delete_one(paragraphs[i])

@app.route('/')
def getBook():
    global langauge
    book = language
    if (type(language) is not str):
        book = book.decode("utf-8")
    processed_paragraph = processText(book)
    return jsonify({'books': [{'content': book, 'paragraphs': processed_paragraph}]})

@app.route('/book')
def getParagraphs():
    paragraphs = getBookFromDB(request.args.get('title'))
    text = [x['text'] for x in paragraphs]
    chapters = createChapterNavigation(text)
    return jsonify({"books" : text, "chapters": chapters})

@app.route('/post-text', methods=['POST'])
def postBook():
    global language
    language = request.data
    return '''<h1>The text value is: {}'''.format(language)

if __name__ == "__main__":
    app.run(port=5002)
