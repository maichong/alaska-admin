<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Alaska admin dashboard</title>
  <meta name="renderer" content="webkit">
  <style>
    html, body {
      display: block;
      padding: 0;
      margin: 0;;
    }

    .boot-loading {
      margin: 100px auto 0;
      text-align: center;
      color: #00bcd4;
      font-size: 16px;
    }
  </style>
  <link href="static/fonts/material-icons.css" rel="stylesheet">
</head>
<body>
<div id="app">
  <div class="boot-loading">Loading...</div>
</div>

{% if env=='production' %}
  <script type="application/javascript" src="js/app.min.js"></script>
{% else %}
  <script type="application/javascript" src="js/app.js"></script>
{% endif %}
</body>
</html>
