const express = require("express");
var http = require('http');
var https = require('https');
const qs = require('querystring');
const crypto = require('crypto');
const fs = require("fs");
const base = require('./base771.json')
const promo = require('./promo771.json')
const {VK} = require('vk-io'); 
const {Keyboard} = require('vk-io');
const vk = new VK(); 
const {updates, api, snippets} = vk; 
const groups = require('./groups771.json')
var cors = require('cors')

var request = require("request");

function getRandomInRange(min, max) { 
return Math.floor(Math.random() * (max - min + 1)) + min; 
}; //Ð¤ÑƒÐ½ÐºÑ†Ð¸Ñ Ð²Ñ‹Ð±Ð¾Ñ€Ð° Ñ€Ð°Ð½Ð´Ð¾Ð¼Ð½Ð¾Ð³Ð¾ Ñ‡Ð¸ÑÐ»Ð°

var privateKey  = fs.readFileSync('pepecoin.tk.key', 'utf8');
var certificate = fs.readFileSync('pepecoin.tk.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

setInterval(function(){ 
        fs.writeFileSync("./base771.json", JSON.stringify(base, null, "\t")) 
}, 10000); // Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð±Ð°Ð·Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…

setInterval(function(){ 
        fs.writeFileSync("./promo771.json", JSON.stringify(promo, null, "\t")) 
}, 1000); // Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð±Ð°Ð·Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…

setInterval(function(){ 
        fs.writeFileSync("./groups771.json", JSON.stringify(groups, null, "\t")) 
}, 1000); // Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð±Ð°Ð·Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…

vk.setOptions({ // Ð£ÑÑ‚Ð°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÐµÐ¼ Ñ‚Ð¾ÐºÐµÐ½ Ð¸ Ð¸Ð´ Ð³Ñ€ÑƒÐ¿Ð¿Ñ‹
token: "0fa4bd2a18e1d9755f6b126763041bce9fb5677e51bd1a7f2f89f6a71e6427480d5a15493855c34a8bbc8",
apiMode: "parallel",
pollingGroupId: 198030496 
});

const app = express(credentials);

var httpsServer = https.createServer(credentials, app);

app.use(cors())

const validateAppUrl = (url, secret_key) => {
//console.log(url)
    // достаем параметры из url
    const query_params = url.slice(url.indexOf("?") + 1).split("&").reduce((a, x) => {
        const data = x.split("=");
        a[data[0]] = data[1];
        return a;
    }, {});
    // выбираем нужные (с приставкой "vk_") и сортируем их
    const sign_params = {};
    Object.keys(query_params).sort()
        .forEach((key) => {
            if(!key.startsWith("vk_")) return;
            sign_params[key] = query_params[key];
        });
    // образуем строку вида param1=value1&param2=value2...
    const sign_str = Object.keys(sign_params).reduce((a, x) => {
        a.push(x + "=" + sign_params[x]);
        return a;
    }, []).join("&");
    // подписываем
    let sign = require("crypto").createHmac("sha256", secret_key).update(sign_str);
    sign = sign.digest("binary");
    sign = require("buffer").Buffer.from(sign, "binary").toString("base64");
    sign = sign.split("+").join("-");
    sign = sign.split("/").join("_");
    sign = sign.replace(/=+$/, '');
    // сравниваем подпись с оригинальной. если все окей, то возвращаем id пользователя, если нет - null

    //console.log(sign)
    let status = sign === query_params["sign"]; 
    //console.log(status);
    let statu = {
status: status,
sign: sign,
vk: query_params['sign']
    };

    return statu;//sign === query_params["sign"] ? query_params["vk_user_id"] : null;
};

function getUrlVars(url) {
var hash;
var myJson = {};
var hashes = url.slice(url.indexOf('?') + 1).split('&');
for (var i = 0; i < hashes.length; i++) {
hash = hashes[i].split('=');
myJson[hash[0]] = hash[1];
// If you want to get in native datatypes
// myJson[hash[0]] = JSON.parse(hash[1]);
}
return myJson;
}


app.get("/app/createUser/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Барт, иди нахуй, заебал уже, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
    console.log(req.headers.referer)

if (query.name && query.uid && query.photo) {
            let reg = 0
          if (!base[query.uid]) {
            reg = 1
            base[query.uid] = {
              balance: 0,
              mine: 0,
              progress: 0,
              rubli: 0,
              click: 0.00001, 

              click1: 0.001,
              click2: 0.0050,
              click3: 0.050,
              click4: 3,
              click5: 4,

              mine1: 0.0001,
              mine2: 0.0005,
              mine3: 0.0010,
              mine4: 0.0020,
              mine5: 0.0100,
              mine6: 0.0250,
              mine7: 3.3500,
              mine8: 7.5,

              gold: 0,
              limit: 10000,
              second: 0,
              verify: false,
              reason: '',
              ban: false,
              ref: null,
              transfers: [],
              photo: query.photo,
              name: query.name,
              online: false
            }
          }
            base[query.uid].ip = req.ip
            
          res.json({ response: [{id: query.uid, reason: base[query.uid].reason, mine1: base[query.uid].mine1, mine2: base[query.uid].mine2, mine3: base[query.uid].mine3, mine4: base[query.uid].mine4, mine5: base[query.uid].mine5, mine6: base[query.uid].mine6, mine7: base[query.uid].mine7, mine8: base[query.uid].mine8, mine9: base[query.uid].mine9, mine10: base[query.uid].mine10, click1: base[query.uid].click1, click2: base[query.uid].click2, click3: base[query.uid].click3, click4: base[query.uid].click4, click5: base[query.uid].click5, gold: base[query.uid].gold, second: base[query.uid].second, rubli: base[query.uid].rubli, reg: 0, balance: base[query.uid].balance, ban: base[query.uid].ban, transfers: base[query.uid].transfers, mine: base[query.uid].mine, click: base[query.uid].click}]});
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
        
    
});

app.get("/app/mine/", async (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
  
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   if (req.headers.referer === '') return
  
    if(query.uid && query.name) {
              if (base[query.uid].ban) {
  res.json({ response: [{"status": "ÍÀÕÓÉ ÈÄÈ"}]});

return
}
          base[query.uid].balance += base[query.uid].mine
base[query.uid].ip = req.ip
let params = getUrlVars(req.headers.referer)
let group = params.vk_group_id
console.log(group)
          res.json({ response: [{id: query.uid, balance: base[query.uid].balance, transfers: base[query.uid].transfers, click: base[query.uid].click, mine: base[query.uid].mine}]});
          if (params.vk_group_id) {
            if (!groups[group]) {
              let x = await vk.api.call("groups.getById", {
            group_id: group,
            fields: "members_count"
          })
              console.log(x)
        groups[group] = {
                name: x[0].name,
                photo: x[0].photo_100,
                members: x[0].members_count,
                balance: 0
              }
            }
            let a = await vk.api.call("groups.getById", {
            group_id: group,
            fields: "members_count"
          })
            groups[group].name = a[0].name
            groups[group].photo = a[0].photo_100
            groups[group].members = a[0].members_count

            groups[group].balance += base[query.uid].mine
          }
console.log(query.cordy)
  base[query.uid].ip = req.ip
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    
   }
    
});

app.get("/app/online/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
  
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   
    if(query.uid && query.name) {
   if (req.headers.referer === 'https://mydomen.ga/') return
                       if (base[query.uid].ban) {
  res.json({ response: [{"status": "ÍÀÕÓÉ ÈÄÈ"}]});

return
}
/* for (e in base) {
    if (base[e].ip == req.ip) {
        if (e != query.uid) {
            
        base[e].ban = true
        base[e].reason = '[Нарушение правил] Вы были забанены за мульти-аккаунт'
        base[query.uid].ban = true
        base[query.uid].reason = '[Нарушение правил] Вы были забанены за мульти-аккаунт'
        vk.api.messages.send({user_id: 322861790, message: `» *id${e} и *id${query.uid} были забанены за мульти-аккаунт. IP: ${req.ip}`})
        return
        }
    } 
} */
          base[query.uid].online = true
          // base[query.uid].cordy = query.cordy
         // base[query.uid].coorx = query.cordx
  base[query.uid].ip = req.ip
  let online = 0
  for (r in base) {
      if (base[r].online) online += 1
  }
          res.json({ response: [{ online: online }]});
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    } 
    
});

