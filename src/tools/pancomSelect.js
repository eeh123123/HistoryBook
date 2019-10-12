(function($,undefined){
				var baseHtml = '<div><div class="dctbgone">'+
				'</div>'+
				'<div id="dctChooser" class="dctchooserContentone" dct="kh" style="position:absolute;left:450px; top:0px;width:389px;height:500px;box-shadow:0 0 20px black;" >'+
				'<div class="css1" style="width:100%;height:40px;border-radius:6px 6px 0px 0px;border-top:1px solid rgba(0, 0, 0, 0.1);">'+
				'<div class="titleContent">'+
				'<span id="icon" class="sicon">&nbsp;</span>'+
				'<span id="title" class="stitle">字典选择--客户应用字典</span>'+
				'</div>'+
				'<div id="freshbtn" class="freshContent">'+
				'<a href="javascript:void(0);" class="freshbtn">'+
				'<span class="freshbtn1">'+
				'<span class="freshbtn2"></span>'+
				'</span>'+
				'</a>'+
				'</div>'+
				'<div id="closebtn" class="closeContent">'+
				'<a href="javascript:void(0);" class="closebtn">'+
				'<span class="closebtn1">'+
				'<span class="closebtn2"></span>'+
				'</span>'+
				'</a>'+
				'</div>'+
				'</div>'+
				'<div style="width:100%;position: absolute;left:0px;right:0px;bottom:0px;top:40px;background-color: #F1F1F1;" >'+
				'<div class="dctContent">'+
				'<div class="comselect-overlay c" style="" ></div>'+
				'<div class="comselect-loading c loadtext" style="">正在加载日历...</div>'+
				'<iframe id="url" frameborder="0" class="dctBrowser"  src="" ></iframe>'+
				'<div class="dravover"></div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				
				'</div>';
				$.fn.panComSelect = function(options,param){
					if(typeof options ==="string"){
						return this.each(function(){
							return this[options]();
						});
					}
					var wdom = this;
					if(this.length<=0){
						var ddd = $("<div />");
						var rrr = this.selector.replace("#","");
						ddd.attr("id",rrr);
						$(document.body).append(ddd);
						wdom = ddd;
					}
					return wdom.each(function(){
						var defaults = {
								"callback":null, 			//相通环境变量的传递方法
								"width":"300",				//窗口的宽度
								"height":"300",				//窗口的高度
								"title":"弹出框",			//窗口的标题
								"lockbg":true,//是否锁定背景
								"loadtext":"正在加载中...",	//遮罩的文本提示
								"dragtext":"*释放鼠标进行查看*",	//拖动的文本提示
								"url":"",					//需要打开的url
								"onlyfirst":false, 			//是否只使用一次，用完就销毁
								"parenturl":null,			//父容器的url
								"dydata":null,//动态数据，这里的每次都可以不同
								"customdata":null,			//自定义需要带的数据，指定function，返回值就是自定义数据
								"iconclass":"default",		//标题的class样式，只填写16*16的背景图片就好
								"hotstart":false 			//是否热启动。true时，会预先加载
									
						};
						var dom = this;
						var opts = $.extend(defaults,options);
						var beforeClose;
						dom.hotstart = opts.hotstart;
						dom.selectcallback = opts.callback;
						if($.isFunction(this["isComSelect"])){
							if(this["isComSelect"]()==true){
								var dydata = typeof options==="object"?options.dydata:null;
								this.inputParam(dydata);
								this.show();
								this.moveCenter(opts);
								return ;
							}
						}
						var pageurl = 0;
						this.create = function(){
							pageurl = opts.url;
							opts.url = opts.url.indexOf("?")>0?(opts.url+"&pagezindex="+(this.getIndex()+100)):(opts.url+"?pagezindex="+(this.getIndex()+100));
							opts.url = opts.url.indexOf("opencontent=iframe") >0 ? opts.url : opts.url + "&opencontent=iframe";//检查打开的弹出框有没有opencontent=iframe，没有的话强制加上
							var dom = this;
							var dctDom = $(baseHtml);
							dctDom.find(".dctbgone").css("z-index",this.getIndex()+"");
							dctDom.find("#dctChooser").css("z-index",this.getIndex()+10+"");
							
//							var callback = opts.callback;
							var iframecontent = dctDom.find("#url");
							function windowclose(){
								setTimeout(function(){
									dom.close();
								},0);
							}
							function callback(){
								if($.isFunction(dom.selectcallback)){
									return dom.selectcallback.apply(dom,arguments);
								}else{
									return null;
								}
							}
							iframecontent.bind("load",function(e){
								dom.loadcomplete(e);
								if($.isFunction(callback)){
									// 设置回调参数
									if ( $.browser.msie&&+$.browser.version<8 ){//低于ie8的浏览器处理
										// ie
										document.frames[iframecontent[0].id].window["callback"] = callback;
									}else{
										// 设置全局变量，方便其他js可以调用
										iframecontent[0].contentWindow["callback"] = callback;  
									}
								}
								if($.isFunction(opts.customdata)){
									// 设置回调参数
									if ( $.browser.msie&&+$.browser.version<8 ){//低于ie8的浏览器处理
										// ie
										document.frames[iframecontent[0].id].window["getComSelectData"] = opts.customdata;
									}else{
										// 设置全局变量，方便其他js可以调用
										iframecontent[0].contentWindow["getComSelectData"] = opts.customdata;  
									}
								}
								// 设置回调参数
								if ( $.browser.msie&&+$.browser.version<8 ){//低于ie8的浏览器处理
									// ie
									document.frames[iframecontent[0].id].window["panClose"] = windowclose;
								}else{
									// 设置全局变量，方便其他js可以调用
									iframecontent[0].contentWindow["panClose"] = windowclose;
								}
								// 设置关闭的判断处理
								if ( $.browser.msie&&+$.browser.version<8 ){//低于ie8的浏览器处理
									// ie
									beforeClose = document.frames[iframecontent[0].id].window["beforeClose"];
								}else{
									// 设置全局变量，方便其他js可以调用
									beforeClose = iframecontent[0].contentWindow["beforeClose"];
								}
								
								
								
								
								
								dom.inputParam(opts.dydata);
							});
							dctDom.find(".loadtext").html(opts.loadtext);
							dctDom.find("#dctChooser").css({"width":opts.width,"height":opts.height});
							dctDom.find("#title").html(opts.title);
							dctDom.find("#icon").addClass("sicon-"+opts.iconclass);
							if(opts.hotstart == true){
								dctDom.find(".dctbgone").hide();
							}
							if(opts.lockbg == false){//锁定背景
								dctDom.find(".dctbgone").width(0).height(0);
							}
							$(this).append(dctDom);
							this.showLoading();
							this.load();
							//this.show();
						};
						this.inputParam = function(dydata){
							var initCallBack = null;
							if ( $.browser.msie&&+$.browser.version<8 ){//低于ie8的浏览器处理
								// ie
								initCallBack = $("#url",this)[0].window.initSelect;
							}else{
								// 设置全局变量，方便其他js可以调用
								initCallBack = $("#url",this)[0].contentWindow.initSelect;
							}
							if($.isFunction(initCallBack)){
								initCallBack.call(this,dydata);
							}
						};
						this.load = function(){
							$(this).find("#url").attr("src",opts.url);
						};
						this.loadcomplete = function(){
							this.hideLoading();
							if(this.hotstart == true){
								this.hide();
								this.moveCenter();
								$(this).find(".dctbgone").show();
								console.info("panComSelect预加载完成");
								this.hotstart == false;
							}
						};
						this.hideLoading = function(){
							$(this).find(".c").hide();
						};
						this.showLoading = function(text){
							$(this).find(".loadtext").html(text||opts.loadtext);
							var t = $(this).find(".comselect-loading");
							var c = $(this).find(".comselect-overlay");
							var left = (c.innerWidth()-t.outerWidth())/2;
							var top = (c.innerHeight()-t.outerHeight())/2;
							t.css({
								left:left,
								top:top
							});
							$(this).find(".c").show();
						};
						var resizeThread ;
						this.resizeDctContent = function(time){
							var dom = this;
							if($(dom).is(":hidden")){
								return;
							}
							if(resizeThread){
								clearTimeout(resizeThread);
							}
							resizeThread = setTimeout(function(){
								//设置位置
								dom.moveCenter();
								resizeThread = undefined;
								
							},time);
						};
						this.moveCenter = function(p){
							var dctContent = $(this).find("#dctChooser");
							
							var nOpts = p||opts;
							
							if(this.hotstart == true){
								dctContent.css({
									"position":"absolute",
									"left":"-1000px",
									"top":"-1000px"
								});
								return;
							}
							
							var showHeight = $(window).height();
							var showWidth = $(window).width();
							var dctContentHeight = dctContent.height();
							var dctContentWidth = dctContent.width();
							
							dctContent.css({
								"position":"absolute",
								"left":$.int((showWidth-dctContentWidth)/2)+"px",
								"top":$.int((showHeight-dctContentHeight)/2)+"px"
							});
						};
						this.isVisible = function(){
							return $(this).is(":visible");
						};
						this.keyListener = function(){
							var dom = this;
							$(window).keypress(function(e){
								if(dom.isVisible()){
									var code = e.keyCode;
									if(code==27){
										dom.close();
									}
								}
							});
						};
						this.resizeListener = function(){
							var dom = this;
							$(window).resize(function(){
								if(dom.isVisible()){
									dom.resizeDctContent(300);
								}
							});
						};
						this.isComSelect = function(){
							return true;
						};
						this.getIndex = function(){
//							var pagezindex = $.query.keys["pagezindex"];
							var url = opts.parenturl?opts.parenturl:pageurl;
							var pagezindex = url.getQueryString("pagezindex");
							
							if(pagezindex){
								pagezindex = parseInt(pagezindex);
							}else{
								pagezindex=100;
							}
							return pagezindex;
						};
						this.hide = function(){
							$(this).hide();
						};
						this.show = function(){
							$(this).show();
						};
						this.close = function(){
							if(opts.onlyfirst){
								this.remove ();
							}else{
								this.hide();
							}
						};
						this.remove = function(){
							$(this).unbind().remove();
						};
						this.hideDravOver = function(){
							$(this).find(".dravover").hide();
						};
						this.showDravOver = function(){
							$(this).find(".dravover").show();
						};
						this.btnListener = function(){
							var dom = this;
							$(this).find("#freshbtn").click(function(){
								dom.showLoading();
								$(dom).find("#url").attr("src",opts.url);
								
							});
							$(this).find("#closebtn").click(function(){
								if($.isFunction(beforeClose)){
									if(false !== beforeClose.call()){
										dom.close();
									}
								}else{
									dom.close();
								}
							});
						};
						this.draggableListener = function(){
							var dom = this;
							var htmlContent = $(this).find("#url");
							$(this).find("#dctChooser").draggable({
								cursor:"move", 
								containment: "window",
//								containment: "document.body",
								start:function(){
									dom.showDravOver();
									htmlContent.hide();
									dom.showLoading(opts.dragtext);
								},
								stop:function(){
									dom.hideDravOver();
									htmlContent.show();
									dom.hideLoading();
								}
							});
						};
						this.create();
						this.resizeListener();
						this.keyListener();
						this.draggableListener();
						this.moveCenter();
						this.btnListener();
						if(opts.hotstart == false){
							this.show();
						}
						
					});
					};
				
			})(jQuery,undefined);