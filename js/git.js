var requests = [];
var pushed_date = [];

function getLatestCommit() {
    var requestURL = 'https://api.github.com/users/CerfMetal/repos';

    var request = $.get(requestURL, function () {
    }).done(function () {
        request = request.responseJSON;
        for (i = 0; i < request.length; i++) {
            requests.push(request[i]);
            pushed_date.push(request[i].pushed_at);
        }

        // Sort the array by date and reverse it
        requests.sort(compare).reverse();

        // Show the commits
        showCommits();

    });
}

function compare(a, b) {
    // Convert pushed_at to a date
    const dateA = new Date(a.pushed_at).getTime();
    const dateB = new Date(b.pushed_at).getTime();
  
    // Compare the 2 dates
    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  }


function showCommits() {
    // Loop through the requests array
    for (i = 0; i < requests.length; i++) {
        var name = requests[i].name;
        var new_name = name.replace(/-/g, " ");
        var language = requests[i].language;
        var description = requests[i].description;
        var created = requests[i].created_at;
        var url = requests[i].html_url;

        // HTML table
        var html = `<tr><td class="description"> <h2 class="project_title">${new_name}`;

        var logo_url;
        // Programming language
        if (language != null) {
            switch (language.toLowerCase()) {
                case "python": logo_url = "python_logo.svg";  break;
                case "c#": logo_url = "csharp_logo.svg"; break;
                case "c++": logo_url = "cplusplus_logo.svg"; break;
                case "c": logo_url = "c_logo.svg"; break;
                case "html": logo_url = "html_logo.svg"; break;
                case "css": logo_url = "css_logo.svg"; break;
                case "javascript": logo_url = "javascript_logo.png"; break;
                case "java": logo_url = "java_logo.svg"; break;
                case "php": logo_url = "php_logo.svg"; break;
            }
            html += `<img class="title_logo" src="img/${logo_url}" alt="${name} logo"/>`;
        }

        // Link to the repository
        html += `<a href="${url}" target="_blank"><img class="title_logo github" src="img/github_logo.svg" alt="Github logo"></a></h2><hr>`;

        // Description
        if (description != null) {
            html += `<p class="description">${description}</p> <div class="button_div" id="button_${name}"></div>`;
        }

        // Image of the project
        html += `</td><td id="img_${name}"></td></tr>`;


        addContent(html, "table");
        getReadme(name, logo_url);
    }
}


function addContent(content, id) {
    if (content != null) {
        document.getElementById(id).innerHTML += content;
    }
}

function getReadme(name, logo_url) {
    var requestURL2 = 'https://raw.githubusercontent.com/CerfMetal/' + name + '/main/README.md';
    // Get the response text of requestURL2
    var request2 = $.get(requestURL2, function () {
    }).done(function () {
        request2 = request2.responseText;

        // Take the first image of the README.md
        var start = request2.indexOf('https://user-images.githubusercontent.com');
        if (start != -1) {
            var character = request2[start-1];
            if (character == '(') {
                character = ")";
            }
            // Remove everything before the image
            var request3 = request2.substring(start);

            // Remove everything after the image
            var end = request3.indexOf(character);
            logo_url = request3.substring(0, end);

        }
        else if (logo_url != null) {
            // Remove _logo from the language name
            logo_url = "img/" + logo_url.replace("_logo", "");
            if (logo_url.includes(".svg")) {
                logo_url = logo_url.replace(".svg", ".png");
            }
        }
        else {
            logo_url = "img/github.png";
        }
        addContent(`<img src="${logo_url}" alt="Image of ${name}">`, `img_${name}`);


        var start_string = ['class="live_demo" href="', 'class="discord_demo" href="'];
        var end_string = ['"', '"'];
        var html_add = [`button_${name}`, `button_${name}`];

        
        // Add live content button
        for (i = 0; i < start_string.length; i++) {
            start = request2.indexOf(start_string[i]);
            console.log(start);
            if (start != -1) {
                // Remove everything before the link
                var live_link = request2.substring(start+start_string[i].length);
                var end = live_link.indexOf(end_string[i]);
                live_link = live_link.substring(0, end);
                // Create a button for the live_link
                var html_content = [`<a href="${live_link}" class="button">Live demo</a>`, `<a href="${live_link}" class="button">Discord demo</a>`];
                addContent(html_content[i], html_add[i])
            }
        }
    });   
    
}