app.get("/app/click/", async  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  const axios = require('axios');
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
  
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;

    if(query.uid && query.name) {
                          if (base[query.uid].ban) {
  res.json({ response: [{"status": "ÍÀÕÓÉ ÈÄÈ"}]});

return
}

let params = getUrlVars(req.headers.referer)
let group = params.vk_group_id
console.log(group)
/* for (e in base) {
    if (base[e].ip == req.ip) {
        if (e != query.uid) {
            
        base[e].ban = true
        base[e].reason = '[Нарушение правил] Вы были забанены за мульти-аккаунт'
        base[query.uid].ban = true
        base[query.uid].reason = '[Нарушение правил] Вы были забанены за мульти-аккаунт'
        vk.api.messages.send({user_id: 322861790, message: `» *id${e} и *id${query.uid} были забанены за мульти-аккаунт. IP: ${req.ip}`})
        return
        }
    } 
} */
          base[query.uid].balance += base[query.uid].click
          
          res.json({ response: [{id: query.uid, balance: base[query.uid].balance, transfers: base[query.uid].transfers, click: base[query.uid].click, mine: base[query.uid].mine}]});
          base[query.uid].group = group
          base[query.uid].second += 1
          if (params.vk_group_id) {
            if (!groups[group]) {
              let x = await vk.api.call("groups.getById", {
            group_id: group,
            fields: "members_count"
          })
              console.log(x)
        groups[group] = {
                name: x[0].name,
                photo: x[0].photo_100,
                members: x[0].members_count,
                balance: 0
              }
            }
            let a = await vk.api.call("groups.getById", {
            group_id: group,
            fields: "members_count"
          })
            groups[group].name = a[0].name
            groups[group].photo = a[0].photo_100
            groups[group].members = a[0].members_count

            groups[group].balance += base[query.uid].click
          }
console.log(query.cordy)
  base[query.uid].ip = req.ip
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    } 
    
    
});

