const express = require("express");
const app = express();
const DeviceDetector = require("node-device-detector");
const useragent = require("express-useragent");


app.get("/.well-known/assetlinks.json", function (req, res) {
  res.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.maplechap.android",
        sha256_cert_fingerprints: [
          "C9:DC:7A:6B:00:28:7F:76:B1:3F:7B:A5:65:5E:B7:D7:C7:C1:09:A8:FB:B4:0E:FF:31:FA:17:6B:C6:1C:4A:E1",
        ],
      },
    },
  ]);
});

app.get("/.well-known/apple-app-site-association", function (req, res) {
  res.json({
    applinks: {
      apps: [], // This is usually left empty, but still must be included
      details: [
        {
          appIDs: ["com.maplechap.iosapp"],
          components: [
            {
              "/": "/*",
              comment: "Matches any URL whose path starts with /",
            },
          ],
          appID: "com.maplechap.iosapp",
          paths: ["/*"],
        },
      ],
    },
  });
});

const getDeviceInfo = (req) => {
    var source = req.headers["user-agent"];
    const detector = new DeviceDetector();
  
    const device = detector.detect(source);
    return device;
}

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))

app.get("/app*", async (req, res) => {
    const result =  getDeviceInfo(req);
    const isAndroid = result.os && result.os.family === 'Android';
    const isIOS = result.os && result.os.family === 'iOS';
    if(isAndroid){
        return res.redirect("https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.maplechap.android")
    }
    if(isIOS){
        return res.redirect("https://apps.apple.com/us/app/id1526900005")
    }
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

app.get("/app/*", async (req, res) => {
    const result =  getDeviceInfo(req);
    const isAndroid = result.os && result.os.family === 'Android';
    const isIOS = result.os && result.os.family === 'iOS';
    if(isAndroid){
        return res.redirect("https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.maplechap.android")
    }
    if(isIOS){
        return res.redirect("https://apps.apple.com/us/app/id1526900005")
    }
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});


app.get("*", async (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});


app.listen(3000);
