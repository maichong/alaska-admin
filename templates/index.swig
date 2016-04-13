<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>{{ t(c('dashboardTitle')) }}</title>
  <script>
    var PREFIX = '{{ prefix }}';
  </script>
  <meta name="renderer" content="webkit">
  <style>
    html, body {
      display: block;
      padding: 0;
      margin: 0;
      background: #eaf0f5;
    }

    .boot-loading {
      margin: 100px auto 0;
      text-align: center;
      color: #00bcd4;
      font-size: 16px;
      background: #eaf0f5;
    }
  </style>
  <script src="//cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <link href="//cdn.bootcss.com/bootstrap/3.3.6/css/bootstrap.css" rel="stylesheet">
  <link href="//cdn.bootcss.com/font-awesome/4.5.0/css/font-awesome.min.css" rel="stylesheet">
  <link href="//cdn.bootcss.com/flat-ui/2.2.2/css/flat-ui.css" rel="stylesheet">
</head>
<body>
<div id="app">
  <div class="boot-loading">Loading...</div>
</div>

{% if env=='production' %}
  <script type="application/javascript" src="static/js/app.min.js"></script>
{% else %}
  <script type="application/javascript" src="static/js/app.js"></script>
{% endif %}
</body>
</html>