app.get("/app/getTop/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  const pos = 1
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()

  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let a = 0
    let query = req.body;
   
    let top = []
    let topme = [] // ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¼Ð°ÑÐ¸Ð²Ð°
    let users = []

    for (let i in base){// Ð¿ÐµÑ€ÐµÐ±Ð¾Ñ€ Ð±Ð°Ð·Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…
          top.push({
            id: i,
            verify: base[i].verify,
            name: base[i].name,
            photo: base[i].photo,
            balance: base[i].balance
        })
          }
     top.sort(function(a, b) { 
         
if (b.balance > a.balance) return 1 
if (b.balance < a.balance) return -1 
return 0


}); //Ð¡Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²ÐºÐ°

let text = ""
res.json({"users": top, "me": 1})

});

app.get("/app/getSpeedTop/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  const pos = 1
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()

  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let a = 0
    let query = req.body;
   
    let top = []
    let topme = [] // ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¼Ð°ÑÐ¸Ð²Ð°
    let users = []

    for (let i in base){// Ð¿ÐµÑ€ÐµÐ±Ð¾Ñ€ Ð±Ð°Ð·Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…
          top.push({
            id: i,
            verify: base[i].verify,
            name: base[i].name,
            photo: base[i].photo,
            balance: base[i].click
        })
          }
     top.sort(function(a, b) { 
         
if (b.balance > a.balance) return 1 
if (b.balance < a.balance) return -1 
return 0


}); //Ð¡Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²ÐºÐ°

let text = ""
res.json({"users": top, "me": 1})

});

app.get("/app/getGroupsTop/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  const pos = 1
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()

  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let a = 0
    let query = req.body;
   
    let top = []
    let topme = [] // ÑÐ¾Ð·Ð´Ð°Ð½Ð¸Ðµ Ð¼Ð°ÑÐ¸Ð²Ð°
    let users = []

    for (let i in groups){// Ð¿ÐµÑ€ÐµÐ±Ð¾Ñ€ Ð±Ð°Ð·Ñ‹ Ð´Ð°Ð½Ð½Ñ‹Ñ…
          top.push({
            id: i,
      members: groups[i].members,
            name: groups[i].name,
            photo: groups[i].photo,
            balance: groups[i].balance
        })
          }
     top.sort(function(a, b) { 
         
if (b.balance > a.balance) return 1 
if (b.balance < a.balance) return -1 
return 0


}); //Ð¡Ð¾Ñ€Ñ‚Ð¸Ñ€Ð¾Ð²ÐºÐ°

let text = ""
res.json({"groups": top, "me": 1})

});


