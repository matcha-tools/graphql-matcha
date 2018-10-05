const path = require("path");

function matchaWrap(schema) {
  function matcha(req, res, next) {
    const html = getIndexHTMLString();
    switch (req.path) {
      case "/":
        res.setHeader("Content-Type", "text/html");
        return res.send(html);
      case "/visualizer.css":
        return res.sendFile(path.join(__dirname, "../build/visualizer.css"));
      case "/matcha.css":
        return res.sendFile(path.join(__dirname, "matcha.css"));
      case "/bundle.js":
        return res.sendFile(path.join(__dirname, "../build/bundle.js"));
      case "/voyager.worker.js":
        return res.sendFile(path.join(__dirname, "../build/voyager.worker.js"));
      case "/schema":
        console.log('hit /schema');
        // res.setHeader("Content-Type","application/json");
        return res.send(schema);
      default:
        console.log(req.path);
        res.sendStatus(404);
    }
  }

  return matcha;
}

function getIndexHTMLString() {
  const html = `
  
  <!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
  <title></title>
  <link rel="stylesheet" href="/matcha/visualizer.css">
  <style>
    /* width */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        border-left: 1px solid white;
    }
    

  
    /* Track */
    ::-webkit-scrollbar-track {
        background: #000; 
    }
    ::-webkit-scrollbar-track:focus {
      outline:none;
    }
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #999; 
    }
  
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #d64292; 
    }

    .CodeMirror-scrollbar-filler {
      background:black;
      border-top: 1px solid white;
      border-left: 1px solid white;
    }
    </style>  
<link href="/matcha/matcha.css" rel="stylesheet"></head>
<body>

  <main>
    <div id="root"></div>
  </main>

</body>
<script type="text/javascript" src="/matcha/bundle.js"></script>
</html>
  
  `;
  return html;
}

module.exports = {
  matchaWrap
};
