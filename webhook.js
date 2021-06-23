//-----------------------------------------------
//This code is totally experimentally
//Not suitable for production
//No audits applied/passed
//No support from author
//-----------------------------------------------



//--globals-------------------------------------------------------
var error = null;
var time = require('time');
var a = new time.Date();

a.setTimezone('Europe/Berlin');
//console.log(a.toString()); // Fri May 18 2012 09:00:00 GMT+0200 (CEST)        

var AsyncLock = require('async-lock');
var lock = new AsyncLock();

//console.log("starting to parse.. "+ (new Date()).toISOString().replace(/[^0-9]/g, ""));
console.log("starting to parse.. "+ time.Date().toString());

var MongoClient = require('mongodb').MongoClient, assert = require('assert');   
var url2 = 'mongodb://<your_ip_and_db_connection_string_here>';
var mongodb = null;                                                               
var collection = null;           
var onlyonce = false;

MongoClient.connect(url2, { useNewUrlParser: true }, function (err, database) {
    if (err) throw err;
    mongodb = database.db('<your_collection_here>');
    collection = mongodb.collection('<your_table_here>');
});
                           
var msgParameters = null;




var express = require('express'); 
var app = express(); 
app.use(express.json());
app.post('<your_webhook_incomming_1>', function(request, response){
   writeDBalt3(request.body);
});
app.post('<your_webhook_incomming_1>', function(request, response){
   writeDBalt3sec(request.body);
}); 

app.listen(80);

function writeDBalt3(msg) {

    if(msg != null && mongodb != null && collection != null)
    {                                                
          //console.log("msgParameters: " + msgParameters);
          const msgConst = msg;
          //console.log(msgConst);
          //msgParameters = null;
          if (typeof msgConst != "undefined" && msgConst != null && msgConst.length != null && msgConst.length > 0) 
          {              
            //console.log(time.Date().toString() + " - " + msgConst);                                 
            
            //var bla = Number('1234.123456789');
            //console.log(bla);
            //bla = Number(msgConst.buy);
            //console.log(bla);
                                           
            var date_entry = new Date();
/*
[{"timenow": "{{timenow}}"},
{"indicator": "alt.lowfinder.eth"}, 
{"ordAction": "{{strategy.order.action}}"},
{"ordContracts": "{{strategy.order.contracts}}"},
{"ordPrice": "{{strategy.order.price}}"},
{"posSize": "{{strategy.position_size}}"},
{"markPos": "{{strategy.position_size}}"},
{"markPosSize": "{{strategy.position_size}}"},
{"prMarkPos": "{{strategy.position_size}}"},
{"prMarkPosSize": "{{strategy.position_size}}"},
{"p0": "{{plot_0}}"},
{"p1": "{{plot_1}}"},
{"p2": "{{plot_2}}"},
{"p3": "null"},
{"p4": "{{plot_4}}"},  
{"p5": "{{plot_3}}"},
{"close": "{{close}}"}]
*/                  
              var json = {
                  "alerttime":msgConst[0].timenow,      
                  "indicator":msgConst[1].indicator,                  
                  "ordAction":msgConst[2].ordAction,   
                  "p0":msgConst[10].p0,    
                  "p1":msgConst[11].p1,    
                  "p2":msgConst[12].p2,    
                  "p3":msgConst[13].p3,    
                  "p4":msgConst[14].p4,    
                  "p5":msgConst[15].p5,    
                  "close":msgConst[16].close,                    
                  "status":0,
                  "internal_task":0,
                  "dbentrytime":date_entry                   
              }  

            //console.log(json);
            //console.log(JSON.stringify(json));    

            lock.acquire(json, function(){
                      collection.insertOne(json, function (error, result)
                      {
                        if(error) throw err;
                        //console.log(result);
                      });
                  }).then(function(){
                        //console.log("insertOne - " + date_lastaction_time.toString());
                  });
                    
            }             
          }
}




function writeDBalt3sec(msg) {

    if(msg != null && mongodb != null && collection != null)
    {                                                
          //console.log("msgParameters: " + msgParameters);
          const msgConst = msg;
          //console.log(msgConst);
          //msgParameters = null;
          if (typeof msgConst != "undefined" && msgConst != null && msgConst.length != null && msgConst.length > 0) 
          {              
            //console.log(time.Date().toString() + " - " + msgConst);                                 
            
            //var bla = Number('1234.123456789');
            //console.log(bla);
            //bla = Number(msgConst.buy);
            //console.log(bla);
                                           
            var date_entry = new Date();
/*
[{"timenow": "{{timenow}}"},
{"indicator": "eth.risk.sec.eth"}, 
{"ordAction": "{{strategy.order.action}}"},
{"p0": "{{plot_2}}"},
{"p1": "{{plot_3}}"},
{"p2": "{{plot_4}}"},
{"p3": "{{plot_9}}"},
{"p4": "{{plot_11}}"},   
{"p5": "{{plot_12}}"},
{"close": "{{close}}"}]
*/                  
              var json = {
                  "alerttime":msgConst[0].timenow,      
                  "indicator":msgConst[1].indicator,                  
                  "ordAction":msgConst[2].ordAction,   
                  "p0":msgConst[3].p0,    
                  "p1":msgConst[4].p1,    
                  "p2":msgConst[5].p2,    
                  "p3":msgConst[6].p3,    
                  "p4":msgConst[7].p4,    
                  "p5":msgConst[8].p5,    
                  "close":msgConst[9].close,                    
                  "status":0,
                  "internal_task":0,
                  "dbentrytime":date_entry                   
              }   

            //console.log(json);
            //console.log(JSON.stringify(json));    

            lock.acquire(json, function(){
                      collection.insertOne(json, function (error, result)
                      {
                        if(error) throw err;
                        //console.log(result);
                      });
                  }).then(function(){
                        //console.log("insertOne - " + date_lastaction_time.toString());
                  });
                    
            }             
          }
}

//==============================================================================
//==============================================================================
//==============================================================================
//==============================================================================
//==============================================================================

//delete all at the beginning of the app
//delete all, which are older then 30 mins
var timerX = 1000;//1 sec
(function funcDel() {     
    if(mongodb != null && 
      collection != null
      )
    { 
          var json = { "dbentrytime" : {"$lt" : new Date(Date.now() - 1 * 10 * 60 * 1000) } }    // 10 mins
          onlyonce = true;      
          if(onlyonce == false)
          {
              onlyonce = true;
              json = { "dbentrytime" : {"$lt" : new Date(Date.now()) } }
              timerX = 1800000;//1800 sec
          }         
             
          //collection for binance                
          lock.acquire(json, function(){
                    collection.deleteMany(json, function (error, result)
                    {
                      if(error) throw err;
                      //console.log(result);
                    });
                }).then(function(){
                      //console.log("insertOne - " + date_lastaction_time.toString());
                }); 
                                         
    }   
    // Function iteration
    setTimeout(function ()
    {
        funcDel();
    }, timerX);
})();

//==============================================================================
//==============================================================================
//==============================================================================