app.get("/app/userTranfer/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
     if(!Number(query.to) || !Number(query.sum) || query.sum == null || query.sum == NaN) {
      res.json({ response: [{status: 'error', error_code: 9, error_description: `а не пойти бы тебе нах... в баню!?`}] });
        return
    }
    if(query.uid && query.name && query.from && query.to && query.sum) {
      if (query.from === query.to) {
        res.json({ response: [{status: 'error', error_code: 3, error_description: 'Вы не можете перевести сами себе!'}] });
        return
      }
      else if (!base[query.to]) {
        res.json({ response: [{status: 'error', error_code: 4, error_description: `Игрок с ID: ${query.to} не зарегестрирован с сервисе.`}] });
        return
      } else if (query.sum > base[query.uid].balance) {
        res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств'}] });
        return
      } else if (query.sum < 0.0000000100) {
        res.json({ response: [{status: 'error', error_code: 5, error_description: 'Сумма не может быть меньше 0.0000000100 BC'}] });
        return
      } else {
        let key = getRandomInRange(100000, 999999)

        base[query.uid].balance -= Number(query.sum)
        base[query.to].balance += Number(query.sum)

        base[query.to].transfers.push({
          operation: 'in',
          sum: query.sum,
          from_id: query.uid,
          key: key
        })

        base[query.uid].transfers.push({
          operation: 'to',
          sum: query.sum,
          to_id: query.to,
          key: key
        })
      res.json({ response: [{status: 'ok'}] });
    }
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/getHistory/",  (req, res) => { // Ð¿ÐµÑ€ÐµÐ²Ð¾Ð´
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
     let his = []

    for (i in base[query.uid].transfers) {
      if (base[query.uid].transfers[i].operation == 'in') {
        his.unshift({
          operation: 'in',
          sum: base[query.uid].transfers[i].sum,
          from_id: base[query.uid].transfers[i].from_id,
          key: base[query.uid].transfers[i].key,
          from_name: base[base[query.uid].transfers[i].from_id].name,
          from_photo: base[base[query.uid].transfers[i].from_id].photo
        })
      }

      if (base[query.uid].transfers[i].operation == 'to') {
        his.unshift({
          operation: 'to',
          sum: base[query.uid].transfers[i].sum,
          to_id: base[query.uid].transfers[i].to_id,
          key: base[query.uid].transfers[i].key,
          to_name: base[base[query.uid].transfers[i].to_id].name,
          to_photo: base[base[query.uid].transfers[i].to_id].photo
        })
      }
  }

      res.json({ response: [{status: 'ok', history: his}] });
    
});

app.get("/app/click1/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   
    if(query.uid && query.name) {
        if (base[query.uid].balance < base[query.uid].click1) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].click += 0.0001
        base[query.uid].balance -= base[query.uid].click1

        base[query.uid].click1 *= 1.5
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/click2/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
  
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
    if(query.uid && query.name) {
        if (base[query.uid].balance < base[query.uid].click2) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].click += 0.0003
        base[query.uid].balance -= base[query.uid].click2

        base[query.uid].click2 *= 1.5
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/click3/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
  
    if(query.uid && query.name) {
        if (base[query.uid].balance < base[query.uid].click3) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].click += 0.0005
        base[query.uid].balance -= base[query.uid].click3

        base[query.uid].click3 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
        
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
});

app.get("/app/click4/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
    
    if(query.uid && query.name) {
        if (base[query.uid].gold < base[query.uid].click4) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].click += 0.0010
        base[query.uid].gold -= base[query.uid].click4

        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
         
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/click5/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   
    if(query.uid && query.name) {
        if (base[query.uid].gold < base[query.uid].click5) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].click += 0.0015
        base[query.uid].gold -= base[query.uid].click5


        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
         
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    
    }
});

app.get("/app/mine1/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   
    if(query.uid && query.name) {
       
        if (base[query.uid].balance < base[query.uid].mine1) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.0001
        base[query.uid].balance -= base[query.uid].mine1

        base[query.uid].mine1 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
          
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    
    }
});

app.get("/app/mine2/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()

  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;

    if(query.uid && query.name) {
       
        if (base[query.uid].balance < base[query.uid].mine2) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.0003
        base[query.uid].balance -= base[query.uid].mine2

        base[query.uid].mine2 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
        
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    
    }
});

app.get("/app/mine3/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
    
    if(query.uid && query.name) {
        
        if (base[query.uid].balance < base[query.uid].mine3) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.0005
        base[query.uid].balance -= base[query.uid].mine3

        base[query.uid].mine3 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
          
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    
    }
});

