

<!DOCTYPE html>

<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>searchX</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Noto+Sans|Ubuntu" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
  <link rel="stylesheet" href="css/style.css">
  <script src="cookies.js"></script>
  <script src="req.js"></script>
  <script src="login.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="md5.min.js"></script>
</head>

<body>
<div class="log-wrapper">
  <div class="header-overlay">
    <a href="index.html"><h1><xr>se</xr><xb>ar</xb><xy>ch</xy><xg>X</xg></h1></a>
  </div>
  
  <div class="log-wrap">
    <input class="noto log-name log-box log-fname" id="log-flabel" type="text"/>
    <label class="noto log-name log-label log-flabel">First name</label>
    <input class="noto log-name log-box log-lname" id="log-llabel" type="text"/>
    <label class="noto log-name log-label log-llabel">Last name</label>
    <input class="noto log-box log-uname" id="log-ulabel" type="text"/>
    <label class="noto log-label log-ulabel">Username</label>
    <input class="noto log-box log-passw" id="log-plabel" type="password"/>
    <label class="noto log-label log-plabel">Password</label>
    <div class="log-sub">
      <button class="log-reg-button log-button" onclick="register()"><span>Register searchX Account</span></button>
      <button class="log-log-button log-button" onclick="login()"><span>Login to searchX</span></button>
      <br><br>
      <xr class="log-status">Placeholder text</xr>
    </div>
    
  </div>
</div>
</body>
</html>
