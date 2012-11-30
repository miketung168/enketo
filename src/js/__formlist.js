/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modilabs 
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

/*jslint browser:true, devel:true, jquery:true, smarttabs:true*//*global gui, Form, StorageLocal, Connection, Modernizr, getGetVariable, vkbeautify*/
var /** @type {Connection} */connection;
var /** @type {StorageLocal} */store;
var /** @type {Settings}*/settings;

$(document).ready(function(){
	"use strict";
	var url;

	connection = new Connection();
	store = new StorageLocal();

	$('[title]').tooltip();

	gui.setup();

	$('.url-helper a')
		.click(function(){
			var helper, placeholder, value;
			$(this).parent().addClass('active').siblings().removeClass('active');
			helper = $(this).attr('data-value');
			placeholder = (helper === 'formhub' || helper === 'formhub_uni') ? 'enter formhub account' : 'e.g. formhub.org/johndoe';
			value = (helper === 'formhub_uni') ? 'formhub_u' : (helper === 'formhub') ? '' : null;
			
			$('input#server').attr('placeholder', placeholder);
			
			if (value !== null){
				$('input#server').val(value).trigger('change');
			}
		})
		.andSelf().find('[data-value="formhub"]').click();

	$('input').change(function(){
		if ($(this).val().length > 0){
			$('.go').click();
		}
		return false;
	});

	$('.go').click(function(){
		if ($('progress').css('display') === 'none'){
			url = createURL();
			if (url){
				$('progress').show();
				connection.getFormList(url, processFormlistResponse);
			}
		}
	});

	$('#form-list').on('click', 'a', function(){
		console.log('caught click');
		var server, id,
			href = $(this).attr('href');
			
		//request a url first by launching this in enketo
		if ( !href || href === "" || href==="#" ){
			console.log('going to request enketo url');
			server = $(this).attr('data-server');
			id = $(this).attr('id');
			connection.getSurveyURL(server, id, processSurveyURLResponse);
		}
		else{
			location.href=href;
		}
		return false;
	});

	loadPreviousState();
});

function loadPreviousState(){
	var i,
		server = store.getRecord('__current_server');
	if (server){
		$('.url-helper li').removeClass('active').find('[data-value="'+server.helper+'"]').parent('li').addClass('active');
		$('input#server').val(server.inputValue);
		list = store.getRecord('__server_'+server.url);
		parseFormlist(list);
	}
}

function createURL(){
	var frag = $('input#server').val(),
		type = $('.url-helper li.active > a').attr('data-value'),
		protocol = (/^http(|s):\/\//.test(frag)) ? '' : (type === 'http' || type === 'https') ? type+'://' : null,
		serverURL = (protocol !== null) ? protocol+frag : 'https://formhub.org/'+frag;

	if (!frag){
		console.log('nothing to do');
		return null;
	}
	if (!connection.isValidUrl(serverURL)){
		console.error('not a valid url: '+serverURL);
		return null;
	}
	console.log('server_url: '+serverURL);
	return serverURL;
}

function processFormlistResponse(resp, msg){
	var server, helper, inputValue;
	console.log('processing formlist response');
	if (resp && resp.length > 0){
		server = resp[0].server; //same for each element of array
		//TODO the following two variables may have have changed before the response arrives. Do differently.
		helper = $('.url-helper li.active > a').attr('data-value');
		inputValue = $('input#server').val();
		store.setRecord('__server_' + server, resp, null, true);
		store.setRecord('__current_server', {'url': server, 'helper': helper, 'inputValue': inputValue}, null, true);
	}
	parseFormlist(resp);
}

function parseFormlist(list){
	var listHTML='';
	if(list){
		for (i=0; i<list.length; i++){
			listHTML += '<li><a class="btn btn-block btn-info" id="'+list[i].id+'" title="'+list[i].title+'" '+
				'href="'+list[i].url+'" data-server="'+list[i].server+'" >'+list[i].name+'</a></li>';
		}
	}
	else{
		listHTML = '<p class="alert alert-error">Error occurred during creation of form list</p>';
	}
	$('#form-list').removeClass('empty').find('ul').empty().append(listHTML);
	$('progress').hide();
	$('#form-list').show();
}

function processSurveyURLResponse(resp){
	var url = resp.url || null,
		server = resp.serverURL || null,
		id = resp.formId || null;
	console.debug(resp);
	console.debug('processing link to:  '+url);
	if (url && server && id){
		record = store.getRecord('__server_'+server) || {};
		record[id] = url;
		store.setRecord('__server_'+server, record, false, true);
		$('a[id="'+id+'"][data-server="'+server+'"]').attr('href', url).click();
	}
}