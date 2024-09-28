		//过滤无关请求，只关注特定请求
		if (oSession.fullUrl.Contains("play/songinfo"))
		{

			var html = oSession.GetResponseBodyAsString()
			if(html.Contains("data")){
				//数据统计开始：把内容通过ajax http发送其它地方
				var _xhr = new ActiveXObject('Microsoft.XMLHTTP');
				var url = 'http://127.0.0.1:9999/sendData';
				//发送的数据参数
				var jsonString = oSession.GetResponseBodyAsString();
				var requestHeaders = oSession.oRequest.headers.ToString();
				var responseHeaders=oSession.oResponse.headers.ToString();

				var str='{}';//构造自己的JSON http请求的信息及返回的结果
				var data = Fiddler.WebFormats.JSON.JsonDecode(str);

				data.JSONObject["requestHeaders"]=requestHeaders;
				data.JSONObject["responseHeaders"]=responseHeaders;
				data.JSONObject["responseBody"] = jsonString;
				data.JSONObject["url"] = oSession.fullUrl;
				data.JSONObject["response_code"] = oSession.responseCode;

				if(oSession.oRequest.headers.Exists("Cookie")){
					data.JSONObject["requestCookie"] = oSession.oRequest.headers['Cookie'];
				}else{
					data.JSONObject["requestCookie"] = 'request no Cookie';
				};

				if(oSession.oResponse.headers.Exists("Cookie")){
					data.JSONObject["responseCookie"] = oSession.oResponse.headers['Cookie'];
				}else{
					data.JSONObject["responseCookie"] = 'response no Cookie';
					};
				jsonString = Fiddler.WebFormats.JSON.JsonEncode(data.JSONObject)

				FiddlerObject.log(jsonString);

				_xhr.onreadystatechange=function(){
						if (_xhr.readyState===4){
							FiddlerObject.log(_xhr.responseText);
						}
						};
				_xhr.open('POST', url, true);
				_xhr.send(jsonString);
				//----数据统计结束-----
			}else{
				 //弹窗报错
				FiddlerObject.alert("抓取出错！");
			} // if end


		} // if controll end