
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');
const app = express();
const https = require('https');
var encoding = require("encoding");

app.set('port', (process.env.PORT || 5000)) 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


var app_script = process.env.script;
var Token = process.env.TOKEN;
var access_token = 'Bearer {'+Token+'}'

var headers = {
    'Authorization' : access_token
}


var name = "";
var pictureUrl = "";


app.get('/', (req, res) => {
  res.end("ok")
})


app.post('/webhook', (req, res) => {
  
var data = req.body; 
console.log('ปริ้นทั้งหมด' + JSON.stringify(data));

var UID = req.body.originalDetectIntentRequest.payload.data.source.userId; 
var userMsg = req.body.originalDetectIntentRequest.payload.data.message.text;
var intent = req.body.queryResult.intent.displayName;

var PPDay = JSON.stringify(req.body.queryResult.parameters.day);
var PPNum = JSON.stringify(req.body.queryResult.parameters.numberroom);
var queryText = req.body.queryResult.queryText;
//console.log("userID -------------- : " + UID)
console.log(JSON.stringify(userMsg));

console.log("intent--------- : " + intent)

var options = {
    url: 'https://api.line.me/v2/bot/profile/'+UID,
    method: 'GET',
    headers: headers,

}


 request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        name = info.displayName;
        pictureUrl = info.pictureUrl;
//console.log(body)        
var printdd =  "{ id: "+UID+", name: "+name+" }" 
//console.log(printdd)        


if(intent == "ho - custom"){
  
  // ไปเช็คห้องว่าว่างไหม
  var check = app_script+"?ffn=chackday&dayDay="+PPDay;
  request(check, function (error, response, body) {
    if (!error && response.statusCode == 200) {

        
   console.log("values : " + body);



  
return res.json({
    "fulfillmentMessages": [
  {
    "platform": "line",
    "type": 4,
    "payload" : {
    "line":  {
  "type": "template",
  "altText": "วันที่เข้าพัก",
  "template": {
    "type": "confirm",
    "actions": [
      {
        "type": "message",
        "label": "เลือกห้อง",
        "text": "เลือกห้อง"
      },
      {
        "type": "message",
        "label": "เปลี่ยนวันที่",
        "text": "เปลี่ยนวันที่"
      }
    ],
    "text": "วันที่ "+ queryText +"\nมีห้องพักว่าง "+body+ " ห้อง"
  }
}
        
        
        
    }
    }
      ]
  })



}
})












}else if(intent == "booking" || intent == "room - no"){ ///// เลือกห้อง
  
  // ไปเช็คห้องว่าว่างไหม
  var check = app_script+"?ffn=getday&day="+PPDay;
  request(check, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        var room1 = info.room1
        var room2 = info.room2
        var room3 = info.room3
        var room4 = info.room4
        var room5 = info.room5
        var RN1; 
        var RN2; 
        var RN3; 
        var RN4; 
        var RN5;
        var RC1; 
        var RC2; 
        var RC3; 
        var RC4;
        var RC5;

        
   console.log("values : "+room1 +'\n'
                          +room2 +'\n'
                          +room3 +'\n'
                          +room4 +'\n'
                          +room5);

if(room1 == "จอง"||room1 == "รอ"){RN1 = "ห้องไม่ว่าง"; RC1 = "#FF0000";}else{RN1 = "จองเลย"; RC1 = "#DFDFDF";}
if(room2 == "จอง"||room2 == "รอ"){RN2 = "ห้องไม่ว่าง"; RC2 = "#FF0000";}else{RN2 = "จองเลย"; RC2 = "#DFDFDF";}
if(room3 == "จอง"||room3 == "รอ"){RN3 = "ห้องไม่ว่าง"; RC3 = "#FF0000";}else{RN3 = "จองเลย"; RC3 = "#DFDFDF";}
if(room4 == "จอง"||room4 == "รอ"){RN4 = "ห้องไม่ว่าง"; RC4 = "#FF0000";}else{RN4 = "จองเลย"; RC4 = "#DFDFDF";}
if(room5 == "จอง"||room5 == "รอ"){RN5 = "ห้องไม่ว่าง"; RC5 = "#FF0000";}else{RN5 = "จองเลย"; RC5 = "#DFDFDF";}



return res.json({
    "fulfillmentMessages": [
  {
    "platform": "line",
    "type": 4,
    "payload" : {
    "line":  {
  "type": "flex",
  "altText": "เลือกห้องพัก",
  "contents": {
    "type": "carousel",
    "contents": [
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://www.regalhotel.com/uploads/rrh/accommodations/720x475/DeluxeSuite_FINAL_large.jpg",
          "size": "full",
          "aspectRatio": "1.91:1",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "label": "Line",
            "uri": "https://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Standard Room",
              "size": "lg",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "baseline",
              "margin": "md",
              "contents": [
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "text",
                  "text": "5.0",
                  "flex": 0,
                  "margin": "md",
                  "size": "sm",
                  "color": "#999999"
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "margin": "lg",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Wi-Fi",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "Free",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "อาหาร",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "ฟรี! อาหารเช้า x 2",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "เตียง",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "1 เตียงใหญ่",
                      "flex": 2,
                      "size": "sm"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ราคาห้อง/คืน",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "2200",
                      "flex": 2,
                      "size": "sm",
                      "weight": "bold",
                      "color": "#666666"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "flex": 0,
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": RN1,
                "text": "Standard Room"
              },
              "color": RC1,
              "height": "sm",
              "style": "secondary"
            }
          ]
        }
      },
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://upload.wikimedia.org/wikipedia/commons/5/56/Hotel-room-renaissance-columbus-ohio.jpg",
          "size": "full",
          "aspectRatio": "1.91:1",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "label": "Line",
            "uri": "https://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Superior Room",
              "size": "lg",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "baseline",
              "margin": "md",
              "contents": [
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "text",
                  "text": "3.0",
                  "flex": 0,
                  "margin": "md",
                  "size": "sm",
                  "color": "#999999"
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "margin": "lg",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Wi-Fi",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "Free",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "อาหาร",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "ฟรี อาหารเช้า x1",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "เตียง",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "เตียงคู่",
                      "flex": 2
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ราคาห้อง/คืน",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "1200",
                      "flex": 2,
                      "weight": "bold",
                      "color": "#666666"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "flex": 0,
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": RN2,
                "text": "Superior Room"
              },
              "color": RC2,
              "height": "sm",
              "style": "secondary"
            }
          ]
        }
      },
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://r-ak.bstatic.com/images/hotel/max1024x768/894/89442192.jpg",
          "size": "full",
          "aspectRatio": "1.91:1",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "label": "Line",
            "uri": "https://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Deluxe Room",
              "size": "lg",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "baseline",
              "margin": "md",
              "contents": [
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "text",
                  "text": "4.0",
                  "flex": 0,
                  "margin": "md",
                  "size": "sm",
                  "color": "#999999"
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "margin": "lg",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Wi-Fi",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "Free",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "อาหาร",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "ฟรี! อาหารเช้า x 2",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "เตียง",
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "1 เตียงใหญ่",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ราคาห้อง/คืน",
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "1500",
                      "flex": 2,
                      "size": "sm",
                      "weight": "bold",
                      "color": "#666666"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "flex": 0,
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": RN3,
                "text": "Deluxe Room"
              },
              "color": RC3,
              "height": "sm",
              "style": "secondary"
            }
          ]
        }
      },
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://q-ak.bstatic.com/images/hotel/max1024x768/178/178849977.jpg",
          "size": "full",
          "aspectRatio": "1.91:1",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "label": "Line",
            "uri": "https://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Suite Room",
              "size": "lg",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "baseline",
              "margin": "md",
              "contents": [
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "text",
                  "text": "4.0",
                  "flex": 0,
                  "margin": "md",
                  "size": "sm",
                  "color": "#999999"
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "margin": "lg",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Wi-Fi",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "Free",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "อาหาร",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "ฟรี! อาหารเช้า x 2",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "เตียง",
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "1 เตียงใหญ่",
                      "flex": 2,
                      "color": "#666666"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ราคาห้อง/คืน",
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "1100",
                      "flex": 2,
                      "weight": "bold",
                      "color": "#666666"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "flex": 0,
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": RN4,
                "text": "Suite Room"
              },
              "color": RC4,
              "height": "sm",
              "style": "secondary"
            }
          ]
        }
      },
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://q-xx.bstatic.com/images/hotel/max1024x768/177/17718895.jpg",
          "size": "full",
          "aspectRatio": "1.91:1",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "label": "Line",
            "uri": "https://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Family Room",
              "size": "lg",
              "weight": "bold"
            },
            {
              "type": "box",
              "layout": "baseline",
              "margin": "md",
              "contents": [
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "icon",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                  "size": "sm"
                },
                {
                  "type": "text",
                  "text": "5.0",
                  "flex": 0,
                  "margin": "md",
                  "size": "sm",
                  "color": "#999999"
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "margin": "lg",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Wi-Fi",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "Free",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "อาหาร",
                      "flex": 1,
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "ฟรี! อาหารเช้า x 2",
                      "flex": 2,
                      "size": "sm",
                      "color": "#666666",
                      "wrap": true
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "เตียง",
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "2 เตียงใหญ่",
                      "flex": 2,
                      "color": "#666666"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ราคาห้อง/คืน",
                      "size": "sm",
                      "color": "#AAAAAA"
                    },
                    {
                      "type": "text",
                      "text": "1300",
                      "flex": 2,
                      "weight": "bold",
                      "color": "#666666"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "flex": 0,
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": RN5,
                "text": "Family Room"
              },
              "color": RC5,
              "height": "sm",
              "style": "secondary"
            }
          ]
        }
      }
    ]
  }
}




}
}
]
})


