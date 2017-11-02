import fetch from 'node-fetch';
import config from '../config/env/index'

const responseHandling = (response, callback) => {
  //Checking if statuscode is in 200-299 interval
  if (response.ok) {
      //Checking if response content is json
      var contentType = response.headers.get("content-type");

      if (contentType && contentType.indexOf("application/json") !== -1) {
          response.json().then(function(result) {
              return callback(null, result)
          })
          .catch(e=>callback(e, null))
      } else {
          //The case that its not json
          return callback(null, "ok")
      }
  } else {
      //The case that Network response was not ok
      response.json().then(function(result) {
          return callback(result, null)
      }).catch((e)=>  {
        callback(e, null)})
  }
}

export const sendNotification = (data) => {
  fetch(`${config.cueup_api_domain}/api/user/MessageNotification`, {
    method: 'POST', 
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify(data)
  })
  .then(response => {
    responseHandling(response, (err, res)=>{
      if(err){
        console.log(err)
      }else{
        console.log("Notification was send")
      }
    })
  })
  .catch(error => {
    console.log(error);
  });
}
