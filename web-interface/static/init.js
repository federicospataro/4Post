window.onload = function() {
      
      var id = localStorage.getItem("sessionid");

      if(window.location.pathname!="/login"){

        if(id==null){
          window.location.href = '/login';
        }

        set_navbar(true);

        if(window.location.pathname=="/index"){ index_load();}

        if(window.location.pathname.includes("post/")){ post_load();}

        if(window.location.pathname.includes("profile/")){ profile_load();}

      }else{

        if(id!=null){
          window.location.href = '/index';
        }

        set_navbar(false);

      }

    };

    function set_navbar(logged){

      if(logged){ var l="block"; var nl="none"}else{ var l="none"; var nl="block"}

      var test = document.getElementsByClassName("loggedlink");
      for(var i=0;i<test.length;i++){ test[i].style.display=l}
      var test = document.getElementsByClassName("nologgedlink");
      for(var i=0;i<test.length;i++){ test[i].style.display=nl}

    }

    function logout(){

      localStorage.removeItem("sessionid");
      window.location.href = '/login';

    }

    function index_load(){

      var id = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'http://'+window.location.host+'/api/posts', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          var r = JSON.parse(xhr.responseText);

          var content = "";

          for(var i = 0; i<Object.keys(r).length; i++){

            if(r[i]['like']){
              var imgname = "like1.png";
            }else{
              var imgname = "like2.png";
            }

            content = content + '<div class="card"><div class="card-body"><h5 class="card-title text-dark">'+r[i]['title']+'</h5><a href="/profile/'+r[i]['userid']+'" class="card-subtitle mb-2 text-muted">From '+r[i]['username']+'</a><p class="card-text text-dark">'+r[i]['phrase']+'</p><a class="card-subtitle mb-2 text-muted">'+r[i]['date']+' </a>&nbsp;&nbsp;<i style="cursor: pointer;" onclick="like(this)" id="icon,'+r[i]['id']+'"><img src="/static/img/'+imgname+'" height="25" width="25"></i>&nbsp;<a class="text-danger"><i id="count,'+r[i]['id']+'">'+r[i]['likes']+'</i> Likes</a><a href="/post/'+r[i]['id']+'" class="card-link">&nbsp;&nbsp;&nbsp;&nbsp;Comment →</a></div></div><br>'
          
          }

          if(content==""){

            content = "<br><br><br><center><p>No posts available</p></center><br><br><br>"

          }

          document.getElementById("postsarea").innerHTML = content;

        }

      }

    }


    function post_load(){

      var id = window.location.pathname.split("/").slice(-1)[0];
      var sessionid = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'http://'+window.location.host+'/api/singlepost', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'postid': id,
          'sessionid': sessionid
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          var r = JSON.parse(xhr.responseText);

          if(r['like']){
            var imgname = "like1.png";
          }else{
            var imgname = "like2.png";
          }

          var content = '<center><font size="+2"><h1>'+r['title']+'</h1><a href="/profile/'+r['userid']+'" class="card-subtitle mb-2 text-muted">From '+r['username']+'</a><p>'+r['phrase']+'</p><a class="mb-2 text-muted">'+r['date']+' </a>&nbsp;&nbsp;&nbsp;<i style="cursor: pointer;" onclick="like(this)" id="icon,'+r['id']+'"><img src="/static/img/'+imgname+'" height="30" width="30"></i>&nbsp;<a class="text-danger"><i id="count,'+r['id']+'">'+r['likes']+'</i> Likes</a></font></center>';

          document.getElementById("singlepostarea").innerHTML = content;

          var c = r['comments'];
          content = "";

          for(var i = 0; i<Object.keys(c).length; i++){

            content = content + '<a href="'+c[i]['userid']+'" class="text-dark"><b>'+c[i]['username']+'</b></a>&nbsp;&nbsp;<a class="text-muted">'+c[i]['date']+'</a><p>'+c[i]['comment']+'</p><hr>'

          }

          document.getElementById("commentsarea").innerHTML = content;
          
        }

      }

    }

    function profile_load(){

      var userid = window.location.pathname.split("/").slice(-1)[0];
      var id = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'http://'+window.location.host+'/api/profile', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id,
          'userid': userid
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          var p = JSON.parse(xhr.responseText);

          document.getElementById("nickname").textContent = p['username'];
          document.getElementById("description").textContent = p['description'];
          document.getElementById("role").textContent = p['role'];

          if(p['followed']){
            document.getElementById("notfollowed").style.display = "none";
            document.getElementById("followed").style.display = "inline-block";
          }else{
            document.getElementById("notfollowed").style.display = "inline-block";
            document.getElementById("followed").style.display = "none";
          }

        }

      }

    }


    function like(o){

      var postid = o.id.split(",")[1];
      
      if(o.getElementsByTagName('img')[0].src.includes("like2")){

        o.getElementsByTagName('img')[0].src = "/static/img/like1.png";
        document.getElementById("count,"+postid).textContent = parseInt(document.getElementById("count,"+postid).textContent)+1;
        var likeb = true;

      }else{

        o.getElementsByTagName('img')[0].src = "/static/img/like2.png";
        document.getElementById("count,"+postid).textContent = parseInt(document.getElementById("count,"+postid).textContent)-1;
        var likeb = false;

      }

      var id = localStorage.getItem("sessionid");

      var xhr = new XMLHttpRequest();
      xhr.open("POST", 'http://'+window.location.host+'/api/like', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
          'sessionid': id,
          'postid': postid,
          'like': likeb
      }));

      xhr.onreadystatechange = function() { 

        if (xhr.readyState == 4 && xhr.status == 200){

          //nothing

        }

      }

    }