/////////////////////////////
}
})


}else if(intent == "room"){
  
var bookroom = app_script+"?ffn=book&bookroom="+queryText+"&bookingday="+PPDay;
  request(bookroom, function (error, response, body) {
    if (!error && response.statusCode == 200) {

if(body == "ok200" ){

return res.json({
    "fulfillmentMessages": [
  {
    "platform": "line",
    "type": 4,
    "payload" : {
    "line":  {
  "type": "template",
  "altText": "ห้องที่ต้องการจอง",
  "template": {
    "type": "confirm",
    "actions": [
      {
        "type": "message",
        "label": "ใช่",
        "text": "ใช่"
      },
      {
        "type": "message",
        "label": "ไม่ใช่",
        "text": "ไม่ใช่"
      }
    ],
    //"text": "เทส"
        "text": "ต้องการจองห้อง\n" + queryText +"\nเข้าพักในวันที่ "+ PPDay + " มิ.ย. 62"
  }
}



}
}
]
})

}

}
})














}else if(intent == "room - yes"){   // คอนเฟริม payment blank(blankDay

request(app_script+"?ffn=blank&blankDay="+PPDay);


var bookroom = app_script+"?ffn=confirm&dayconfirm="+PPDay;
  request(bookroom, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        
        var name = info.name;
        var priceH = JSON.stringify(info.price);

console.log("body "+body);
console.log("name "+name);
console.log("price "+priceH);

return res.json({
    "fulfillmentMessages": [
  {
    "platform": "line",
    "type": 4,
    "payload" : {
    "line":  {
  "type": "flex",
  "altText": "Payment",
  "contents": {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://images.trvl-media.com/hotels/21000000/20580000/20573700/20573686/7c29f05a_z.jpg",
      "size": "full",
      "aspectRatio": "3:1",
      "aspectMode": "cover",
      "action": {
        "type": "uri",
        "label": "Action",
        "uri": "https://linecorp.com/"
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "spacing": "md",
      "contents": [
        {
          "type": "text",
          "text": "Payment",
          "size": "xl",
          "align": "center",
          "gravity": "center",
          "weight": "bold",
          "wrap": true
        },
        {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "margin": "lg",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "ห้องที่เลือกพัก",
                  "flex": 3,
                  "size": "sm",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": name,
                  "flex": 4,
                  "size": "sm",
                  "color": "#666666",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "วันที่เข้าพัก",
                  "flex": 3,
                  "size": "sm",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": PPDay + " มิ.ย. 62",
                  "flex": 4,
                  "size": "sm",
                  "color": "#666666",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "ราคาทั้งหมด",
                  "flex": 3,
                  "size": "sm",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": priceH,
                  "flex": 4,
                  "size": "sm",
                  "color": "#666666",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "xxl",
              "contents": [
                {
                  "type": "image",
                  "url": "https://api-qr-promtpay.herokuapp.com/0904129099/"+priceH,
                  "size": "xl",
                  "aspectMode": "cover",
                  "action": {
                    "type": "uri",
                    "label": "QR",
                    "uri": "https://api-qr-promtpay.herokuapp.com/0904129099/"+priceH
                  }
                },
                {
                  "type": "text",
                  "text": "หลังจากชำระเงินแล้ว โปรดตรวจสอบสถานะการจองที่เมนู หรือติดต่อเจ้าหน้าที่ 090-4129099",
                  "margin": "xxl",
                  "size": "xs",
                  "color": "#AAAAAA",
                  "wrap": true
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
        
    }
    }
      ]
  }) /////return res.json ส่งไลน์
  
    }
  })
  

}











}
})



})
