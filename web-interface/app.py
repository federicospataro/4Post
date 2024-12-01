from flask import Flask, render_template, request, make_response, redirect
import os
import json
import requests

app=Flask(__name__)

#WARNING: THIS SCRIPT IS NOT THE FINAL BACKEND APPLICATION, IS JUST TO TEST TEMPLATES AND
#FOR PROVIDING FAKE API RESPONSES

#------------------------------------------------------------------------------------------------

#JUST SERVING STATIC TEMPLATES

@app.route("/",methods=['GET'])
def default():

    return redirect("/index")


@app.route("/login",methods=['GET'])
def login():

    return render_template('login.html',done=False)


@app.route("/index",methods=['GET'])
def index():

    return render_template('index.html',done=False)


@app.route("/newpost",methods=['GET'])
def new_post():

    return render_template('new_post.html',done=False)

@app.route("/post/<id>",methods=['GET'])
def post(id):

    return render_template('post.html',done=False)


@app.route("/profile/<id>",methods=['GET'])
def profile(id):

    return render_template('profile.html',done=False)


@app.errorhandler(404)
def not_found(e):
  return render_template("404.html")


#------------------------------------------------------------------------------------------------

#API RESPONSE (JUST TESTING, STATIC RESPONSES)


@app.route("/api/login",methods=['POST'])
def api_login():

    #Must check the database if the credentials match.
    #If so, the API should create a new session, associate the id of the user to that session, 
    #and respond with the sessionid (plain text, not json)
    #If the credentials do not match, reply with the word "error"

    username=request.json['username']
    password=request.json['password']

    if (username=="a") and (password=="a"): #only for testing the bad credentials
        text="error"
    else:
        text="testid"

    response = make_response(text, 200)
    response.mimetype = "text/plain"
    return response


#FROM NOW ON, WHEN YOU GET THE SESSIONID,
#YOU MUST OBTAIN THE USERID BY CHECKING WHICH USER IS ASSOCIATED WITH THE SESSION


@app.route("/api/posts",methods=['POST'])
def api_posts():

    #The API must respond, in JSON format, with posts created by users that the userid follows.
    #(check in the database which users are followed by the userid, then get the posts)
    #The format in the example must be respected

    sessionid=request.json['sessionid']
    
    post1 = {

        'id': '123',
        'userid': '111',
        'username': 'Mark',
        'title': 'Test1',
        'phrase': 'This is a test phrase 1',
        'date': '25/11/2024',
        'like': False, #if the user like or not like that post
        'likes': '6'

    }

    post2 = {

        'id': '6565',
        'userid': '222',
        'username': 'Fabio',
        'title': 'Test2',
        'phrase': 'This is a test phrase 2',
        'date': '25/11/2024',
        'like': True, #if the user like or not like that post
        'likes': '2'

    }

    l=[]
    l.append(post1)
    l.append(post2)

    text=json.dumps(l)

    response = make_response(text, 200)
    response.mimetype = "application/json"
    return response


@app.route("/api/singlepost",methods=['POST'])
def api_singlepost():

    #The API must respond, in JSON format, with information and comments relating to the post associated with the postid.
    #The format in the example must be respected

    postid=request.json['postid']
    sessionid=request.json['sessionid']
    
    post1 = {

        'id': '123',
        'userid': '111',
        'username': 'Mark',
        'title': 'Test1',
        'phrase': 'This is a test phrase 1',
        'date': '25/11/2024',
        'like': False, #if the user like or not like that post
        'likes': '6'

    }

    c1 = {
        'userid': '111',
        'username': 'Mark',
        'comment': 'this is comment test 1',
        'date': '25/11/2024'
    }

    c2 = {
        'userid': '222',
        'username': 'Fabio',
        'comment': 'this is comment test 2',
        'date': '25/11/2024'
    }

    comments=[]
    comments.append(c1)
    comments.append(c2)

    post1['comments'] = comments

    text=json.dumps(post1)

    response = make_response(text, 200)
    response.mimetype = "application/json"
    return response


@app.route("/api/addcomment",methods=['POST'])
def api_addcomment():

    #The API must save the comment in the database, creating an id for the comment, and associating
    #the id of the user who wrote it, the text of the comment and the date of the comment.
    #It can provide a simple "ok" in plain text as a response

    sessionid=request.json['sessionid']
    comment=request.json['comment']

    response = make_response("ok", 200)
    response.mimetype = "text/plain"
    return response


@app.route("/api/profile",methods=['POST'])
def api_profile():
    
    #The API must respond with some information regarding the user associated with the userid.
    #It also needs to check whether the logged in user follows the userid or not (then provide it as a response in the "followed" field).
    #The format in the example must be respected

    sessionid=request.json['sessionid'] #sessionid of the logged user
    userid=request.json['userid'] #userid of the user displayed

    profile = {

        'username': "Mark",
        'description': "Hello, I'm a user",
        'role': 'User',
        'followed': True

    }

    text=json.dumps(profile)

    response = make_response(text, 200)
    response.mimetype = "application/json"
    return response


@app.route("/api/follow",methods=['POST'])
def api_follow():

    #The API must set in the database that the logged user follows (or unfollow) the provided userid
    #It can provide a simple "ok" in plain text as a response

    follow=request.json['follow'] #true for follow, false for unfollow
    userid=request.json['userid']
    sessionid=request.json['sessionid']

    response = make_response("ok", 200)
    response.mimetype = "text/plain"
    return response


@app.route("/api/addpost",methods=['POST'])
def api_addpost():

    #The API must insert the new post into the database (title, phrase, author userid and an id created to identify the post)
    #It can provide a simple "ok" in plain text as a response

    sessionid=request.json['sessionid']
    title=request.json['title']
    phrase=request.json['phrase']
    postid="generated_id..."

    response = make_response("ok", 200)
    response.mimetype = "text/plain"
    return response


@app.route("/api/like",methods=['POST'])
def api_like():

    #The API must set in the database that the user likes (or unlikes) a certain post
    #It can provide a simple "ok" in plain text as a response

    sessionid=request.json['sessionid']
    postid=request.json['postid']
    like=request.json['like'] #true for like, false for removing the like

    response = make_response("ok", 200)
    response.mimetype = "text/plain"
    return response


#------------------------------------------------------------------------------------------------


if __name__=='__main__':
    app.run(debug=True)
