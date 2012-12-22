/*
 Copyright 2012 Martijn van de Rijdt

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
var gui,printO,DEFAULT_SETTINGS={};$(document).ready(function(){gui=new GUI;gui.init();"undefined"==typeof console&&(console={log:function(){}});"undefined"==typeof window.console.debug&&(console.debug=console.log);"true"!==getGetVariable("debug")&&(window.console.log=function(){},window.console.debug=function(){});"true"==getGetVariable("touch")?(Modernizr.touch=!0,$("html").addClass("touch")):"false"==getGetVariable("touch")&&(Modernizr.touch=!1,$("html").removeClass("touch"));printO=new Print});
function GUI(){}GUI.prototype.init=function(){this.nav.setup();this.pages().init();this.setEventHandlers();"function"===typeof this.setCustomEventHandlers&&this.setCustomEventHandlers();$(".dialog [title]").tooltip({});Modernizr.borderradius&&(Modernizr.boxshadow&&Modernizr.csstransitions&&Modernizr.opacity)&&$(document).trigger("browsersupport","fancy-visuals");$("footer").detach().appendTo("#container");this.display()};GUI.prototype.setup=function(){$(window).trigger("resize")};
GUI.prototype.setEventHandlers=function(){var a=this;$(document).on("click","#feedback-bar .close",function(){a.hideFeedback();return!1});$(document).on("click",".touch #feedback-bar",function(){a.hideFeedback()});$(document).on("click","#page .close",function(){a.pages().close();return!1});$(document).on("click",'a[href^="#"]:not([href="#"]):not(nav ul li a)',function(b){var a=$(this).attr("href");console.log("captured click to nav page, href="+a);"#"!==a&&(b.preventDefault(),$('nav li a[href="'+
a+'"]').click())});$('nav ul li a[href^="#"]').click(function(b){b.preventDefault();b=$(this).attr("href").substr(1);a.pages().open(b);$(this).closest("li").addClass("active")});$(window).on("onlinestatuschange",function(b,c){a.updateStatus.connection(c)});$(document).on("edit","form.jr",function(b,c){a.updateStatus.edit(c)});$(document).on("browsersupport",function(b,c){a.updateStatus.support(c)});$("#page, #feedback-bar").on("change",function(){a.display()})};
GUI.prototype.nav={setup:function(){$("article.page").each(function(){var a,b="",c;c=$(this).attr("id");a=$(this).attr("data-display")?$(this).attr("data-display"):c;b=$(this).attr("data-title")?$(this).attr("data-title"):c;c=$(this).attr("data-ext-link")?$(this).attr("data-ext-link"):"#"+c;$('<li class=""><a href="'+c+'" title="'+b+'" >'+a+"</a></li>").appendTo($("nav ul"))})},reset:function(){$("nav ul li").removeClass("active")}};
GUI.prototype.pages=function(){this.init=function(){this.$pages=$("<pages></pages>");$("article.page").detach().appendTo(this.$pages)};this.get=function(a){var b=this.$pages.find('article[id="'+a+'"]');return b=0<b.length?b:$('article[id="'+a+'"]')};this.isShowing=function(a){return 0<$("#page article.page"+("undefined"!==typeof a?'[id="'+a+'"]':"")).length};this.open=function(a){if(!this.isShowing(a)){a=this.get(a);if(1!==a.length)return console.error("page not found");this.isShowing()&&this.close();
$("#page .content").prepend(a.show()).trigger("change");$(window).bind("resize.pageEvents",function(){$("#page").trigger("change")})}};this.close=function(){var a;a=$("#page .page").detach();this.$pages.append(a);$("#page").trigger("change");this.nav.reset();$("#overlay").hide();$("#overlay, header").unbind(".pageEvents");$(window).unbind(".pageEvents")};return this};
GUI.prototype.showFeedback=function(a,b){var c,b=b?1E3*b:1E4;$("#feedback-bar p").eq(1).remove();$("#feedback-bar p").html()!==a&&(c=$("<p></p>"),c.append(a),$("#feedback-bar").append(c));$("#feedback-bar").trigger("change");setTimeout(function(){typeof c!=="undefined"&&c.remove();$("#feedback-bar").trigger("change")},b)};GUI.prototype.hideFeedback=function(){$("#feedback-bar p").remove();$("#feedback-bar").trigger("change")};
GUI.prototype.alert=function(a,b,c){var d=$("#dialog-alert"),c=c||"error",c="normal"===c?"":"alert alert-block alert-"+c;d.find(".modal-header h3").text(b||"Alert");d.find(".modal-body p").removeClass().addClass(c).html(a).capitalizeStart();d.modal({keyboard:!0,show:!0});d.on("hidden",function(){d.find(".modal-header h3, .modal-body p").html("")})};
GUI.prototype.confirm=function(a,b){var c,d,f,g,e;"string"===typeof a?c=a:"string"===typeof a.msg&&(c=a.msg);c="undefined"!==typeof c?c:"Please confirm action";d="undefined"!==typeof a.heading?a.heading:"Are you sure?";f="undefined"!==typeof a.errorMsg?a.errorMsg:"";g="undefined"!==typeof a.dialog?a.dialog:"confirm";b="undefined"!==typeof b?b:{};b.posButton=b.posButton||"Confirm";b.negButton=b.negButton||"Cancel";b.posAction=b.posAction||function(){return false};b.negAction=b.negAction||function(){return false};
b.beforeAction=b.beforeAction||function(){};e=$("#dialog-"+g);e.find(".modal-header h3").text(d);e.find(".modal-body .msg").html(c).capitalizeStart();e.find(".modal-body .alert-error").html(f);e.modal({keyboard:!0,show:!0});e.on("shown",function(){b.beforeAction.call()});e.find("button.positive").on("click",function(){b.posAction.call();e.modal("hide")}).text(b.posButton);e.find("button.negative").on("click",function(){b.negAction.call();e.modal("hide")}).text(b.negButton);e.on("hide",function(){e.off("shown hidden hide");
e.find("button.positive, button.negative").off("click")});e.on("hidden",function(){e.find(".modal-body .msg, .modal-body .alert-error, button").text("")})};
GUI.prototype.updateStatus={connection:function(a){console.log("updating online status in menu bar to:");console.log(a);!0===a?($("header #status-connection").removeClass().addClass("ui-icon ui-icon-signal-diag").attr("title","It appears there is currently an Internet connection available."),$(".drawer #status").removeClass("offline waiting").text("")):!1===a?($("header #status-connection").removeClass().addClass("ui-icon ui-icon-cancel").attr("title","It appears there is currently no Internet connection"),
$(".drawer #status").removeClass("waiting").addClass("offline").text("Offline. ")):$(".drawer #status").removeClass("offline").addClass("waiting").text("Waiting. ")},edit:function(a){a?$("header #status-editing").removeClass().addClass("ui-icon ui-icon-pencil").attr("title","Form is being edited."):$("header #status-editing").removeClass().attr("title","")},support:function(){},offlineLaunch:function(a){$(".drawer #status-offline-launch").text(a?"Offline Launch: Yes":"Offline Launch: No")}};
GUI.prototype.display=function(){var a,b;b=$("header");var c=$("#feedback-bar"),d=$("#page");0<c.find("p").length?(a="fixed"===b.css("position")?b.outerHeight():0,b=this.pages().isShowing()?b.outerHeight()+c.outerHeight():0-d.outerHeight()):(a="fixed"===b.css("position")?b.outerHeight()-c.outerHeight():0-c.outerHeight(),b=this.pages().isShowing()?b.outerHeight():0-d.outerHeight());c.css("top",a);d.css("top",b)};
GUI.prototype.setSettings=function(a){var b,c=this;console.log("gui updateSettings() started");$.each(a,function(a,f){b=f?c.pages().get("settings").find('input[name="'+a+'"][value="'+f+'"]'):c.pages().get("settings").find('input[name="'+a+'"]');0<b.length&&b.attr("checked",f?!0:!1).trigger("change")})};
GUI.prototype.parseFormlist=function(a,b){var c,d="";if($.isEmptyObject(a))d='<p class="alert alert-error">Error occurred during creation of form list or no forms found</p>';else for(c in a)d+='<li><a class="btn btn-block btn-info" id="'+c+'" title="'+a[c].title+'" href="'+a[c].url+'" data-server="'+a[c].server+'" >'+a[c].name+"</a></li>";b.removeClass("empty").find("ul").empty().append(d)};
function getGetVariable(a){for(var b=window.location.search.substring(1).split("&"),c=0;c<b.length;c++){var d=b[c].split("=");if(d[0]==a)return encodeURI(d[1])}return!1}function Print(){this.setStyleSheet()}Print.prototype.setStyleSheet=function(){this.styleSheet=this.getStyleSheet();this.$styleSheetLink=$('link[media="print"]:eq(0)')};
Print.prototype.getStyleSheet=function(){for(var a=0;a<document.styleSheets.length;a++)if("print"===document.styleSheets[a].media.mediaText)return document.styleSheets[a];return null};Print.prototype.styleToAll=function(){this.styleSheet||this.setStyleSheet();this.styleSheet.media.mediaText="all";this.$styleSheetLink.attr("media","all")};Print.prototype.styleReset=function(){this.styleSheet.media.mediaText="print";this.$styleSheetLink.attr("media","print")};
Print.prototype.printForm=function(){console.debug("preparing form for printing");this.removePageBreaks();this.removePossiblePageBreaks();this.styleToAll();this.addPageBreaks();this.styleReset();window.print()};Print.prototype.removePageBreaks=function(){$(".page-break").remove()};Print.prototype.removePossiblePageBreaks=function(){$(".possible-break").remove()};
Print.prototype.addPossiblePageBreaks=function(){var a=$("<hr>",{"class":"possible-break"});this.removePossiblePageBreaks();$("form.jr").before(a.clone()).after(a.clone()).find("fieldset>legend, label:not(.geo)>input:not(input:radio, input:checkbox), label>select, label>textarea, .trigger>*, h4>*, h3>*").parent().each(function(){var b,c;b=$(this);return(c=b.prev().get(0))&&("H3"===c.nodeName||"H4"===c.nodeName)||$(c).hasClass("repeat-number")||0<b.parents("#jr-calculated-items, #jr-preload-items").length?
null:b.before(a.clone())});$(".possible-break").each(function(){if($(this).prev().hasClass("possible-break"))return $(this).remove()})};
Print.prototype.addPageBreaks=function(){var a,b,c,d,f,g,e,i,h={v:0,get:function(a){if(a||0===h.v)a=document.body.appendChild(document.createElement("DIV")),a.style.width="1in",a.style.padding="0",h.v=a.offsetWidth,a.parentNode.removeChild(a);return h.v}};e=9.5*h.get();d=function(a,b){this.begin=$(a);this.begin_top=this.begin.offset().top;this.end=$(b);this.end_top=this.end.offset().top;this.h=this.end_top-this.begin_top;if(0>this.h)throw console.debug("begin (top: "+this.begin_top+")",a),console.debug("end (top: "+
this.end_top+")",b),Error("A question group has an invalid height.");};d.prototype.break_before=function(){var a,b;b=(a=this.begin.prev().get(0))?["after",a]:["before",this.begin.parent().get(0)];a=b[0];return $(b[1])[a]("<hr class='page-break' />")};this.removePageBreaks();this.addPossiblePageBreaks();c=$(".possible-break");b=[];for(a=1;a<c.length;a++)b.push(new d(c[a-1],c[a]));d=0;c=[];a=[];g=0;for(i=b.length;g<i;g++)f=b[g],d+f.h>e?(a.push(c),c=[f],d=f.h):(c.push(f),d+=f.h);a.push(c);console.debug("pages: ",
a);e=1;for(c=a.length;e<c;e++)b=a[e],0<b.length&&b[0].break_before();return $(".possible-break").remove()};
(function(a){a.fn.toLargestWidth=function(){var b=0;return this.each(function(){a(this).width()>b&&(b=a(this).width())}).each(function(){a(this).width(b)})};a.fn.toSmallestWidth=function(){var b=2E3;return this.each(function(){console.log(a(this).width());a(this).width()<b&&(b=a(this).width())}).each(function(){a(this).width(b)})};a.fn.reverse=[].reverse;a.fn.alphanumeric=function(b){b=a.extend({ichars:"!@#$%^&*()+=[]\\';,/{}|\":<>?~`.- ",nchars:"",allow:""},b);return this.each(function(){b.nocaps&&
(b.nchars+="ABCDEFGHIJKLMNOPQRSTUVWXYZ");b.allcaps&&(b.nchars+="abcdefghijklmnopqrstuvwxyz");for(var c=b.allow.split(""),d=0;d<c.length;d++)-1!=b.ichars.indexOf(c[d])&&(c[d]="\\"+c[d]);b.allow=c.join("|");var f=b.ichars+b.nchars,f=f.replace(RegExp(b.allow,"gi"),"");a(this).keypress(function(a){var b;b=a.charCode?String.fromCharCode(a.charCode):String.fromCharCode(a.which);f.indexOf(b)!=-1&&a.preventDefault();a.ctrlKey&&b=="v"&&a.preventDefault()});a(this).bind("contextmenu",function(){return false})})};
a.fn.numeric=function(b){var c="abcdefghijklmnopqrstuvwxyz",c=c+c.toUpperCase(),b=a.extend({nchars:c},b);return this.each(function(){a(this).alphanumeric(b)})};a.fn.alpha=function(b){b=a.extend({nchars:"1234567890"},b);return this.each(function(){a(this).alphanumeric(b)})};a.fn.capitalizeStart=function(a){a||(a=1);var c=this.contents().filter(function(){return 3==this.nodeType}).first(),d=c.text(),a=d.split(" ",a).join(" ");c.length&&(c[0].nodeValue=d.slice(a.length),c.before('<span class="capitalize">'+
a+"</span>"))}})(jQuery);