/**
 * Copyright 2015 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(){
	var readyFn = function(){};
	var createLight = function(id, data){
		return _.extend(data, {
			id : id,
			apiUrl : 'http://' + hue.ipAddress + '/api/' + hue.name + '/lights/' + id,
			setState : function(state, callback){
				var self = this;
				$.ajax({
					url : this.apiUrl + '/state',
					type : 'PUT',
					data : JSON.stringify(state),
					success : function(res){
						if(res.length && res[0].error) throw res[0].error.description;
						self.state = _.extend(self.state, state);
						callback && callback();
					}
				});
			},

			hue : function(hue, callback){
				if(this.state.on) this.setState({"hue" : Math.floor(hue)}, callback);
			},

			on : function(callback){
				this.setState({on : true}, callback);
			},
			off : function(callback){
				this.setState({on : false}, callback);
			},
			toggle : function(callback){
				this.setState({on : !this.state.on}, callback);
			}
		});
	}


	hue = {
		discover : function(name){
			$.get('https://www.meethue.com/api/nupnp', function(res){
				if(res.length === 0) throw "No Bridges found";
				hue.ipAddress = res[0].internalipaddress;

				//check if user is auth'd
				$.get('http://' + hue.ipAddress + '/api/' + name, function(res){
					//Not authorized
					if(res.length && res[0].error){
						hue.auth(name);
					}else{
						hue.name = name;
						hue.start();
					}
				});
			})
		},
		auth : function(name){
			if(confirm('Press the link button on the Hue Bridge now')){
				$.ajax({
					url : 'http://' + hue.ipAddress + '/api',
					type : 'POST',
					dataType : 'json',
					data :  JSON.stringify({"devicetype":"test user","username": name}),
					success : function(res){
						if(res.length && res[0].error) throw res[0].error.description;
						hue.name = name;
						hue.start();
					}
				})
			}
		},
		start : function(){
			$.get('http://' + hue.ipAddress + '/api/' + hue.name + '/lights', function(res){
				if(res.length && res[0].error) throw res[0].error.description;
				hue.lights = _.map(res, function(lightData, id){
					return createLight(id, lightData);
				})
				readyFn();
			})
		},

		ready : function(fn){
			readyFn = fn;
		}
	}

}());