app.get("/app/mine4/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()

  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   
    if(query.uid && query.name) {
        
        if (base[query.uid].balance < base[query.uid].mine4) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.0010
        base[query.uid].balance -= base[query.uid].mine4

        base[query.uid].mine4 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/mine5/",  (req, res) => { 
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   
    if(query.uid && query.name) {

        if (base[query.uid].balance < base[query.uid].mine5) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.0050
        base[query.uid].balance -= base[query.uid].mine5

        base[query.uid].mine5 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
        
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/mine6/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()

  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
    
    if(query.uid && query.name) {
        
        if (base[query.uid].balance < base[query.uid].mine6) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.0100
        base[query.uid].balance -= base[query.uid].mine6

        base[query.uid].mine6 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/mine7/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;

    if(query.uid && query.name) {
      
        if (base[query.uid].balance < base[query.uid].mine7) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.1000
        base[query.uid].balance -= base[query.uid].mine7

        base[query.uid].mine7 *= 2
        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
         
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/mine8/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()

  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
   
    if(query.uid && query.name) {
        
        if (base[query.uid].gold < base[query.uid].mine8) {
           res.json({ response: [{status: 'error', error_code: 5, error_description: 'У вас недостаточно средств для покупки данного ускорения!'}] });
        return
        }
        base[query.uid].mine += 0.1500
        base[query.uid].gold -= base[query.uid].mine8


        res.json({ response: [{status: 'ok', description: 'Вы купили ускорение!'}] });
    
         
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

app.get("/app/promo/",  (req, res) => {
  let prov = validateAppUrl(req.headers.referer, "l5E4LFxlmBVdP4osMJdF"); 
if(!prov) return res.status(500).json({error: `Какой блять пидарас будет так отправть запрос?`});
let params = getUrlVars(req.headers.referer)
let user = params.vk_user_id;
let query_ = req.query;
if(user != query_.uid) {
  console.log("НЕВЕРНЫЙ АЙДИ! "+user + " " + query_.uid + " " + query_.name + " " + req.ip);
  return res.status(500).json({error: `Иди нахуй, сразу говорю, что защита стоит!`});
}
  let now = new Date();
  let hour = now.getHours()
  let minutes = now.getMinutes()
 
  if (hour < 10) {
      hour = `0${hour}`
    }
    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    let timeString = hour + ":" + minutes;
    let hash = req.params.hash;
    let query = req.query;
  
    if(query.uid && query.name && query.promo) {
       
        let activate = 0 
        let promocode = false
        let id = null
        console.log(promo)
        for (i in promo) {
          if (promo[i].code == query.promo) { 
            promocode = true
            id = i
            if (promo[i].activate.includes(query.uid)) {
              activate = 1
            }
          }
          console.log(promo[i].code)
        }

        if (!promocode) {
           res.json({ response: [{status: 'error', error_code: 3, error_description: 'Данного промокода не существует!'}] });
        return
        }

        if (activate == 1) {
           res.json({ response: [{status: 'error', error_code: 3, error_description: 'Вы уже активировали этот промокод!'}] });
        return
        }
                        promo[i].activate.push(query.uid)
                        base[query.uid].balance += promo[id].sum
                
            
           res.json({ response: [{status: 'ok', description: 'Промокод активирован!'}] });

        
    } else {
      res.json({ response: [{status: 'error', error_code: 2, error_description: 'One of parameter is missing!'}] });
      
    }
    
});

setInterval(() => {
  for (k in base) {
    if (base[k].second > 50) {
      base[k].ban = true
      base[k].reason = '[Нарушение правил] Вы были забанены за автокликер.'
    }
    base[k].second = 0
  }
}, 1000)

httpsServer.listen(9090);

updates.hear(/Поиск/i,async (context) => {
if(context.senderId != 298845865 && context.senderId != 296455210  && context.senderId != 506864565) return
if(!context.forwards[0] && !context.hasReplyMessage) return context.send(`ты не переслал ниче`)
if(context.forwards[0]) {
    let ASS1 = context.forwards[0].senderId
    if(!base[ASS1]) context.send("нет такого")
      return context.send({ 
message: `
    
 🔥айди: ${ASS1}
 💰баланс: ${parseFloat(base[ASS1].balance).toFixed(5)}
 ✏за клик: ${parseFloat(base[ASS1].click).toFixed(5)}
 💽в секунду: ${parseFloat(base[ASS1].mine).toFixed(5)}
 😜бан: ${base[ASS1].ban ? 'Да' : 'Нет'}
😜Верификация: ${base[ASS1].verify? 'Да' : 'Нет'}`,
keyboard: Keyboard.keyboard([
      [
            Keyboard.textButton({ 
            label: 'Бан', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'ban'
            }
            }),
            Keyboard.textButton({ 
            label: 'Разбан', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'unban'
            }
            })
      ],
      [
            Keyboard.textButton({ 
            label: 'Обнуление', 
            color: Keyboard.SECONDARY_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'null'
            }
            }),
        
      ], 
      [
            Keyboard.textButton({ 
            label: 'Дать галочку', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'ban'
            }
            }),
            Keyboard.textButton({ 
            label: 'Забрать галочку', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'unban'
            }
            })
      ]
     ])
     .inline(true)
  }) 
    
} 
if(context.hasReplyMessage) {
    let ASS1 = context.replyMessage.senderId
    if(!base[ASS1]) context.send("ты не переслал ниче")
     return context.send({ 
message: `
    
🔥айди: ${ASS1}
💰баланс: ${parseFloat(base[ASS1].balance).toFixed(5)}
✏за клик: ${parseFloat(base[ASS1].click).toFixed(5)} 
💽в секунду: ${parseFloat(base[ASS1].mine).toFixed(5)}
😜бан: ${base[ASS1].ban ? 'Да' : 'Нет'}
😜Верификация: ${base[ASS1].verify? 'Да' : 'Нет'}`,
keyboard: Keyboard.keyboard([
      [
            Keyboard.textButton({ 
            label: 'Бан', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'ban'
            }
            }),
            Keyboard.textButton({ 
            label: 'Разбан', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'unban'
            }
            })
      ],
      [
            Keyboard.textButton({ 
            label: 'Обнуление', 
            color: Keyboard.SECONDARY_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'null'
            }
            }),
        
      ], 
[
            Keyboard.textButton({ 
            label: 'Дать галочку', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'ban'
            }
            }),
            Keyboard.textButton({ 
            label: 'Забрать галочку', 
            color: Keyboard.POSITIVE_COLOR,
            payload: {
              "user_id": ASS1,
              "action": 'unban'
            }
            })
      ]
     ])
     .inline(true)
  }) 
}
});
updates.hear(/Разбан/i, async (context) => {
  if (context.senderId != 298845865 && context.senderId != 296455210 && context.senderId != 506864565) return
  if (!context.messagePayload.user_id) return context.send(`payload не найден.`)
    base[context.messagePayload.user_id].ban = false
  return context.send(`Успешно!`)
})
updates.hear(/Бан/i, async (context) => {
  if (context.senderId != 298845865 && context.senderId != 296455210 && context.senderId != 506864565) return
  if (!context.messagePayload.user_id) return context.send(`payload не найден.`)
    base[context.messagePayload.user_id].ban = true
  return context.send(`Успешно!`)
})
updates.hear(/Обнуление/i, async (context) => {
  if (context.senderId != 298845865 && context.senderId != 296455210 && context.senderId != 506864565) return
  if (!context.messagePayload.user_id) return context.send(`payload не найден.`)
   base[context.messagePayload.user_id].balance = 0
   base[context.messagePayload.user_id].mine =  0.00001
   base[context.messagePayload.user_id].click = 0.00001
   return context.send(`Успешно!`)
})
updates.hear(/Профиль/i, async (context) => {
  if (!base[context.senderId]) return context.send(`Вы не зарегестрированы.Регистрация в https://vk.com/app7571475`)
  if (base[context.senderId].ban) return context.send(`Ты забанен. По поводу разбана писать в лс группы`)

  return context.send(`❤профиль:

 🔥Ваш айди: ${context.senderId}
 💰баланс: ${parseFloat(base[context.senderId].balance).toFixed(5)}
 ✏за клик: ${parseFloat(base[context.senderId].click).toFixed(5)}
 💽в секунду: ${parseFloat(base[context.senderId].mine).toFixed(5)} 
😜Верификация: ${base[context.senderId].verify? 'Да' : 'Нет'}
`)
})
updates.hear(/!/i, async (context) => { 
if (context.senderId != 298845865 && context.senderId != 296455210) return
let text = `${context.text}` 
text = text.replace(`! `, ``) 
try { 

let result = await eval(text) 
return context.send(`☑ Результат: ${result}`) 

} catch (err) { 


return context.send(`Ошибка: ${err}`) 
} 
})
updates.hear(/саяпин|дура/i, async (context) => { 
  //context.send(1);
  vk.api.messages.delete({
    message_ids: context.id,
    delete_for_all: 1
  })
})
async function run() {
    await vk.updates.startPolling();
    console.log("запустилось");
 }
run().catch(console.error);