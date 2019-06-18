function renderSet(parent, elementName, setName, text, elements) {
  var set = document.createElement('div');
  set.className = setName;
  set.appendChild(document.createTextNode(text));
  elements.forEach(function(element) {
    var el = document.createElement('span');
    el.className = elementName;
    el.appendChild(document.createTextNode(element));
    set.appendChild(el);
  });
  parent.appendChild(set);
}

fetch('https://coq.inria.fr/opam/coq-packages.json')
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var allCategories = [];
        var allKeywords = [];
        var allSuites = new Set();
        var table = document.getElementById('data');
        data.forEach(function(pkg) {
          var current = pkg[1].most_recent;
            var versions = new Set();
            var suites = new Set();
            pkg[1].versions.forEach(function(v) {
                versions.add(v.version);
                suites.add(v.suite);
                allSuites.add(v.suite);
            });
            pkg[1].versions.forEach(function(v) {
                if (v.version == current) {
                var row = document.createElement('tr');
                var col = document.createElement('td');
                row.className = 'package';
                var title = document.createElement('h3');
                title.className = 'name';
                title.appendChild(document.createTextNode(pkg[0]));
                if (v.homepage) {
                    var link = document.createElement('a');
                    link.href = v.homepage;
                    link.appendChild(title);
                    col.appendChild(link);
                } else {
                    col.appendChild(title);
                }
                var descr = document.createElement('p');
                descr.className = 'description';
                descr.appendChild(document.createTextNode(v.description));
                col.appendChild(descr);
                var metadata = document.createElement('div');
                metadata.className = 'metadata';
                renderSet(metadata, 'author', 'authors', 'authors: ', v.authors);
                renderSet(metadata, 'category', 'categories', 'categories: ', v.categories);
                allCategories = allCategories.concat(v.categories);
                renderSet(metadata, 'keyword', 'keywords', 'keywords: ', v.keywords);
                allKeywords = allKeywords.concat(v.keywords);
                renderSet(metadata, 'version', 'versions', 'versions: ', versions);
                renderSet(metadata, 'suite', 'suites', 'suites: ', suites);
                col.appendChild(metadata);
                row.appendChild(col);
                table.appendChild(row);
              }
            });
        });
        filter_init(allCategories, allKeywords, Array.from(allSuites));
    })
    .catch(function(err) {
        console.log(err);
      });
