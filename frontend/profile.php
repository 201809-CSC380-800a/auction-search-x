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
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="profile.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="xml2json.js"></script>
</head>

<body>
<div class="profile-wrapper">
  <div class="header-overlay">
    <a href="index.html"><h1><xr>se</xr><xb>ar</xb><xy>ch</xy><xg>X</xg></h1></a>
  </div>
  <div class="profile-master-holder">
    <div class="profile-inside-header">
      <img src="https://ir.ebaystatic.com/pictures/aw/social/avatar.png"><y><x id='fullname'></x></y><z><x id='ebayusername'></x> ・ <x id='searchxusername'></x></z>
      <div class="profile-inside-header-quick-links">
        Quick links<br>
        <a href="index.html">Log out of searchX</a><br>
        <a href="index.html" id="ebayProfLink">Visit profile on eBay</a><br>
        <a href="#" onclick="clearIgnoreList()">Clear ignore list</a><br>
        <a href="#" onclick="deleteAccountLikeForReal()">Delete searchX account</a>
      </div>
    </div>
    <div class="profile-spacer"></div>
    <div class="profile-tabs">
      <button class="profile-watch-button profile-button profile-active-button" onclick="changeToWatchList()"><span>Watch list</span></button>
      <button class="profile-ignore-button profile-button" onclick="changeToIgnoreList()"><span>Ignore list</span></button>
    </div>
    <div class="auc-flex-main">
      <div class=" tofadeout noto auc-auctionview" id="0">
        <div class="noto auc-img" id="im">
          <img id="pk" src="https://secureir.ebaystatic.com/pictures/aw/pics/stockimage1.jpg">
        </div>
        <div class="noto auc-title-holder" id="th">
          <div class="noto auc-title" id="t">Loading Watch List...</div>
          <div class="noto auc-title2" id="t2"></div>
        </div>
        <div class="noto auc-sell-holder" id="sh">
          <div class="noto auc-seller" id="s"></div>
          <div class="noto auc-sell-type" id="st"></div>
        </div>
        <div class="noto auc-price-holder" id="ph">
          <div class="noto auc-price" id="p"></div>
          <div class="noto auc-shipping" id="d"></div>
        </div>
        <div class="noto auc-button-holder" id="b">
          <button class="noto auc-button-watch auc-button" title="Add to watch list" id="bw"><span>➕</span></button>
          <button class="noto auc-button-ignore auc-button" title="Add to ignore list" id="bi"><span>🚫</span></button>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>
