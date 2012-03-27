(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/html/itemDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            // Appbar
            var appbar = document.querySelector("#appbar").winControl;
            appbar.showOnlyCommands(["saveBthBar", "logoutBthBar", "home"]);




            var item = options && options.item ? options.item : data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            //element.querySelector("article .item-image").src = item.images.thumbnail.url;
            element.querySelector("article .item-image").src = item.images.standard_resolution.url;

            element.querySelector("article .item-author").textContent = item.user.full_name;

            element.querySelector("article .item-comment-text").textContent = (item.comments.data).length;
            element.querySelector("article .item-like-text").textContent = item.likes.count;
            element.querySelector("article .media-id").textContent = item.id;

            if (item.location) {

                var mapImage = document.createElement('img');

                var mapURI = "http://maps.googleapis.com/maps/api/staticmap?";
                var mapLat = item.location.latitude;
                var mapLng = item.location.longitude;
                var mapName = item.location.name;
                mapURI += "center=" + mapLat + "," + mapLng + "&zoom=15&size=400x300&maptype=terrain&sensor=false";
                mapURI += "&markers=color:blue%7Clabel:S%7C" + mapLat + "," + mapLng;

                mapImage.src = mapURI;

                //elememt.querySelector("article .item-map").appendChild(mapImage);

                element.querySelector("article .item-map .item-map-image").src = mapURI;
               // element.querySelector("article .item-map .item-map-text").textContent = mapName;
            } else {
                element.querySelector("article .item-map").removeChild(".item-map-image");
            }

            var comments = element.querySelector("article .comments");
            for (var i = 0; i < item.comments.data.length; i++) {
                var comment_list = document.createElement('ul');

                var comment = document.createElement("li");
                comment.className = "clearfix";

                var comment_body = document.createElement("div");
                comment_body.className = "comment-body";


                var comment_thumbnail = document.createElement("img");
                comment_thumbnail.src = item.comments.data[i].from.profile_picture;
                comment_thumbnail.width = 25;
                comment_thumbnail.height = 25;
                comment_thumbnail.className = "comment-user-thumbnail";
                //comment_thumbnail.style = "float:left; width:70px; height:70px;";
                comment.appendChild(comment_thumbnail);

                var comment_name = document.createElement('strong');
                comment_name.textContent = item.comments.data[i].from.username;
                comment_thumbnail.className = "comment-user-name";
                comment.appendChild(comment_name);

                var comment_text = document.createElement('p');
                comment_text.textContent = item.comments.data[i].text;
                comment.appendChild(comment_text);




                comment_list.appendChild(comment);

                comments.appendChild(comment_list);



            }




            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();

            dtm.addEventListener("datarequested", function (e) {
                var request = e.request;

                request.data.properties.description = "Interesting Instagram Photo";


                if (item.caption) {
                    request.data.properties.title = item.caption.text;
                    request.data.setText(item.caption.text + " by " + item.user.full_name);
                } else {
                    request.data.properties.title = "Instagram Photo";
                    request.data.setText(Photo + " by " + item.user.full_name);
                }
                // Share recipe image
                var image = document.querySelector(".item-image");
                //var uri = image.getAttribute("src");
                var uri = item.images.standard_resolution.url;
                var uriThumbnail = item.images.standard_resolution.url;
                if (uri.indexOf("http://") == 0 || uri.indexOf("https://") == 0) {
                    uri = new Windows.Foundation.Uri(uri); // Remote image
                    uriThumbnail = new Windows.Foundation.Uri(uriThumbnail); // Remote image
                } else {
                    uri = new Windows.Foundation.Uri("ms-appx:///" + image.getAttribute("src")); // Local images
                }
                var reference = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(uri);
                var referenceThumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(uri);
                request.data.properties.thumbnail = referenceThumbnail;
                var deferral = request.getDeferral();
                request.data.setBitmap(reference);

                deferral.complete();


            });



        } // end Ready
    })
})();

function doLike() {
    var act = localSettings.values['access_token'];
   
    var itemID = document.getElementsByClassName("media-id")[0].innerHTML;

    var mediaURL = "https://api.instagram.com/v1/media/" + itemID + "/likes?access_token=" + act;


    if (document.getElementsByClassName("item-like-button")[0].innerHTML == "Unlike") {
        WinJS.xhr({ type: "DELETE", url: mediaURL }).then(function (result) {
            var data = JSON.parse(result.responseText);
            if (data.meta.code == 200) {
                var likeLabel = document.getElementsByClassName("item-like-text")[0];
                var likecount = parseInt(likeLabel.innerHTML);
                likecount--;
                likeLabel.innerHTML = likecount;

                document.getElementsByClassName("item-like-button")[0].innerHTML = "Like";
            }
        }, function (e) {
            var error = e;
        });
    } else {
        WinJS.xhr({ type: "POST", url: mediaURL }).then(function (result) {
            var data = JSON.parse(result.responseText);
            if (data.meta.code == 200) {
                var likeLabel = document.getElementsByClassName("item-like-text")[0];
                var likecount = parseInt(likeLabel.innerHTML);
                likecount++;
                likeLabel.innerHTML = likecount;

                document.getElementsByClassName("item-like-button")[0].innerHTML = "Unlike";
            }
        }, function (e) {
            var error = e;
        });
    }


}

function doComment() {
    var act = localSettings.values['access_token'];
    var text = document.getElementsByClassName("commentBox")[0];
    var itemID = document.getElementsByClassName("media-id")[0].innerHTML;
    var mediaURL = "https://api.instagram.com/v1/media/" + itemID + "/comments";

    var dataStr = "access_token=" + act+"&text=" + text.value;
    
   
    WinJS.xhr({ type: "POST", url: mediaURL, data: dataStr }).then(function (m) {
        var item = JSON.parse(m.responseText);
       
        if (item.meta.code == 200) {
            appendComment(item);
        }
    }, function (e) {
        var error = e;
    });
    
}


function appendComment(item){
    var comment_list = document.createElement('ul');

    var comment = document.createElement("li");
    comment.className = "clearfix";

    var comment_body = document.createElement("div");
    comment_body.className = "comment-body";


    var comment_thumbnail = document.createElement("img");
    comment_thumbnail.src = item.data.from.profile_picture;
    comment_thumbnail.width = 25;
    comment_thumbnail.height = 25;
    comment_thumbnail.className = "comment-user-thumbnail";
  
    comment.appendChild(comment_thumbnail);

    var comment_name = document.createElement('strong');
    comment_name.textContent = item.data.from.username;
    comment_thumbnail.className = "comment-user-name";
    comment.appendChild(comment_name);

    var comment_text = document.createElement('p');
    comment_text.textContent = item.data.text;
    comment.appendChild(comment_text);




    comment_list.appendChild(comment);
    var comments = document.getElementsByClassName("comments")[0];
    comments.appendChild(comment_list);
}
