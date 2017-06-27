"use strict"
var NULL=null, BUILD_ID=20160331
try{
	jQuery.noConflict()
	}
catch(e){}

function activarLeanMode(){
	return //si hay botones físicos se rompe todo
	if (isPhone() && device.platform=='Android' && device.version>'4.4.4'){
		AndroidFullScreen.showUnderSystemUI(
			function(e){
				jQuery('body').addClass('leanMode')
				setTimeout(function(){app.vistaActiva.resize()}, 1300)
				}, 
			function(e){
				console.warn(e)
				})
		}
	}
/////	
var device, Connection
var app, espacioDuro='\xA0', espacioDuro2='\xA0\xA0', vbCrLf='\n'
var _isPhone=null
function isPhone(){
	if (_isPhone==null){
		if (document.URL.indexOf("http://") === 0 || document.URL.indexOf("https://") === 0) 
			_isPhone=false
		else
			_isPhone=true
		}
	return _isPhone
	}
function creaObjProp(tipo, dicPropiedades){
	var subtipo
	if (tipo.indexOf(':')>-1){
		var temp=tipo.split(':')
		tipo=temp[0];subtipo=temp[1]
		}
	var obj=document.createElement(tipo)
	if (subtipo) obj.type=subtipo

	modObjProp(obj, dicPropiedades)
	return obj
	}
function getLigature(valor){ //algunos android 4.3
	var dic={
		star_border:'<i class="mdx">&#xE83A;</i>',
		arrow_drop_down:'<i class="mdx">&#xE5C5;</i>',
		shopping_cart:'<i class="mdx">&#xE8CC;</i>',
		favorite_border:'<i class="mdx">&#xE87E;</i>',
		play_arrow:'<i class="mdx">&#xE037;</i>',
		cloud_upload:'<i class="mdx">&#xE2C3;</i>',
		chevron_right:'<i class="mdx">&#xE5CC;</i>',
		pause_circle_filled:'<i class="mdx">&#xE035;</i>',
		new_releases:'<i class="mdx">&#xE031;</i>,',
		thumb_down:'<i class="mdx">&#xE8DB;</i>'
		}

	var anhadir=''
	if (valor.indexOf(' left')>-1 || valor.indexOf('left ')>-1){
		valor=valor.replace('left', '')
		anhadir=' left'
		}
	else if (valor.indexOf(' right')>-1 || valor.indexOf('right ')>-1){
		valor=valor.replace('right', '')
		anhadir=' right'
		}

	if (valor.indexOf('_')==-1){
		var xi=document.createElement('i')			
		xi.className='mdx'+anhadir
		xi.appendChild( document.createTextNode(valor) )

		return xi
		}
	else if (dic[valor]!=null) {
		xi=jQuery(dic[valor]).addClass(anhadir)[0]
		return xi
		}
	else
		console.error('FALTA LIGATURE: ',valor)
	}
function modObjProp(obj, dicPropiedades){
	for (var prop in dicPropiedades){
		var valor=dicPropiedades[prop]
		if (valor==null)
				 continue
		try {
		 	if (prop=='omiteNulo')
			 	continue
		 	else if (prop=='textos') {//separados por \n
				var trozos=valor.split('\\n')
				for (var i=0; i<trozos.length; i++){
					var trozo=trozos[i]

					if (trozo.indexOf('\\t')>-1){
						var _l=trozo.split('\\t')
						for (var j=0; j<_l.length; j++){
							obj.appendChild( document.createTextNode('\u00a0') ) //tab='\u0009', espacio='\u00a0'
							obj.appendChild( document.createTextNode(_l[j]) )
							}
						}
					else
						obj.appendChild( document.createTextNode(trozo) )

					if (i<trozos.length-1) obj.appendChild(creaObjProp('BR'))
					}
				}
		 	else if (prop=='texto' )
				obj.appendChild( document.createTextNode(valor))
		 	else if (prop=='circle'){//materialize
				var xi=document.createElement('i')
				xi.className=valor

				if (obj.firstChild)
					obj.insertBefore(xi, obj.firstChild)
				else
					obj.appendChild(xi)
				}
			else if (prop=='i'){
				var xi=document.createElement('i')
				xi.className=valor

				if (obj.firstChild)
					obj.insertBefore(xi, obj.firstChild)
				else
					obj.appendChild(xi)
				}
			else if (prop=='mi'){//material icons con "ligature"
				var xi=getLigature(valor)
				obj.appendChild(xi)
				}
			else if (prop=='mi_circle'){
				var xi=getLigature(valor)		
				xi.className+=' circle'
				obj.appendChild(xi)
				}
			// else if (prop=='fa'){
			// 	if (dicPropiedades['omiteNulo']){
			// 		if ( (dicPropiedades['texto']==null || dicPropiedades['texto']=='') && 
			// 			dicPropiedades['hijo']==null && 
			// 			(dicPropiedades['hijos']==null || dicPropiedades['hijos'].length==0) )
			// 				continue
			// 			}
			// 	var xi=document.createElement('i')
			// 	xi.className='fa '+valor

			// 	if (obj.firstChild)
			// 		obj.insertBefore(xi, obj.firstChild)
			// 	else
			// 		obj.appendChild(xi)
			// 	}
		 	else if (prop=='stack'){
				var icon_stack=document.createElement('span')
				var lg=''
				if (valor.indexOf('fa-lg')>-1){
					lg=' fa-lg'
					valor=valor.replace('fa-lg', '')
				}
				icon_stack.className='fa-stack icon-stack'+lg


				var icon_circle=document.createElement('i')
				icon_circle.className='fa fa-circle fa-stack-2x'
				icon_stack.appendChild(icon_circle)

				var icon_myElement=document.createElement('i')
				icon_myElement.className='fa fa-stack-1x fa-inverse '+valor
				icon_stack.appendChild(icon_myElement)

				if (obj.firstChild)
						 obj.insertBefore(icon_stack, obj.firstChild)
				else
						 obj.appendChild(icon_stack)
				}
		 	else if (prop=='hijos'){
				for (var i=0; i<valor.length; i++){
					 var trozo=valor[i]
					 obj.appendChild( trozo )
					 }
				}
		 	else if (prop=='hijo')
				obj.appendChild(valor)
		 	else if (prop.indexOf('style.')==0 ) {//error setting a property that has only a getter
				prop=prop.substring(6)
				if (['left', 'top', 'width', 'height'].indexOf(prop)>-1){
				 	valor=valor.toString()
					if (valor.indexOf('px')==-1 && valor.indexOf('%')==-1)
						valor+='px'
					}
				obj.style[prop]=valor
				}
		 	//~ else if (prop=='quitaEstilo')
					//~ quitaEstilo(obj, valor)
		 	else if (prop.indexOf('attr.')==0){
				prop=prop.substring(5)
				obj.setAttribute(prop, valor)
				}
		 	else if (prop.indexOf('data-')==0){
				obj.setAttribute(prop, valor)
				}
		 	else if (prop=='html')
				obj.innerHTML=valor
		 	else
				obj[prop]=valor
				}
		catch (e) {
			console.error('ERROR '+e.message + '\nen '+e.fileName+' linea '+e.lineNumber)
			}
		}
	}
function creaT(t){return document.createTextNode(t)}
function lpad(v, carRelleno, lenTotal){
	carRelleno=carRelleno || '0'
	lenTotal=lenTotal || 2

	var ini=''
	while (ini.length<lenTotal){
		ini+=carRelleno
	}
	return (ini+v).substr(-lenTotal, lenTotal)
	}
function buscaFilas(filas, dicBuscado){
	//devuelve el array de filas que cumplen los requisitos
	if (filas==null) return []
	var fn=function(element, index){
		for (var k in dicBuscado){
			if (k.indexOf('_contains_')==0){
				var kt=k.substr( '_contains_'.length )
				var zonaBusqueda=element[kt]
				
				if (zonaBusqueda.toLowerCase().indexOf( ( (dicBuscado[k]+'').toLowerCase() ) )==-1)
					return false
				}
			else if (dicBuscado[k]!=element[k]){
				return false
				}
			}
		return true
		}
	return jQuery.grep(filas, fn)
	}
//
function quitaDups(filas, cd){
	for (var i=0; i<filas.length; i++){
		if (filas[i]==null) continue
		var k=filas[i][cd]

		for (var j=i+1; j<filas.length; j++){
			if (filas[j]==null) continue

			var kk=filas[j][cd]
			if (k==kk)
				filas.splice(j, 1, null)
			}
		}
	for (var i=filas.length-1; i>=0; i--){
		if (filas[i]==null)
			filas.splice(i, 1)
		}
	return filas
	}
function getIndiceFila(filas, dicBuscado, todas){
	if (filas==null) return -1
	var _idx=0
	filas.map(function(el){el._idx=_idx; _idx++})
	var filas=buscaFilas(filas, dicBuscado)

	if (filas.length==0) 
		return -1

	if (todas!=null && todas==true){
		var ret=[]
		for (var i=0; i<filas.length;i++){
			ret.push( filas[i]._idx )
			}
		return ret
		}
	else{
		var idxBorrar=filas[0]._idx
		return idxBorrar
		}
	}
function eliminaRepetidos(filas, key){
	if (key==null) throw ErrorEliminaRepetidos('No viene key')

	var ret=[], keys=[]

	for (var i=0; i<filas.length; i++){
		var k='x'+filas[i][key]
		if (keys.indexOf(k)>-1){
			continue
			}

		ret.push(filas[i])
		keys.push(k)
		}
	return ret
	}
function get(s){return JSON.parse( localStorage.getItem(s) )}
function save(s,v){
	try {
		localStorage.setItem(s, JSON.stringify(v))
		}
	catch(e){
		if (e instanceof QuotaExceededError)
			app.trackEvent('Error', 'QuotaExceededError')
		console.log('No se ha podido guardar el test')
		}
	}
function xeval(s){return JSON.parse(s)}
function modalIsVisible(jq){
	var xq=jQuery(jq)
	return xq.is(':visible') && xq.css('opacity')>0
	}
//////////
var Formato=function(){
	// this.formatoFecha='dd/mm/yyyy'
	this.simbMoneda='€'
	this.numDecimales=2
	this.posMoneda='d'
	this.sepMiles='.'
	this.sepDecimal=','
	
	this.sepFecha='-'
	this.sepFechaHora=' '
	this.sepHora=':'
	}
Formato.prototype.moneda = function(dato, simbMoneda) {
	return this.formato_numero(dato, this.numDecimales, this.sepDecimal, this.sepMiles)+' '+this.simbMoneda
	}
Formato.prototype.number=function(dato){
    return this.formato_numero(dato, this.numDecimales, this.sepDecimal, this.sepMiles)
	}
Formato.prototype.integer=function(dato){
    return this.formato_numero(dato, 0, this.sepDecimal, this.sepMiles)
	}
Formato.prototype.formato_numero=function(numero, numDecimales, separador_decimal, separador_miles){
    numero=parseFloat(numero);
    if(isNaN(numero)){
        return "";
    }

    if(numDecimales!==undefined){
        // Redondeamos
        numero=numero.toFixed(numDecimales);
    }

    // Convertimos el punto en separador_decimal
    numero=numero.toString().replace(".", separador_decimal!==undefined ? separador_decimal : ",");

    if(separador_miles){
        // Añadimos los separadores de miles
        var miles=new RegExp("(-?[0-9]+)([0-9]{3})");
        while(miles.test(numero)) {
            numero=numero.replace(miles, "$1" + separador_miles + "$2");
        }
    }

    return numero;
	}
////
Formato.prototype._ddmmyyyy=function(f){
	return lpad(f.getDate(), '0', 2)+this.sepFecha+lpad(f.getMonth()+1, '0', 2)+this.sepFecha+f.getFullYear()
	}
Formato.prototype._hhmm=function(f){
	return lpad(f.getHours(), '0', 2)+this.sepHora+lpad(f.getMinutes(), '0', 2)
	}
Formato.prototype._hhmmss=function(f){
	return lpad(f.getHours(), '0', 2)+this.sepHora+lpad(f.getMinutes(), '0', 2)+this.sepHora+lpad(f.getSeconds(), '0', 2)
	}
Formato.prototype.fechaDDMMYYYY=function(t){
	var f=this.toDate(t)
	if (f==null) return '';
	return this._ddmmyyyy(f)
	}
Formato.prototype.fechaDDMMYYYYHHMMSS=function(t){
	var f=this.toDate(t)
	if (f==null) return '';

    return 	this._ddmmyyyy(f)+' '+this._hhmmss(f)
	}
Formato.prototype.fechaUHora=function(t){
	var f=this.toDate(t)
	if (f==null) return '';

	var hoy=new Date()
	if (f.getDate()==hoy.getDate() && 
		f.getMonth()==hoy.getMonth() && 
		f.getFullYear()==hoy.getFullYear()){

		return this._hhmm(f)
		}
	else 
		return this._ddmmyyyy(f)
	}
Formato.prototype.fechaComps=function(t){
	var f=this.toDate(t)
	if (f==null) return '';
	return {
		dia:f.getDate()    ,
		mes:f.getMonth()+1 ,
		mesl: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][f.getMonth()],
		año:f.getFullYear(),
		hora:f.getHours()  ,
		min:f.getMinutes() ,
		seg:f.getSeconds()
      	}
	}
Formato.prototype.toDate=function(t){
	var fjs
	if (t==null)
        fjs=null
    else if (t instanceof Date)
    	fjs=t
    else if (typeof(t)=='number')//Long
        fjs=new Date(t)
    
    else {
    	var ret=new Date(t)
       	if (!isNaN( ret.getTime() ) )//check invalid date
         	fjs=ret
        else
        	fjs=this._fechajs(t)
    	}
    return fjs
	}
Formato.prototype._fechajs=function(fOriginal){
	var ret
    if(fOriginal==null) 
    	return null
    else if (fOriginal instanceof Date){
        return fOriginal
        }

    var trozos=(fOriginal+'').split(this.sepFechaHora)
    var ret=new Date()

    var sep= this.sepFecha
    if (trozos[0].indexOf('/')>-1) sep='/'

    var f=trozos[0].split(sep)
    var dia, mes, ano
    dia=f[0]; mes=f[1]; ano=f[2]
    if (dia>2000){
         dia=f[2]
         ano=f[0]
         }
    ano=ano.split('.')[0] // ¿viene con milisegundos?
    
    ret.setUTCFullYear(ano)
    ret.setUTCDate(dia)
    ret.setUTCMonth( (Number(mes)-1) )
    ret.setUTCDate(dia) //sí, 2 veces. Si le pones que es febrero y casualmente hoy es día 31 te lo cambia 2-marzo
    ret.setUTCMonth( (Number(mes)-1) )//¿estaba dando error al parsear 2013-02-01?
    
    if (trozos[1]) {
        var f=trozos[1].split(this.sepHora)
        var h,m,s
        h=Number(f[0])
        m=Number(f[1])
        s=Number(f[2])

        ret.setHours(h)
        ret.setMinutes(m)
        ret.setSeconds(s)
        }
    return ret
    }
var formato=new Formato()
//////////
function handleOpenURL(url){ 
	//para abrir una URL de tipo www.octopusapp.es/test?id=XXX
	var matricula=url.split('=')[1]
	app.cargaVistaDetalleTest(false, ':'+matricula)
	}
function Controlador(){
	var self=this

	this.nav=[]
	this.cache={}
	this.config={
			imgBase: '** secret **', //s3 route
			catBase: '** secret **', //s3 route
			data: '** secret **',    //s3 route
			res: '** secret **',     //s3 route

			prepareAdAtAppStartup:true,
			
			showAdAtTestDetailsClosed:true,
			showAdAtTestDownload:true,
			showAdAtTestPause:true,
			showAdAtTestFinish:true,
			showAdMinTimeBetweenAds: (1+Math.floor(2*Math.random()) ),
			}
	this.config.lastAdShownAt=new Date()//para que espere el mismo periodo antes de mostrar el primer anuncio

	if (isPhone() ){
		this.config.servidor='http://app.octopusapp.es/'
		// this.config.servidor='http://87.98.228.120/octopusapp/'
		// this.config.servidor='http://www.octopusapp.es/app/'
		// this.config.servidor='http://192.168.0.196:8888/octopus/'
		}
	else
		this.config.servidor='./'
	this.config.url=this.config.servidor+'index_r.php'

	var temp=get('tapp37_pasarPaginaAuto')
	this.cache.pasarPaginaAuto=(temp!=null && temp==1) || false 

	if (localStorage.tapp37_apprate=='later')
		localStorage.removeItem('tapp37_apprate')
	}
Controlador.prototype.init=function(){
	activarLeanMode()
	this.isLocalHost=(document.location.hostname=='localhost')
	if (get('tapp37_secret')!=null)
		jQuery('li.liVistaUploadTest').show()

	
	jQuery('.btn-navdrawer').sideNav({
        closeOnClick:true,
        menuWidth: 300
        })
	jQuery('#navDrawer').css({left:'-300px', opacity:1})

    jQuery('.btn-menu').dropdown()

	this.esTablet=jQuery('body').innerWidth()>=767
	if (this.esTablet){
		jQuery('body').addClass('tablet')

	}
	
	if (isPhone()){
		var attachFastClick = Origami.fastclick
		attachFastClick(document.body)

		document.addEventListener('backbutton', function(){app.backButton()}, false)
		
		document.addEventListener('offline', function(){app.setOffline(true)}, false)
		document.addEventListener('online', function(){app.setOffline(false)}, false)

		document.addEventListener('pause', function(){app.pause()}, false)
		document.addEventListener('menubutton', function(){app.toggleNavDrawer()}, false)

		window.addEventListener('native.keyboardshow', function(e){app.resize(e)})
		window.addEventListener('native.keyboardhide', function(e){app.resize()})
		}
	else {
		device={uuid:'fake-uuid-2123xxxxsss', platform:'web', version:'a.b.c'}
		navigator.connection={type:'3G'}
		Connection={NONE:'none'}
		}

	jQuery('body')
		.addClass( device.platform.toLowerCase() )
		.addClass( device.platform.toLowerCase()+device.version.split('.')[0] )

	setTimeout(function(){
		if (!isPhone()){
			}
		else if (analytics){
			analytics.startTrackerWithId(
				analyticsID, 
				function(){},
				function(){}
				)
			window.analytics.debugMode()
			}
		else 
			console.error('No hay analytics :(')
		}, 5000)

	app.cache.usuario={}
	window.addEventListener('resize', function(){app.resize()}, false)

	this.setCategorias(get('tapp37_categorias'))

	var self=this
	jQuery(window).bind('popstate', function(){self.backButton()} )

	if (!isPhone())
		this.includeJS('js/jwerty.js')

	app.cargaVistaInicio()
	this.getLastMinuteResources()

	if (this.config.prepareAdAtAppStartup)
		this.prepareAd()
	}
Controlador.prototype.checkTouchDelay=function(){
	var button=jQuery('.card.test')[0]
    button.addEventListener( "touchend", function() {
        app.delay = Date.now()
    	})
    button.addEventListener( "click", function() {
        console.log('DELAY ', Date.now() - app.delay )
    	})
	}
Controlador.prototype.includeJS=function(src, fnCallBack){
    jQuery.getScript(src, function() {
        if (fnCallBack)
        	fnCallBack()
    	})
	}
Controlador.prototype.includeCSS=function(src, fnCallBack){	
	var id='CSS_din.css'

	if (jQuery('head > #'+id).length==0)
		jQuery('head').append('<link id="'+id+'" rel="stylesheet" href="'+src+'" type="text/css" />')
	}
////
Controlador.prototype.getLastMinuteResources=function(){
	//BUILD_ID
	try {
		this.checkResource(app.config.res+'BUILD_'+BUILD_ID+'.js', 'js')
		this.checkResource(app.config.res+'BUILD_'+BUILD_ID+'.css', 'css')
		}
	catch (e){
		}
	}
Controlador.prototype.checkResource=function(nombre, tipo){
	// localStorage.tapp37_lastSynced
	// localStorage.tapp37_dataPath	
	var fnProcesaArchivo=function(urllocal, tipo){
		if (tipo=='css'){
			app.includeCSS(urllocal)
			}
		else if (tipo=='js'){
			jQuery.getScript(urllocal, function(d){
				if (app.vistaActiva)
					app.vistaActiva.tareasPostCargaDinamica()
				} )
			}
		}

	var dataPath='tapp37_dataPath_'+tipo
	var lastSynced='tapp37_lastSynced_'+tipo
	var self=this
	if (device.platform=='iOS' || device.platform=='Android'){	
		//check for new data
		jQuery.ajax({url:nombre, method:'HEAD'})
    		.done(function(res,text,jqXHR) {
        		var lastMod = jqXHR.getResponseHeader('Last-Modified')
        		console.log('Sync: lastmod=', lastMod)
        		
        		if (!localStorage[lastSynced] || localStorage[lastSynced] != lastMod) {
            		console.log('Sync: need to sync')
            		self.startSincroRes(fnProcesaArchivo, nombre, tipo)
            		localStorage[lastSynced] = lastMod
        			} 
        		else {
            		console.log('Sync: NO need to sync')
            		fnProcesaArchivo()
        			}
    			})
    		.fail(function(){// offline?
    			if (localStorage[dataPath])
    				fnProcesaArchivo(localStorage[dataPath], tipo)

    		})
		}
	else if (device.platform=='web'){
		fnProcesaArchivo('./data/BUILD_100.'+tipo, tipo)
		}
	}
Controlador.prototype.startSincroRes=function(fnCallBack, nombre, tipo){
	var dataPath='tapp37_dataPath_'+tipo

	var sync = ContentSync.sync({ src: nombre, id: 'lastMinute_res_'+tipo })
    
    sync.on('progress', function(data) {
        console.log('Sync progress: '+data.progress+'%')
    	})
    
    sync.on('complete', function(data) {
        localStorage[dataPath] = data.localPath
        fnCallBack(data.localPath, tipo)
    	})
    
    sync.on('error', function(e) {
        console.log('Sync error: ', e.message)
   	 	})
    
    sync.on('cancel', function() {
        console.log('Sync cancel: ', e.message)
   		})
	}
////
Controlador.prototype.jwerty=function(t, fn, fnContext){
	if (isPhone()) return
	jwerty.key(t, fn, fnContext)
	}
Controlador.prototype.setOffline=function(v){
	this.offline=v
	console.log('setOffline:'+v)

	if (this.vistaActiva) 
		this.vistaActiva.setOffline(v)
	}
////
Controlador.prototype.setCategorias=function(lis){
	this.cache.categorias=lis
	
	if (! (this.cache.categorias instanceof Array))
		this.cache.categorias=[{}]
	
	save('tapp37_categorias', lis)
	}
Controlador.prototype.catsConRespuestasLocales=function(){
	if (this.cache.respuestasLocales==null)
		this.cache.respuestasLocales=this.getRespuestasLocales()

	return this._getCatsDeTestsORespuestasLocales(this.cache.respuestasLocales)
	}
Controlador.prototype._getCatsDeTestsORespuestasLocales=function(col){
	if (this.cache.categorias==null){
		this.setCategorias(get('tapp37_categorias'))
		}

	var lisIdCat=[-1]
	for (var i=0; i<col.length; i++){
		if (col[i].liscat==null) continue
		var temp=col[i].liscat.split(',')
		for (var j=0; j<temp.length; j++){
			var idcat=temp[j]
			
			if (idcat && lisIdCat.indexOf(idcat)==-1)
				lisIdCat.push(idcat)
			}
		}
	lisIdCat.sort()

	var ret=[]
	for (var i=0; i<lisIdCat.length; i++){
		var cats=buscaFilas(this.cache.categorias, {cd_categoria:lisIdCat[i]} )
		if (cats)
			ret.push( cats[0])
		}
	return ret
	}
Controlador.prototype.getTestLocales=function(){
	var ret=get('tapp37_listaTest') //VistaTienda.prototype.testData()
	if (! (ret instanceof Array) )
		ret=[]
	return ret
	}
Controlador.prototype.getRespuestasLocales=function(){
	var ret=get('tapp37_listaTestRespuestas')//{cd_test:1, respuestas:{}}
	if (! (ret instanceof Array) )
		ret=[]
	return ret
	}
/////
Controlador.prototype.pause=function(){
	if (app.cache.usuario==null)
		return
	
	if (app.vistaActiva instanceof VistaTest)
		this.vistaTest.pause()
	}
Controlador.prototype.sendNotification=function(titulo, texto, icono, ongoing, json, onclick) {
	var sound=null, param
    if (!isPhone() ){
    	console.warn('sendNotification: '+titulo)
    	return
    	}
    else if (device.platform.toLowerCase() == 'ios'){
    	param={
		    title:   titulo,
		    message: texto,
		    json:JSON.stringify(json),
		    sound:''
			}
    	}
   	else {//android
   		icono='notificacion'
   		if (!ongoing) sound='TYPE_NOTIFICATION'

   		var autoCancel=false
	    if (ongoing)
	    	autoCancel=false
	    else if (onclick)
	    	autoCancel=false
	    else
	    	autoCancel=true
		
		param={
		    title:   titulo,
		    message: texto,
		    autoCancel:  autoCancel,
		    ongoing:ongoing,

		    sound: sound,
		    // icon:'notificacion', //NO es posible sacar la foto del usuario
		    smallIcon:icono,
		    json:json,
			}
   		}

	try {
		window.plugin.notification.local.add(param)
		if (onclick) window.plugin.notification.local.onclick=onclick
		}
	catch (e){
		navigator.notification.beep()
		}
	}
Controlador.prototype.clearNotification=function(postpone) {
	if (device.platform.toLowerCase() == 'ios'){
		}
	else if (postpone==null)
		window.plugin.notification.local.cancelAll()
	else { 
		setTimeout(function(){
			try{ window.plugin.notification.local.cancelAll() }
			catch(e){}
			}, postpone)
		}
	}
Controlador.prototype.showToast=function(msg){
	if (isPhone()) window.plugins.toast.showShortBottom(msg)
	}
/////
Controlador.prototype.muestraNodoEnNavDrawer=function(idLi){
	var arbol=jQuery('#navDrawer')
	arbol.find('li.active').removeClass('active')

	arbol.find('.'+idLi).addClass('active')
	}
Controlador.prototype.toggleNavDrawer=function(){
	if (jQuery('#main_container aside.nav-off-screen').hasClass('nav-off-screen'))
		this.cierraNavDrawer()
	else
		this.abreNavDrawer()
	}
Controlador.prototype.abreNavDrawer=function(){
	jQuery('.btn-navdrawer').sideNav('show')

	this.toggleMenuGlobal(false)
	}
Controlador.prototype.cierraNavDrawer=function(){
	// jQuery('#main_container aside.nav-off-screen').removeClass('nav-off-screen')
	// jQuery('.btn-navdrawer.active').removeClass('active')
	jQuery('.btn-navdrawer').sideNav('hide')

	this.toggleMenuGlobal(true)
	}
/////
Controlador.prototype.continuarTest=function(desdeHistorial){
	this.lanzaTest( VistaTest.prototype.testData() )
	this.cierraNavDrawer()
	}
Controlador.prototype.lanzaTourAplicacion=function(){
	this.cierraNavDrawer()

	if (this.vistaTourAplicacion==null){
		this.vistaTourAplicacion=new VistaTourAplicacion()
		this.vistaTourAplicacion.toDOM()	
		}
	else {
		this.vistaTourAplicacion.inicio()
		this.vistaTourAplicacion.show()
		}
	}
Controlador.prototype.lanzaTest=function(test, resp, vistaOrigen){
	this.vistaTest=new VistaTest(test, resp)
	this.vistaTest.toDOM()
	}
Controlador.prototype.cargaVistaInicio=function(){
	var self=this
	var tl=app.getTestLocales()

	activarLeanMode()
	var tourRealizado=get('tapp37_tourRealizado') || 0
	if (!tourRealizado){
		this.lanzaTourAplicacion()

		//aprovechamos para cargar
		this.vistaTienda=new VistaTienda(false)
		this.vistaTienda.iniciaSincroTestTienda()
		return
		}
	else if (this.vistaTienda==null){
		//para que cargue las categorias
		this.vistaTienda=new VistaTienda(false)
		this.vistaTienda.iniciaSincroTestTienda(
				function(){self.cargaVistaInicio()}
				)
		return
	}


	var hash=''
	if (isPhone())
		hash=get('tapp37_lastview') || ''
	else
		hash=(document.location.hash+'').substring(1)

	// if (this.vistaSocial==null){
	// 	this.vistaSocial=new VistaSocial(false)
	// 	}
	
	if (this.vistaTienda==null)
		this.vistaTienda=new VistaTienda(false)
	if (this.vistaDetalleTest==null)
		this.vistaDetalleTest=new VistaDetalleTest(false)
	
	if (this.vistaMedallero==null)
		this.vistaMedallero=new VistaMedallero(false)
	
	if (hash.indexOf('vistaMigraTest')>-1)
		this.cargaVistaMigraTest(false)
	
	else if (hash.indexOf('vistaMisTest')>-1){
		this.cargaVistaMisTest(false, hash)
		}
	else if (hash.indexOf('vistaTienda')>-1){
		this.cargaVistaTienda(false, hash)
		}
	// else if (hash.indexOf('vistaTest')>-1){
	// 	this.cargaVistaTienda(true, true)
	// 	}
	// else if (hash.indexOf('vistaSocial')>-1 )
	// 	this.cargaVistaSocial(true, hash)
	
	else if (hash.indexOf('vistaEstadisticas')>-1)
	 	this.cargaVistaEstadisticas()
	else if (hash.indexOf('vistaAjustes')>-1){
		this.cargaVistaAjustes()
		}
	else if (hash.indexOf('vistaDetalleTest')>-1 || hash.indexOf('vistaTest')>-1)
		this.cargaVistaDetalleTest(false, hash)
	else { 
		if (tl.length>0)
			this.cargaVistaMisTest(false)
		else 
			this.cargaVistaTienda(false)
		}

	if (isPhone()) jQuery('body').addClass(device.platform.toLowerCase() )
	setTimeout(function(){app.vistaActiva.resize()}, 1000)
	}
Controlador.prototype.cargaVistaMisTest=function(desdeHistorial, hash){
	this.clearNav()

	if (this.vistaMisTest==null)
		this.vistaMisTest=new VistaMisTest(desdeHistorial)
		
	if (this.vistaMisTest.domBody)
		this.vistaMisTest.show(desdeHistorial)
	else
		this.vistaMisTest.toDOM(desdeHistorial)

	if (!desdeHistorial) this.cierraNavDrawer()

	this.muestraNodoEnNavDrawer('liVistaMisTest')
	}
Controlador.prototype.cargaVistaTienda=function(desdeHistorial, hash){
	app.clearNav()

	if (this.vistaTienda==null)
		this.vistaTienda=new VistaTienda(desdeHistorial)
	
	if (hash){
		var cd_cat=hash.split(':')[1]
		this.vistaTienda.hashCat=cd_cat	
		}

	if (this.vistaTienda.domBody)
		this.vistaTienda.show(desdeHistorial)
	else
		this.vistaTienda.toDOM(desdeHistorial)

	this.muestraNodoEnNavDrawer('liVistaTienda')
	if (!desdeHistorial) this.cierraNavDrawer()
	}
Controlador.prototype.cargaVistaDetalleTest=function(desdeHistorial, hashOTest, cat){
	var cd_test, test
	if (hashOTest!=null && typeof(hashOTest)=='string'){
		var temp=hashOTest
		cd_test=temp.split(':')[1]
		test={matricula:cd_test}
		}
	else if (typeof(hashOTest)=='object'){
		test=hashOTest
		}

	if (this.vistaDetalleTest && this.vistaDetalleTest.domBody)
		this.vistaDetalleTest.show(desdeHistorial, test, cat )
	else {
		this.vistaDetalleTest.toDOM(desdeHistorial )
		this.vistaDetalleTest.show(desdeHistorial, test, cat)
		}
	this.muestraNodoEnNavDrawer('liXX')
	}
Controlador.prototype.cargaVistaMedallero=function(desdeHistorial, hash){
	var self=this

	this.ponThrobber()

	if (this.vistaMedallero==null){
		this.vistaMedallero=new VistaMedallero(desdeHistorial)

		setTimeout(function(){
			self.vistaMedallero.muestraLogros()
		
			if (!desdeHistorial) self.cierraNavDrawer()
			self.muestraNodoEnNavDrawer('liXX')
			self.quitaThrobber()
			}, 2000)
		}
	else {
		self.vistaMedallero.muestraLogros()
		self.quitaThrobber()
		}
	
	}
Controlador.prototype.cargaVistaTablaPuntuacion=function(desdeHistorial, hash){
	var self=this
	this.ponThrobber()

	if (this.vistaMedallero==null){
		this.vistaMedallero=new VistaMedallero(desdeHistorial)	
	
		setTimeout(function(){
			self.vistaMedallero.muestraTablaPuntuacion()
		
			if (!desdeHistorial) self.cierraNavDrawer()
			self.muestraNodoEnNavDrawer('liXX')
			self.quitaThrobber()
			}, 2000)
		}
	else {
		self.vistaMedallero.muestraTablaPuntuacion()
		self.quitaThrobber()
		}
	}
Controlador.prototype.cargaVistaEstadisticas=function(desdeHistorial){
	this.clearNav()

	if (this.vistaEstadisticas==null)
		this.vistaEstadisticas=new VistaEstadisticas(desdeHistorial)

	if (this.vistaEstadisticas.domBody)
		this.vistaEstadisticas.show()
	else
		this.vistaEstadisticas.toDOM()

	if (!desdeHistorial) this.cierraNavDrawer()
	this.muestraNodoEnNavDrawer('liVistaEstadisticas')
	}
Controlador.prototype.cargaVistaAjustes=function(desdeHistorial){
	this.clearNav()
	
	if (this.vistaAjustes==null)
		this.vistaAjustes=new VistaAjustes(desdeHistorial)
	
	if (this.vistaAjustes.domBody)
		this.vistaAjustes.show()
	else
		this.vistaAjustes.toDOM()

	if (!desdeHistorial) this.cierraNavDrawer()
	this.muestraNodoEnNavDrawer('liVistaAjustes')
	}
Controlador.prototype.pushState=function(id){
	window.history.pushState({vista:id}, id, '#'+id)
	save('tapp37_lastview', id)
	}
Controlador.prototype.resize=function(){
	if (this.vistaActiva)
		this.vistaActiva.resize()
	
	var vistas=[
		this.vistaTienda, 
		this.vistaMisTest,
		this.vistaSocial, 
		this.vistaMedallero, 
		this.vistaEstadisticas, 
		this.vistaActiva,
		this.vistaAjustes
		]

	for (var v in vistas){
		var xv=vistas[v]

		if (xv==null){
			}
		else if (xv.id != this.vistaActiva.id){
			xv.resize()
			console.log('resize>>'+xv.id)
			}
		}
	}
Controlador.prototype.search=function(){
	if (this.vistaActiva)
		this.vistaActiva.search()
	}
/////
Controlador.prototype.inicio=function(){
	if (app.vistaActiva)
		app.vistaActiva.inicio(false)
	}
Controlador.prototype.backButton=function(){
	var ahora=new Date()

	if (this.lastOp && (ahora-this.lastOp)<100)
		return

	this.lastOp=ahora

	if (jQuery('#sidenav-overlay').is(':visible')){
		this.cierraNavDrawer()
		return
		}
	else if (jQuery('.dropdown-content').hasClass('active')){
		jQuery('.dropdown-content').removeClass('active').hide()
		return
		}
	// else if (jQuery('.vista .vista-header .btn-group').hasClass('open')){
	// 	jQuery('.vista .vista-header .btn-group').removeClass('open')
	// 	return
	// 	}
	else if (jQuery('.modal#frmImgAmpliada').is(':visible')){
		jQuery('.modal#frmImgAmpliada').modal('hide')

		return
		}


	if (app.vistaActiva && app.vistaActiva.id=='vistaTest'){
		this.vistaTest.backButton()
		}
	else if (app.vistaActiva && app.vistaActiva.id=='vistaDetalleTest'){
		this.vistaDetalleTest.backButton()
		}
	else{
		var vFrom=app.popFromNav()
		var vTo=app.getLastFromNav()

		if (vFrom==null && vTo==null && isPhone()){
			navigator.app.exitApp()
			return
			}
		else if (vFrom!=null && vTo==null && isPhone() ) {
			if ( (vFrom.vista=='vistaTienda' || vFrom.vista=='vistaMisTest')  ){
				navigator.app.exitApp()
				return
				}
			else {
				if (app.vistaActiva.id==app.vistaTienda.id)
					app.vistaActiva.navegarAPortada()
				else if (app.vistaActiva.id==app.vistaMisTest.id ) 
					app.vistaActiva.pintaPortadaTienda()
				return
				}
			}
		else if (vTo==null) {
			//lo mandamos al inicio, que no se quede bloqueado
			if (app.vistaActiva.id==app.vistaTienda.id)
				app.vistaActiva.navegarAPortada()

			else if (app.vistaActiva.id==app.vistaMisTest.id ) 
				app.vistaActiva.pintaPortadaTienda()

			return
			}
		// if (vTo.vista=='vistaSocial')
		// 	this.vistaSocial.backButton(vTo, vFrom)
		if (vTo.vista=='vistaMedallero')
			this.vistaMedallero.backButton(vTo, vFrom)
		else if (vTo.vista=='vistaTienda')
			this.vistaTienda.backButton(vTo, vFrom)
		else if (vTo.vista=='vistaMisTest')
			this.vistaMisTest.backButton(vTo, vFrom)
		else if (vTo.vista=='vistaTest')
			this.vistaTest.backButton(vTo, vFrom)
		}
	}
Controlador.prototype.addToNavIfEmpty=function(el){
	if (app.nav.length==0)
		this.addToNav(el)
	}
Controlador.prototype.addToNav=function(el, sustituirCat){
	//no metemos duplicados
	if (JSON.stringify(el) === JSON.stringify(app.nav[app.nav.length-1]) )
		return

	if (sustituirCat){
		// para que volver al raíz de la tienda no sea eterno,
		//	   no guardaremos el movimiento entre categorías
		var ultimo=app.nav[app.nav.length-1]
		if (ultimo==null){
			}
		else if (ultimo.vista==el.vista && 
			ultimo.cd_categoria!=null && el.cd_categoria!=null &&
			ultimo.cd_pack==null && el.cd_pack==null){
				//navegación a otra categoría

			app.nav[app.nav.length-1].cd_categoria=el.cd_categoria
			return
			}
		}

	app.nav.push(el)
	app.vistaActiva.navActivo=el
	
	// console.log('nav++')
	// console.log(app.nav)

	if (app.nav.length>1)
		this.ponBackButton()
	else if (app.nav.length==1){
		var v=app.nav[0].vista
		if (v=='vistaTienda')
			this.quitaBackButton()
		else if (v=='vistaTienda')
			this.quitaBackButton()
		}
	else
		this.quitaBackButton()
	}
Controlador.prototype.popFromNav=function(){
	var r= this.nav.pop()

	// console.log('nav--')
	// console.log(app.nav)
	if (app.nav.length==1){
		var v=app.nav[0].vista
		if (v=='vistaTienda')
			this.quitaBackButton()
		else if (v=='vistaTienda')
			this.quitaBackButton()
		}
	else if (app.nav.length>1)
		this.ponBackButton()
	else
		this.quitaBackButton()

	return r
	}
Controlador.prototype.getLastFromNav=function(){
	return this.nav[this.nav.length-1]
	}
Controlador.prototype.clearNav=function(){
	this.nav=[]
	// console.log('nav//')
	// console.log(app.nav)
	this.quitaBackButton(false)
	}
/////
Controlador.prototype.ponBackButton=function(){
	jQuery('#navigation_bar .main').removeClass('noback')
	}
Controlador.prototype.quitaBackButton=function(){
	jQuery('#navigation_bar .main').addClass('noback')
	}
Controlador.prototype.toggleMenuGlobal=function(visible, inmediate){
	if (this.vistaActiva) this.vistaActiva.toggleMenuGlobal(visible, inmediate)
	}
/////
Controlador.prototype.generaTextoCompartir=function(conHTML){
	var linkAndroid='https://play.google.com/store/apps/details?id=es.octopusapp.clo'
	var tiendaAndroid='Google Play'

	var linkIOS='http://faltaEnlace'//TODO
	var tiendaIOS='iTunes'

	var asunto='Octopus: test de oposiciones en tu móvil', texto
	if (conHTML){
		texto='Hola,<br><br>estoy probando <b>Octopus</b>, una nueva forma de realizar test para nuestras oposiciones desde el móvil.'+
				'<br>¿Te interesa? Descárgalo gratis para Android desde <a href="'+linkAndroid+'">'+tiendaAndroid+'</a>'
		}
	else {
		texto='¡Hola! estoy probando Octopus, una nueva forma de realizar test para nuestras oposiciones desde el móvil. '+
				'¿Te interesa? Descárgalo gratis para Android desde '+linkAndroid
		}

	return [asunto, texto]
	}
// Controlador.prototype.enviarInvitacionPorEmail = function(lista) {
//  //plugin de.appplant.cordova.plugin.email-composer
// 	var datos=this.generaTextoCompartir()
// 	cordova.plugins.email.open({
// 	    to:      lista.join(','),
// 	    subject: datos[0],
// 	    body:    datos[1],
// 	    isHtml:  true
// 		})
// 	}
Controlador.prototype.enviarInvitacion=function(){
	var datos=this.generaTextoCompartir()

	var fnCallBack=function(ok){
		if (ok) {
			app.vistaMedallero.nuevoLogro('varios_compartir')
			app.trackEvent('app', 'invitation-sent')
			}
		}
	window.plugins.socialsharing.share(datos[1], datos[0], null, null, fnCallBack)
	}
Controlador.prototype.compartirTest=function(test){
	if (isPhone()){
		var t=test.ds_test+'/'+test.organismo+' '+
				'http://www.octopusapp.es/test?id='+test.matricula

		window.plugins.socialsharing.share(t) //texto, asunto, img, enlace

		app.trackEvent('test', 'share', test.cd_test+'-'+test.ds_test)
		app.vistaMedallero.nuevoLogro('varios_compartir')
		}
	}
/////
Controlador.prototype.post=function(param, fnOk, fnCancel){
	jQuery.post(app.config.url+'?'+param.accion, param)
		.done(function(data){
			fnOk(data)
			})
		.fail(function(data){
				if (fnCancel) fnCancel(data)
				})
	}
Controlador.prototype.alert=function(texto, titulo){
	if (isPhone())
		navigator.notification.alert(texto, null, titulo)
	else
		alert(texto)
	}
Controlador.prototype.ponThrobber=function(){
	jQuery('.throbber').show()
	}
Controlador.prototype.quitaThrobber=function(){
	jQuery('.throbber').hide()
	}
Controlador.prototype.setStatusBG=function(c){
	if (isPhone()) StatusBar.backgroundColorByHexString(c)
	}
Controlador.prototype.unSetStatusBG=function(){
	this.setStatusBG('#25313e')
	}
/////
Controlador.prototype.check_appRateDialog=function(){
	var ar=localStorage.tapp37_apprate
	var nt=app.cache.testLocales.length

	if (nt==0 || (nt % 3!=0) ){
		console.log('banner apprate? nope')
		}
	else if (ar==null)
		app.appRateDialog()
	}
Controlador.prototype.appRateDialog=function(){
	if (device.platform=='web')
		app.alert('App-Rating-Dialog')
	else {
		var isIOS=device.platform=='iOS'
		AppRate.preferences={
			useLanguage:'es',
			displayAppName:'Octopus',
			usesUntilPrompt:3,
			promptAgainForEachNewVersion:false,
			storeAppURL:{
				ios:1027449575,
				android:'market://details?id=es.octopusapp.clo'
				},
			openStoreInApp:true,
			callbacks:{
				onRateDialogShow:function(){},
				onButtonClicked:function(id){
					var q=[null,  'no', 'later', 'yes' ]

					localStorage.tapp37_apprate=q[id]
					app.trackEvent('app', 'rate', q[id])
					},
				},
			customLocale:{
				title:'Escribe una reseña',
				message:'¿Te gusta Octopus? ¿La recomendarías? Demuestra tu amor al mundo con una valoración',
				cancelButtonLabel: 'No, gracias',
				laterButtonLabel: isIOS?'Recordarme más tarde':'Después',
				rateButtonLabel:  isIOS?'Escribir reseña ahora':'Sí'
				}
			}
		AppRate.promptForRating()
		}
	}
/////

Controlador.prototype.prepareAd=function(){
	if (this.adsInited==null){
		if (!isPhone())
			this.adsInited=true
		else if (AdMob==null) 
			return
		var admobid= device.platform=='Android'? 'ca-app-pub-7995175200662376/1362543649': 'ca-app-pub-7995175200662376/5234340048'
		
		//// https://github.com/floatinghotpot/cordova-admob-pro/wiki/1.5-Events
		//document.addEventListener('onAdFailLoad', function(e){})
		document.addEventListener('onAdLoaded',function(data){
    		console.log('Ads: Nuevo anuncio... listo!')
    		app.adReady = true
			})

		this.adsInited=true
		}

	if (this.adsInited) {
		try{
			console.log('Ads: nuevo anuncio solitado')
			this.adReady=false

			if (!isPhone())
				this.adReady=true
			else
				AdMob.prepareInterstitial( {adId:admobid, autoShow:false} )
			} 
		catch (e) {

			}
		}
	}
Controlador.prototype.showAd=function(){
	if (this.adsInited && this.adReady) {
		try{
			var hayQueMostrar=false

			if (this.config.showAdMinTimeBetweenAds && this.config.lastAdShownAt) {
				var diff=(new Date()-this.config.lastAdShownAt)/60000
				
				hayQueMostrar=diff>this.config.showAdMinTimeBetweenAds
				}
			else
				hayQueMostrar=true

			if (hayQueMostrar){
				console.log('Ads: anuncio a mostrar')

				if (isPhone()){
					AdMob.showInterstitial()
					this.prepareAd()
					}

				app.trackEvent('app', 'adShown')
				this.config.lastAdShownAt=new Date()
				}
			else {
				console.log('Ads: anuncio a mostrar -> no lo mostramos, el último fue hace poco '+this.config.lastAdShownAt)
				//app.showToast('Ads: anuncio a mostrar -> no lo mostramos, el último fue hace poco '+this.config.lastAdShownAt)
				}
			} 
		catch (e) {

			}
		}
	}
/////
Controlador.prototype.trackView=function(id){
	try{
		if (isPhone()) 
			analytics.trackView(id)
		}
	catch (e){

		}
	}
Controlador.prototype.trackEvent=function(cat, action, label, value){
	try{
		if (isPhone()) 
			analytics.trackEvent(cat, action, label, value)
		}
	catch (e){
		console.error('trackEvent failed:'+cat+'/'+action+'/'+label+'/'+value)
		}	
	}

////////////////////////////////////////////////

//Todas las vistas tienen un vista-header y un vista-body
function Vista(){
	this.title='Octopus'
	this.domMenu=jQuery('#navigation_bar .btn-search')

	this.diapoActiva=0
	if (this.id==null) return
	if (this.tipos.indexOf(this.id)==-1 )
		console.error('Tipo de vista desconocido: hay que darlo de alta en Vista.prototype.tipos')

	}
Vista.prototype.search=function(){
	var self=this

	if (this instanceof VistaTienda || 
		this instanceof VistaMisTest ){
		this.muestraDialogoBuscar()
		}
	else
		return
	}
Vista.prototype.muestraDialogoBuscar=function(){
	var entornoLocal=this instanceof VistaMisTest

	var self=this
	if (isPhone()){
		navigator.notification.prompt(
		    'Por ejemplo, "2013 MIR" o "EIR" o "Informática 2014"', //'Matrícula, nombre...',
		    function( result ) { //result.buttonIndex y result.input1
		        switch ( result.buttonIndex ) {
		            case 1:
						self.strBuscar=result.input1
						if (self.strBuscar==null)return
						self.doBuscarTest(self.strBuscar)
		                break;
		            case 2:
		                break;
		        }
		    },
		    'Buscar test en '+(entornoLocal?'Mis test':'la tienda'),     // a title
		    [ "Buscar" , "Cancelar"], // text of the buttons
		    ''//self.strBuscar
			)
		}
	else {
		self.strBuscar = prompt('Buscar test en '+(entornoLocal?'Mis test':'la tienda'), self.strBuscar)
		if (self.strBuscar==null)return

		if (self.doBuscarTest!=null)
			self.doBuscarTest(self.strBuscar)
		}
	}
Vista.prototype.doBuscarTestPorRegEx=function(filas, s){
	// /^(?=(.*google))(?=(.*microsoft))(?=(.*APPLE))/i.exec('Hola Microsoft Hola Apple Hola Google')

	var temp=s.split(' '), rs=''
	for (var j=0; j<temp.length; j++){
		rs=rs+'(?=(.*'+temp[j]+'))'
		}

	var regex=new RegExp('^'+rs, 'i')
	// regex.compile()
	var ret=[]
	
	for (var i=0; i<filas.length; i++){
		var f=filas[i]
		var s=f.ds_test+' '+f.organismo+' '+f.anho
		if (regex.test(s))
			ret.push(f)
		}
	return ret
	}
Vista.prototype.doBuscarTest=function(s, id, situar){
	var self=this
	app.ponThrobber()

	if (id!=null && isNaN(id)){
		s=id
		id=null
		}

	var options = {
		caseSensitive: false,
		includeScore: false,
		shouldSort: true,
		threshold: 0.5,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		keys: ['ds_test', 'organismo', 'matricula', 'palabrasClave']
		}

	var fuse, encontrados
	var soloEnDescargados=(this instanceof VistaMisTest)
	
	var lista=soloEnDescargados?app.cache.testLocales:app.cache.testTienda
	fuse = new Fuse(lista, options)
	encontrados = fuse.search(s).slice(0, 30)
	
	app.trackEvent('nav', (soloEnDescargados?'search-local-owned':'search-local-store'), 'exp:'+s+'-found:'+encontrados.length )

	encontrados.map(function(el){el.liscat=el.liscat+',-100,'})
	self.doBuscarTest_response(encontrados, situar)
	}
Vista.prototype.setOffline=function(v){}
Vista.prototype.calculaAnchoTarjetas=function(){
	var a=jQuery('#content').innerWidth()
	if (a<=600)
		return 2
	else if (a<=992)
		return 4
	else
		return 6
	}
Vista.prototype.tipos={
	vistaTest:'vistaTest', 

	vistaMisTest:'vistaMisTest', 
	vistaTienda:'vistaTienda', 
	
	// vistaSocial:'vistaSocial', // vistaGrupo:'vistaGrupo',
	vistaMedallero:'vistaMedallero', // vistaGrupo:'vistaGrupo',
	vistaAjustes:'vistaAjustes', 

	vistaEstadisticas:'vistaEstadisticas', 
	vistaMigraTest:'vistaMigraTest',

	vistaTourAplicacion:'vistaTourAplicacion',
	}
Vista.prototype.preDOM=function(desdeHistorial){
	this.cambiaTextoHeaderGlobal(this.title)
	if (this.id) app.muestraNodoEnNavDrawer('li'+this.id.slice(0,1).toUpperCase()+this.id.slice(1))
	}
Vista.prototype.toDOM=function(desdeHistorial){
	app.trackView(this.id)

	app.ponThrobber()
	this.preDOM(desdeHistorial)
	
	var xd=jQuery('#content')
	if (app) app.vistaActiva=this

	var tHeader=jQuery(this.getHeader())
	this.domHeader=jQuery(tHeader[tHeader.length-1])
	
	var tb=this.getBody()
	if (tb instanceof Array)
		this.domBody=jQuery(tb[0])
	else
		this.domBody=jQuery(tb)
	
	xd.find('.vista').hide()

	jQuery('#main_container .aside-md')
		.removeClass( Object.keys(this.tipos).join(' '))
		.addClass('vista '+this.id)

	jQuery('body')
		.removeClass( Object.keys(this.tipos).join(' '))
		.addClass(this.id)

	this.domCont=jQuery(creaObjProp('section', {'style.height':'100%'}))
	xd.append(this.domCont)
	
	jQuery('body > .navbar-fixed, body > .navbar-fixed > #navigation_bar').show()
	jQuery('.navbar-fixed').find('.vista-header').hide()
	jQuery('.navbar-fixed').append(tHeader)

	this.domCont
		// .append(this.domHeader)
		.append(tb)
		.removeClass( Object.keys(this.tipos).join(' '))
		.addClass('vista '+this.id)

	this.dom=xd

	this.resize()
	this.tareasPostCarga(desdeHistorial)
	this.tareasPostCargaDinamica()
	this.showMenu()
	}
Vista.prototype.tareasPostCargaDinamica=function(){
	//para implementar dinámicamente
	}
Vista.prototype.show=function(desdeHistorial){
	jQuery('body > .navbar-fixed, body > .navbar-fixed > #navigation_bar').show()
	jQuery('body').removeClass('nooverflow')

	app.trackView(this.id)
	this.cambiaTextoHeaderGlobal(this.title)

	jQuery('#main_container .aside-md')
		.removeClass( Object.keys(this.tipos).join(' '))
		.addClass('vista '+this.id)

	app.muestraNodoEnNavDrawer('li'+this.id.slice(0,1).toUpperCase()+this.id.slice(1))

	if (this.dom==null)
		this.toDOM()
	else {
		var xd=jQuery('#content')
		xd.find('.vista').hide()
		this.domCont.show()
		this.domBody.show()
		}

	app.vistaActiva=this

	jQuery('.navbar-fixed').find('.vista-header').hide()
	this.domHeader.show()

	this.showMenu()
	}
Vista.prototype.showMenu=function(){
	// console.log(' >> showMenu')
	this.domMenu.show()
	}
Vista.prototype.getHeader=function(){}
Vista.prototype.getBody=function(){}
Vista.prototype.resize=function(){
	this.hVista=window.innerHeight- jQuery('#navigation_bar').innerHeight()
	jQuery('#content').height( this.hVista )
	if (this.domBody) 
		this.domBody.height( this.hVista- (this.domHeader?this.domHeader.outerHeight():0) )
	}
Vista.prototype.tareasPostCarga=function(){}
Vista.prototype.disinflateMenu=function(){
	jQuery('.barra.vista .btn-group.btn-menu').find('.btn-menu').removeClass('hidden')
	jQuery('.barra.vista .btn-group.btn-menu').find('.btn-button').remove()
	}
Vista.prototype.inflateMenu=function(){}
Vista.prototype.backButton=function(){
	if (app.vistaActiva instanceof VistaRepasoTest)
		this.show()
	else if (app.vistaActiva instanceof VistaTest){
		//pass
		}
	else if (app.vistaActiva!=this){
		this.show()
		}
	}
// Vista.prototype.pushReceived=function(accion, datos){
// 	if (accion=='mensajeGrupo'){
// 		app.clearNotification()
// 		app.sendNotification('Mensaje de '+datos.cd_usuario, datos.msg, null, null, datos, fnOnClickNotification)
// 		}
// 	}
Vista.prototype.cerrar=function(){}
Vista.prototype.cambiaTextoHeaderGlobal=function(t){
	jQuery('#navigation_bar')
		.find('.barra.global .navbar-brand').text(t)

	}
Vista.prototype.btnAbrirNavegadorExterno=function(url){
	window.open(url, '_system')
	}
Vista.prototype.admonition=function(titulo, texto, icono, subtexto){
	return creaObjProp('div', {	className:'admonition row s12', 
								
								hijos:[
									creaObjProp('i', {className:'mdx col s2 m1 offset-m2 left icono', texto:icono}),
									creaObjProp('div', {className:'col s9 m5', hijos:[
														creaObjProp('span', {className:'tit', texto:titulo}),
									   					creaObjProp('span', {className:'des', texto:texto }),
									   					creaObjProp('span', {className:'sub', texto:subtexto }),
									   					]})
									] })	
	}
Vista.prototype.concatCategoriasTest=function(test){
	var ret=''
	var t=test.liscat.split(',').reverse()
	for (var i=0; i<t.length; i++){
		// if (Number(t[i])<0) continue;

		var cat=this.getCat(t[i])
		if (cat) 
			ret=ret+', '+cat.ds_categoria
		}
	return ret.substring(2)
	}
Vista.prototype.inicio=function(fromHistory){}
Vista.prototype.onSlideChangeStart=function(){
	var g=this.gallery

	this.diapoActiva=this.domBody.find('.swiper-slide-active').data('cd-pregunta')

	if (this instanceof VistaTest){
		var p=this.diapoActiva

		for (var i=1; i<3; i++) {
			var page = p+i
			if (page>=this.numPaginas)
				continue
			this.fnCreaSlide(page, true)
			}

		for (var i=1; i<4; i++) {
			var page = p-i
			if (page<=0 ) continue

			this.fnCreaSlide(page, false)
			}

		this.borraRestoSlides(p)
		}
	this.indicaPreguntaActivaEnMarcador(this.diapoActiva)
	}
Vista.prototype.fnCreaSlide=function(page, append){
	this.creaSlide(page, append)
	}
Vista.prototype.creaSlide=function(page, append){
	var self=this
	var ss=jQuery('.swiper-slide#slide'+page)
	
	if (ss.find('.pregunta').length==0 && page>=0 && page<=this.numPaginas-1){

		// console.log('generando diapo '+page)
		self.creaContenidoSlide(page, ss)
		}
	}
Vista.prototype.borraRestoSlides=function(ini){
	var lim=4

	this.diapoActiva=this.domBody.find('.swiper-slide-active').data('cd-pregunta')
	var slides=this.domBody.find('.swiper-slide')
	for (var i=slides.length-1; i>=0; i--){
		var j=jQuery(slides[i])
		var cd_pregunta=j.data('cd-pregunta')

		if (cd_pregunta==null || cd_pregunta==0)
			continue
		else if (Math.abs(cd_pregunta-this.diapoActiva)<6 )
			continue
		
		j.empty()
		}
	}
Vista.prototype.slideTo=function(page){
	var self=this
	if (self instanceof VistaTest){
		self.creaSlide(page, page>self.diapoActiva)

		this.diapoActiva=page
		self.gallery.slideTo(page)
		self.indicaPreguntaActivaEnMarcador(page)
		
		self.borraRestoSlides(page)

		self.creaSlide(page-1, false)
		self.creaSlide(page-2, false)
			
		self.creaSlide(page+1, true)
		self.creaSlide(page+2, true)	
		}
	}
Vista.prototype.initSwype=function(cont, numPaginas, conPortada){
	this.numPaginas=numPaginas
	// Load initial data
	var page, maxPages=6
	for (var i=0; i<numPaginas; i++) {
		var ss=creaObjProp('div', {className:'swiper-slide', 'id':'slide'+i})
		jQuery(cont).find('.swiper-wrapper').append(ss)
		}

	for (var i=0; i<Math.min(numPaginas, maxPages); i++) {
		var ss=jQuery(cont).find('.swiper-slide#slide'+i)
		this.creaContenidoSlide(i, ss )
		}

	var self=this
	this.gallery=new Swiper(cont, {
		loop:false,
		onSlideChangeStart:function(){self.onSlideChangeStart()},
		threshold:4, //era: 5
		speed:300,//default:300
		// slidesPerView: 4,
  		// centeredSlides: true,
		})
	}
Vista.prototype.toggleMenuGlobal=function(visible, inmediate){
	var menu=jQuery('.barra.global .btn-menu')	
	
	if (visible)
		menu.fadeIn()
	else 
		menu.fadeOut()
	}
Vista.prototype.cerrar=function(){}
/////
Vista.prototype.scrollTop=function(){
	this.scrollTo(0)
	}
Vista.prototype.scrollBottom=function(){
	this.scrollTo(3000)
	}
Vista.prototype.scrollTo=function(top, t){
	jQuery('html, body').animate({scrollTop: top}, t || 10)
	}
/////
Vista.prototype.actualizaOcurrenciasTest=function(nuevoTest){
	var idx=getIndiceFila(app.cache.testTienda, {cd_test:nuevoTest.cd_test}, true)
	if (idx.length){
		for (var i=0; i<idx.length; i++){
			app.cache.testTienda[idx[i]]=nuevoTest
			}
		}

	var idx=getIndiceFila(app.cache.testLocales, {cd_test:nuevoTest.cd_test}, true)
	if (idx>-1){
		if (idx.length){
			for (var i=0; i<idx.length; i++){
				app.cache.testLocales[idx[i]]=nuevoTest
				}
			}
		this.salvaTestLocales()
		}

	}
Vista.prototype.actualizaRestoVistas=function(operacion, test){
	this._actualizaRestoVistas_aux('mod', test, app.vistaTienda)
	// this._actualizaRestoVistas_aux(operacion, test, app.vistaMisTest)
	if (app.vistaMisTest) app.vistaMisTest.pintaPortadaTienda() //quitar admonition y demás
	if (app.vistaDetalleTest) app.vistaDetalleTest.currTest=null
	}
Vista.prototype._actualizaRestoVistas_aux=function(operacion, test, vista){
	if (vista==null || vista.domBody==null) return

	var cards=vista.domBody.find('.test[data-id='+test.cd_test+']')
	for (var i=0; i<cards.length; i++){
		var card=jQuery(cards[i])

		var cd_categoria=card.closest('.bloque.cat').data('id')

		if (operacion=='mod'){
			var cat=this.getCat(cd_categoria)
			card.replaceWith(
				vista._generaDomTest(test, null, cat)
				)
			}
		else if (operacion=='del'){
			card.remove()
			}
		}

	if (operacion=='add'){
		var card=vista.domBody.find('.test')[0]

		var cd_categoria=test.liscat.split(',')[1]
		var cat=this.getCat(cd_categoria)

		var nc=vista._generaDomTest(test, null, cat)
		if (card)
			jQuery(card).insertBefore(nc)
		}
	}
/////
Vista.prototype.precioMinimo=function(p){
	if (device.platform.toLowerCase() == 'android'){
		if (p>0 && p<0.50)//precio mínimo Android
	 		p=0.50
		}
	else if (device.platform.toLowerCase() == 'ios') {
	 	p=0.99
		}
	else //web
		p=0.99

	return p
	}
Vista.prototype.precioPlat=function(fila){
	if (device.platform.toLowerCase() == 'android'){
		return fila.precio_android || this.precioMinimo(fila.precio)
		}
	else if (device.platform.toLowerCase() == 'ios') {
	 	return fila.precio_ios || this.precioMinimo(fila.precio)
		}
	else //web
		return fila.precio_ios || this.precioMinimo(fila.precio)
	}
Vista.prototype.getImagen=function(cat){
	var m=cat.i

	if (cat.i=='cat-0.jpg' || cat.i=='cat--1.jpg' || cat.i=='cat--2.jpg' )
		return './images/cats/'+m
	else if (app.offline)
		return './images/cats/cat-0.jpg'
	
	return app.config.catBase+m
	}
Vista.prototype.getImagenMini=function(cat){
	var i=cat.i
	var m=i.replace('.jpg', 'm.jpg')
	
	if (cat.i=='cat-0.jpg' || cat.i=='cat--1.jpg' || cat.i=='cat--2.jpg' )
		return './images/cats/'+m
	else if (app.offline)
		return './images/cats/cat-0m.jpg'

	return app.config.catBase+m
	}
Vista.prototype.seDebeMostrarTest=function(test){
	if (test.precio>0){
		if (device.platform=='Android' && test.iap_android==null){
			console.log('OJO, hay un test con precio>0 pero sin ID_Compra_Android: no se mostrará. ID='+test.cd_test)
			return false
			}
		else if (device.platform=='iOS' && test.iap_ios==null){
			console.log('OJO, hay un test con precio>0 pero sin ID_Compra_iOS: no se mostrará. ID='+test.cd_test)
			return false
			}
		else if (device.platform=='web' && test.iap_android==null){
			console.log('OJO, hay un test con precio>0 pero sin ID_Compra_Android: no se mostrará. ID='+test.cd_test)
			return false
			}
		}
	return true
	}
Vista.prototype._generaDomTest=function(test, j, cat){
	var self=this
	var infoTienda=[], loTengo=false, domPrecio, onclick, dFecha=creaT(''), resp

	var seDebeMostrar=this.seDebeMostrarTest(test)
	
	if (!app.isLocalHost && !seDebeMostrar)
		return null

	if (this instanceof VistaMisTest){
		loTengo=true

		var notaTest='', i
		var respTodas=buscaFilas(app.cache.respuestasLocales, {cd_test:test.cd_test})
		if (respTodas)
			resp=respTodas[0]
		
		if (test.muestraGratis){
			notaTest='Muestra gratis'
			i='pageview'
			}
		else if (resp==null){
			notaTest='No realizado'
			i='new_releases'
			}
		else {
			if (!resp.finalizado){
				notaTest='No finalizado'
				i='pause_circle_filled'
				}
			else if (resp.nota>5){
				notaTest='Aprobado ('+resp.nota+')'
				i='thumb_up'
				}
			else {
				notaTest='Suspendido ('+resp.nota+')'
				i='thumb_down'
				}
			}

		infoTienda=[
			creaObjProp('span', {className:'col s11 notaTest', texto:notaTest}),
			creaObjProp('span', {className:'col s1 loTengo', mi:i }),
			]

		var uo=( (resp && resp.fecha)? resp.fecha: test.fu_modificacion)

		// var f=formato.fechaComps(uo)
		// if (f){
		// 	dFecha=creaObjProp('span', {className:'fecha pull-right bl hidden', hijos:[
		// 		creaObjProp('span', {className:'bl dia', texto:f.dia}),
		// 		creaObjProp('span', {className:'bl mes', texto:f.mesl}),
		// 		]})
		// 	}
		}
	else {
		var comprado=test.lotengo
		loTengo=buscaFilas(app.cache.testLocales, {cd_test:test.cd_test}).length
		var muestraGratis=buscaFilas(app.cache.testLocales, {cd_test:test.cd_test, muestraGratis:true}).length

		if (comprado || loTengo){
			
			if (test.precio>0 && test.lotengo){
				var texto=(test.muestraGratis || muestraGratis)?'MUESTRA GRATIS':'COMPRADO'
				
				domPrecio=creaObjProp('span', {className:'col s8 precio', texto:texto})	
			}
			else if (loTengo){
				if (test.muestraGratis || muestraGratis)
					domPrecio=creaObjProp('span', {className:'col s8 loTengo muestraGratis', texto:'MUESTRA GRATIS'})
				else
					domPrecio=creaObjProp('span', {className:'col s8 loTengo', texto:'INSTALADO'})
				}
			else 
				domPrecio=creaObjProp('span', {className:'col s8 precio', texto:'DESCARGAR'})
			}
		else {
			domPrecio=creaObjProp('span', {className:'col s8 precio'})
			this._formatoPrecio(domPrecio, test)
			}
		
		infoTienda=[
			creaObjProp('span', {className:'col s4 love', hijo:creaObjProp('span', {texto:test.likes}), mi:(test.likes>0?'favorite':'favorite_border') }),
			domPrecio,
			]
		}

	var self=this
	var temp=test.liscat.split(',')[1]
	var xcat=this.getCat(temp) || cat

	onclick=function(){self.testPreview(test, xcat)}

	var enMiColeccion= (comprado || loTengo)?' en-mi-coleccion':''

	// var xds=(test.anho?test.anho+', ':'')+test.ds_test+ (test.organismo?', '+test.organismo:'')
	var xds=test.ds_test
	if (xds.length>52)
		xds=xds.substr(0,49)+'...'


	var img=creaObjProp('img', {src:'./images/cats/cat-transparentm.jpg', onerror:function(evt){
																	evt.srcElement.src='./images/cats/cat-0m.jpg'
																	}})
	var cajaTest=creaObjProp('div', {onclick:onclick, id:'test-'+test.cd_test, 'data-id':test.cd_test, className:'card test col s6 m4 l2 margin1 '+enMiColeccion+ (!seDebeMostrar?' atenuada':''), hijos:[
			creaObjProp('div', {className:'card-image', hijos:[
				img,
				creaObjProp('span',{className:'card-title debug', texto: (test.cd_test)}),
				creaObjProp('span',{className:'card-title', texto: xds})
				]}),

			creaObjProp('div', {className:'card-content row', hijos:infoTienda}),
			]})

	
	self.sImagen(img, xcat)
	
	return cajaTest
	}
Vista.prototype.sImagen=function(img, xcat){
	var self=this
	setTimeout(
		function(){
			img.src=self.getImagenMini(xcat)
			}, 
		100
		)
	}
Vista.prototype._generaCajitas=function(pack, cuantas){
	var cajitas=[]
	for (var i=0; i<Math.min(4, cuantas); i++){
		cajitas.push( 
			creaObjProp('img', {className:'card pack-item', src:this.getImagenMini(pack),  onerror:function(evt){
																	evt.srcElement.src='./images/cats/cat-0m.jpg'
																	}}) 
			)
		}
	return cajitas
	}
Vista.prototype._generaDomPack=function(pack, j, cat){
	var self=this
	
	var onclick=function(){self.ampliaPack(pack)}

	var numtest=pack.numtestsporcat//>0?pack.numtestsporcat:''//'Colección de test'
	var cajitas=[]
	if (numtest==0){
		//console.info('xx')
		var subpack=buscaFilas(app.cache.categorias, {cd_categoriapadre:pack.cd_categoria})[0]
		if (subpack==null) return null
		numtest=subpack.numtestsporcat

		if (numtest>0){//tiene tests
			cajitas=this._generaCajitas(pack, numtest)
			}
		else {
			//packs tal vez?
			var lisSubPack=buscaFilas(app.cache.categorias, {cd_categoriapadre:pack.cd_categoria})
			if (lisSubPack.length){
				for (var i=0; i<Math.min(4, lisSubPack.length); i++){
					//una imagen distinta para cada cajita!!
					var xpack=lisSubPack[i]
					cajitas.push( 
						creaObjProp('img', {className:'card pack-item', src:this.getImagenMini(xpack),  onerror:function(evt){
																				evt.srcElement.src='./images/cats/cat-0m.jpg'
																				}}) 
						)
					}
			}

			// for (var j=0; j<lisSubPack.length;j++){
			// 	subpack=lisSubPack[i]
			// 	numtest=subpack.numtestsporcat

			// 	if (numtest==0) continue
			// 	var subsubpack=buscaFilas(app.cache.categorias, {cd_categoriapadre: subpack.cd_categoria})
			// 	numtest=subsubpack.length
			// 	if (numtest==0) return null
				
			// 	}
			}
		}
	else {
		cajitas=this._generaCajitas(pack, numtest)
		}

	var h=[
		creaObjProp('img', {src:'./images/cats/packm.jpg'} ),
		creaObjProp('div', {className:'row cajitas', hijos:cajitas}),
		
		]

	var ret= creaObjProp('div', {onclick:onclick, id:'pack-'+pack.cd_categoria, 'data-id':pack.cd_categoria, className:'card pack col s6 m4 l2 margin1', hijos:[
			creaObjProp('div', {className:'card-image', hijos:h}),
			creaObjProp('div', {className:'card-content row', hijos:[
				creaObjProp('span', {className:'col s12', texto:pack.ds_categoria})
				]}),
			]})
	return ret
	}
Vista.prototype.testPreview=function(test, cat){
	app.cargaVistaDetalleTest(false, test, cat)
	}
Vista.prototype.getCatFromTest=function(test){
	var xcat=test.liscat.split(',')[1]
	return buscaFilas(app.cache.categorias, {cd_categoria:xcat})[0]
	}
Vista.prototype.getCat=function(cd_categoria){
	return buscaFilas(app.cache.categorias, {cd_categoria:cd_categoria})[0]
	}
Vista.prototype.anhadeATestLocales=function(test){
	app.cache.testLocales.push(test)
	this.actualizaRestoVistas('add', test)
	this.salvaTestLocales()
	}
Vista.prototype.salvaTestLocales=function(){
	save('tapp37_listaTest', app.cache.testLocales)
	app.trackEvent('app', 'downloads-count', 'dc='+app.cache.testLocales.length)
	}
Vista.prototype.admonNoHayDatos=function(){
	app.quitaThrobber()
	this.domBody.empty().append(
		this.admonition('No se ha podido conectar con la tienda', 
						'Es posible que haya problemas de conectividad, inténtalo más tarde.', 
						'perm_scan_wifi')
		)
	}
////////////////////////////////////////////////

function VistaFlotante(){
	try{Vista.call(this)}
	catch(e){return}
	}
VistaFlotante.prototype=new Vista
VistaFlotante.prototype.toDOM=function(desdeHistorial){
	if (!app.esTablet){
		Vista.prototype.toDOM.call(this, desdeHistorial)
		return
		}	

	app.trackView(this.id)
	var xd=jQuery('#frmVistaFlotante')//.empty()

	//xd.show().css('top', 0)
	app.cierraNavDrawer()

	xd.find('.vista').addClass('hidden')
	if (app) app.vistaActiva=this

	var tHeader=jQuery(this.getHeader())
	this.domHeader=jQuery(tHeader[tHeader.length-1])
	
	var tb=this.getBody()
	if (tb instanceof Array)
		this.domBody=jQuery(tb[0])
	else
		this.domBody=jQuery(tb)

	
	// xd.find('.vista').hide()

	xd
		.removeClass( Object.keys(this.tipos).join(' '))
		.addClass(this.id)

	this.domCont=jQuery(creaObjProp('section', {'style.height':'100%'}))
	xd.append(this.domCont)
	
	this.domCont
		.append(tHeader)
		.append(tb)
		.removeClass( Object.keys(this.tipos).join(' '))
		.addClass('vista '+this.id)

	this.dom=xd

	this.mostrarDom()

	this.tareasPostCarga(desdeHistorial)

	this.resize()
	}
VistaFlotante.prototype.cerrar=function(){
	var self=this
	jQuery('body > .navbar-fixed, body > .navbar-fixed > #navigation_bar').show()
	jQuery('body').removeClass('nooverflow')
	
	if (this.dom.hasClass('modal')){
		this.dom.closeModal({
			complete:function(){
				jQuery('.lean-overlay').remove() 
				//reseteo la imagen para la siguiente ocasión
				self.domBody.find('.header .portada')[0].src='./images/cats/pack.jpg'
				}
			})
		//jQuery('.lean-overlay').remove() 
			//reseteo la imagen para la siguiente ocasión
		}
	}
VistaFlotante.prototype.mostrarDom=function(){
	var self=this
	//this.dom.removeClass('hidden')
	this.dom.openModal({
		complete:function(){
			jQuery('.lean-overlay').remove() 
			//reseteo la imagen para la siguiente ocasión
			self.domBody.find('.header .portada')[0].src='./images/cats/pack.jpg'
			}
		})
	}
VistaFlotante.prototype.show=function(desdeHistorial){
	if (!app.esTablet){
		Vista.prototype.show.call(this, desdeHistorial)
		jQuery('body > .navbar-fixed, body > .navbar-fixed > #navigation_bar').hide()
		this.resize()
		return	
		}
	this.domHeader.show()
	app.trackView(this.id)
	
	this.dom.find('.vista').addClass('hidden')
	this.dom.find('.'+this.id).removeClass('hidden')

	this.dom
		.removeClass( Object.keys(this.tipos).join(' '))
		.addClass(this.id)

	app.vistaActiva=this
	this.mostrarDom()
	}
VistaFlotante.prototype.tareasPostCarga=function(){
	jQuery('body > .navbar-fixed').hide()
	}
VistaFlotante.prototype.resize=function(){}
////////////////////////////////////////////////
function VistaTourAplicacion(){
	Vista.call(this)
	this.id='vistaTourAplicacion'
	}
VistaTourAplicacion.prototype=new VistaFlotante
VistaTourAplicacion.prototype.showMenu=function(){
	this.domMenu.hide()
	}
VistaTourAplicacion.prototype.resize=function(){
	this.hVista=window.innerHeight
	//jQuery(document).height( this.hVista )
	if (this.domBody) 
		this.domBody.height( this.hVista )

	//console.log('resize',this.hVista)
	}
VistaTourAplicacion.prototype.getBody=function(){
	var self=this

	var raiz=( (isPhone() && device.platform.toLowerCase()=='ios')?'-ios':'-android')
	// 
	this.preguntas=[
		{html:'<b>Bienvenido a Octopus</b>. <br> Si lo deseas, ahora puedes realizar una visita guiada. <br> <small>Desliza el dedo para continuar.</small>', 	img:'./images/m-swipe-left.png', bgcolor:'#65C6BB', fgcolor:'white'},
		{html:'Toca en el icono de la <b>hamburguesa</b> (arriba, izquierda) para desplegar el menú',	img:'./images/tour/tour-1'+raiz+'.png', bgcolor:'#65C6BB', fgcolor:'white'},
		{html:'Localiza algún test en la <b>tienda</b>', 												img:'./images/tour/tour-2'+raiz+'.png', bgcolor:'#65C6BB', fgcolor:'white'},
		{html:'<b>Descarga</b> los test que te interesan', 												img:'./images/tour/tour-3'+raiz+'.png', bgcolor:'#65C6BB', fgcolor:'white'},
		{html:'Si tienes dudas con un test de pago descarga la <b>muestra gratuita</b> para asegurarte',img:'./images/tour/tour-5'+raiz+'.png', bgcolor:'#65C6BB', fgcolor:'white'},
		{html:'Pon a prueba tus conocimientos, ¡cuidado con el <b>tiempo</b>!', 						img:'./images/tour/tour-4'+raiz+'.png', bgcolor:'#65C6BB', fgcolor:'white'},
		//{html:'Comprueba tus <b>progresos</b>', 														img:'./images/tour/tour-4'+raiz+'.png', bgcolor:'#65C6BB', fgcolor:'white'},
		]
	// if (app.esTablet)
	// 	this.preguntas.splice(1,1)

	var puntos=[]
	for (var i=0; i<this.preguntas.length; i++){
		puntos.push( creaObjProp('li', {className:(i==0?'active':'')}) )
		}

	this.btnOmitir=jQuery( creaObjProp('button', {className:'col s3', texto:'OMITIR', onclick:function(){self.clickBtnOmitir()} }) )
	this.ulLista=jQuery(creaObjProp('ul', {className:'col s6 nav', hijos:puntos}))
	this.btnSiguiente= jQuery( creaObjProp('button', {className:'col s3 right btnSiguiente', mi:'chevron_right', onclick:function(){self.clickBtnSiguiente()}}) )

	return [
		creaObjProp('div', {className:'vista-body swiper-container', 'style.maxHeight':jQuery(window).innerHeight()+'px', hijos:[
			creaObjProp('div', {className:'swiper-wrapper'})
			]}),
		creaObjProp('footer', {hijos:[
			creaObjProp('div', {className:'btn-group row margin0', hijos:[
				this.btnOmitir[0],
				this.ulLista[0],
				this.btnSiguiente[0]
				]})
			]})
		]
	}
VistaTourAplicacion.prototype.tareasPostCarga=function(){
	VistaFlotante.prototype.tareasPostCarga.call(this)
	this.initSwype('section.vista.'+this.id+'>.swiper-container', this.preguntas.length)
	app.quitaThrobber()
	app.setStatusBG(this.preguntas[0].bgcolor)

	jQuery('html').addClass(this.id)
	}
VistaTourAplicacion.prototype.cambiaDiapo=function(i, cont){
	if (i>this.preguntas.length) return
	var slide=this.preguntas[i]

	var cnt=jQuery(cont)

	cnt .css('color', slide.fgcolor)
		.css('backgroundColor', slide.bgcolor)
		.find('.slide-t').html(slide.html)

	var img=cnt.find('.slide-img')[0]
	img.src=slide.img
	}
VistaTourAplicacion.prototype.creaContenidoSlide=function(i, cont){
	if (i>=this.preguntas.length) return

	console.log('>>generando diapo '+i)

	var slide=this.preguntas[i]
	jQuery(cont).addClass('row')
		.append( creaObjProp('div', {className:'slide-t col s10 offset-s1', html:slide.html}) )
		.append( creaObjProp('img', {className:'slide-img', src:slide.img}) )
		.css('color', slide.fgcolor)
		.css('backgroundColor', slide.bgcolor)
		.attr('data-cd-pregunta', i)
	}
VistaTourAplicacion.prototype.indicaPreguntaActivaEnMarcador=function(i){
	if (i==this.preguntas.length-1){
		this.btnOmitir.css('opacity', 0)
		this.btnSiguiente.text('LISTO')
		}
	else {
		this.btnOmitir.css('opacity', 1)
		this.btnSiguiente.html(creaObjProp('span', {mi:'chevron_right'}))
		}
	this.ulLista.find('li.active').removeClass('active')
	this.ulLista.find('li:eq('+i+')').addClass('active')
	}
VistaTourAplicacion.prototype.inicio=function(){
	try{
		this.gallery.slideTo(0)
		//app.setStatusBG(this.preguntas[0].bgcolor)
		}
	catch(e){	
		}
	}
VistaTourAplicacion.prototype.clickBtnOmitir=function(){
	var self=this

	this.cerrar()
	
	app.unSetStatusBG()
	jQuery('html').removeClass(this.id)

	save('tapp37_tourRealizado', 1)

	if (app.vistaActiva==null || app.vistaActiva.id==this.id) 
		app.cargaVistaInicio()

	setTimeout(function(){//da problemas al reutilizarla, me la cargo del todo
		self.domBody.closest('.vista').remove()
		app.vistaTourAplicacion=null
		}, 1000) 
	}
VistaTourAplicacion.prototype.clickBtnSiguiente=function(){
	if (this.gallery.activeIndex==this.preguntas.length-1) 
		this.clickBtnOmitir()
	else
		this.gallery.slideNext()
	}
VistaTourAplicacion.prototype.toggleMenuGlobal=function(visible, inmediate){
	var menu=jQuery('.barra.global .btn-menu')	
	menu.fadeOut()
	}
////////////
function VistaTest(test, respuestas, desdeHistorial){
	if (test==null) return
	Vista.call(this)
	this.test=test

	if (this instanceof VistaRepasoTest)
		this.trackEvent('review')
	else if (test.muestraGratis)
		app.trackEvent('muestraGratis', 'launch', test.cd_test+'-'+test.ds_test)
	else
		this.trackEvent('launch')

	this.id='vistaTest'
	this.title=test.ds_test 

	this.mapaInicializado=false

	this.preguntas=this.quitaPortadas(this.test.preguntas) //por si acaso
	this.respuestas=this.quitaPortadas(respuestas? respuestas.respuestas: this.generaObjRespuestas())
	this._paginaActiva=respuestas?respuestas.preguntaActual:0

	this.examen={
		fallosrestan:this.test.fallosrestan,
		minutos:this.test.minutos,
		numpreguntas:this.test.numpreguntas,
		segundosConsumidos:(respuestas?respuestas.segundosConsumidos:0),
		}
	
	this.generaIndices()

	//insertamos la portada y la contraportada
	this.preguntas.splice(0,0, null); this.preguntas.push(null)
	this.respuestas.splice(0,0, null); this.respuestas.push(null)

	if (!desdeHistorial) 
		app.pushState(this.id+':'+this.test.matricula)
	}
VistaTest.prototype=new Vista
VistaTest.prototype.generaObjRespuestas=function(){
	var contestadas=[]
	for (var i=0; i<this.preguntas.length; i++){
		contestadas.push({estrella:false, respuestaUsuario:null})
		}
	return contestadas
	}
VistaTest.prototype.generaIndices=function(){
	for (var i=0; i<this.preguntas.length; i++){
		this.preguntas[i].i=i
		this.respuestas[i].i=i
		}
	}
VistaTest.prototype.getHeader=function(){
	var self=this
	return [
		creaObjProp('ul', {className:'dropdown-content', id:'mapatest'}),
		creaObjProp('nav', {className:'vista-header marcadores '+this.id, hijos:[
			creaObjProp('div', {className:'nav-wrapper row padding0', hijos:[
				creaObjProp('ul', {className:'left col s12 row ', hijos:[
					creaObjProp('li', {className:'col s6 btnNormal',hijos:[
						creaObjProp('a', {onclick:function(){self.pausaTiempo()}, mi:'close', hijos:[
							creaObjProp('span', {hijos:[
								creaObjProp('span', {id:'tiempoConsumido', texto:this.convierteSegundosAHora(this.examen.segundosConsumidos)}),
								creaT(' de '+this.convierteMinutosAHora(this.examen.minutos)),
								]}),
							] }),
						]}),
					creaObjProp('li', {className:'col s6 btnNormal', hijos:[
						creaObjProp('a', {className:'padding0 dropdown-button', id:'mapatest-trigger', 'data-activates':'mapatest', hijos:[
							creaT(' Preg '),
							creaObjProp('span', {id:'numPag', texto:1}),
							creaT(' de '+this.examen.numpreguntas+' '), 
							creaObjProp('i', {className:'mdx', texto:'arrow_drop_down'})
							] }),
						]}),
					
					creaObjProp('li', {className:'col s12 btnMuestraGratis',hijos:[
						creaObjProp('a', {mi:'close', onclick:function(){self.finExamen()}, texto:'Finalizar la previsualización' }),
						]})
					]}),
				]}),
			]})
		]
	}
VistaTest.prototype.getBody=function(){
	return creaObjProp('div', {className:'vista-body swiper-container', hijos:[
			creaObjProp('div', {className:'swiper-wrapper'})
			]})
	}
VistaTest.prototype.toDOM=function(){
	//reciclamos el dom que hay
	jQuery('.vista.vistaTest, .vista-header.vistaTest').remove()
	VistaFlotante.prototype.toDOM.call(this)
	}
VistaTest.prototype.ajustaDragTarget=function(reducir){
	//reducimos el ancho del drag-target
	var d=jQuery('.drag-target')

	d.css('margin-left', reducir?-20:0)
	}
VistaTest.prototype.tareasPostCarga=function(){
	jQuery('body > .navbar-fixed > #navigation_bar').hide()
	this.ajustaDragTarget(true)

	this.initMapa()
	this.iniciaTiempo()
	
	var id='.vista.'+this.id.split(' ').join('.')+'>.swiper-container'
	this.initSwype(id, this.preguntas.length, true)
	jQuery(this.dom).addClass('noselect')

	//ojo, la 0 es la portada y la última la contraportada
	// var xpregActiva=(this.examen.preguntaActiva) || 1
	// this.slideTo(xpregActiva)

	this.inflateMenu()

	var self=this
	app.jwerty('←', function(){self.tecladoDiapoAnterior()})
	app.jwerty('→', function(){self.tecladoDiapoSiguiente()})

	this.recuperaUltimaPaginaActiva()
	}
VistaTest.prototype.recuperaUltimaPaginaActiva=function(){
	if (this._paginaActiva){
		this.goToPage(this._paginaActiva+1)
		this._paginaActiva=null
		}
	}
VistaTest.prototype.tecladoDiapoAnterior=function(){
	// console.log('←')
	
	this.diapoActiva--
	if (this.diapoActiva<=0)
		this.diapoActiva=0
	this.gallery.slidePrev(true)
	}
VistaTest.prototype.tecladoDiapoSiguiente=function(){
	// console.log('→')

	this.diapoActiva++
	if (this.diapoActiva>=this.numPaginas)
		this.diapoActiva=this.numPaginas
	this.gallery.slideNext(true)
	}
VistaTest.prototype.informarErrorPregunta=function(){
	this.frmdom.addClass('error')
	}
VistaTest.prototype.btnInformarErrorPregunta=function(motivo){
	if (this.preg){
		this.doInformarErrorPregunta(this.test.cd_test, this.preg.i, motivo)
		app.trackEvent('question', 'err', this.test.cd_test+':'+this.preg.i+':'+this.preg.texto)
		}
	jQuery('#frmInformarError').closeModal()
	this.btnContinuarTest()
	}
VistaTest.prototype.doInformarErrorPregunta=function(cd_test, cd_pregunta, msg){
	msg=msg || 'Sin especificar'
	app.post({accion:'informarErrorPregunta', 
								cd_device:device.uuid,
								cd_test:cd_test, 
								cd_pregunta:cd_pregunta, 
								msg:msg},
		function(data){
			app.vistaMedallero.nuevoLogro('varios_corrector')
			app.showToast('¡Gracias! La revisaremos en cuanto sea posible')
			})
	}
VistaTest.prototype.toggleMenuGlobal=function(visible, inmediate){
	var menu=jQuery('.barra.global .btn-menu')	
	menu.fadeOut()
	}
//////
VistaTest.prototype.cambiaDiapo=function(i, cont){
	this.creaContenidoSlide(i,cont)
	}
VistaTest.prototype.creaContenidoSlide=function(i, cont){
	if (i==0 || i>=(this.preguntas.length-1) ){

		var texto
		if (this.test.muestraGratis)
			texto= (i==0?'Inicio de la muestra gratuita':'Fin de la muestra gratuita')
		else
			texto= (i==0?'Inicio':'Fin')

		jQuery(cont).empty().addClass('portada '+(i==0?'inicio':'fin')).append( [
			creaObjProp('span', {texto:texto}),
			creaObjProp('div', {className:'visual'})
			])
			.attr('data-cd-pregunta', i)
		// console.info('> crea portada, cont '+cont.id)
		}
	else {
		var preg=this.preguntas[i] //la 0 es la portada
		var resp=this.respuestas[i]

		jQuery(cont).removeClass('portada inicio fin').empty()
			.append (creaObjProp('div', {'style.height':this.hFija/2, 
										className:'pregunta noselect '+this.getClassPregMapa(preg, resp), 
										hijo:this.generaDomPreguntas(preg, resp)}) )
			.append (creaObjProp('footer', {'style.height':this.hFija/2, 
											className:'footer respuestas noselect', 
											hijo:this.generaDomRespuestas(preg, resp)}) )
			.attr('data-cd-pregunta', i)

			// console.info('> crea diapo '+i+', cont '+cont.id)

		}
	}
VistaTest.prototype.generaDomPreguntas=function(preg, resp){
	var self=this
	
	var t=creaT('')
	if (preg.img){
		// t=creaObjProp('div', {className:'recurso pre', 'style.backgroundImage':'url(./res/carne-conducir/'+preg.img+')'})
		t=creaObjProp('div', {className:'recurso pre row', hijos:[
				// creaObjProp('span', {className:'aviso', texto:'Toca la imagen para ampliar'}),
				] })
		var temp=preg.img.split(',')	
		for (var i=0; i<temp.length; i++){

			t.appendChild( 
				creaObjProp('img', {className:'img-thumbnail col s10', 
									src:app.config.imgBase+temp[i].trim(),
									onclick:this.fnAmpliarImg(temp[i].trim())
								})

				)
			}

		}

	return creaObjProp('table',{hijos:[
				creaObjProp('tr', {hijos:[
					creaObjProp('td', {className:'clave', onclick:function(){self.toggleEstrella(this)}, mi:(resp.estrella?'star':'star_border')}),
					creaObjProp('td', {className:'valor', hijos:[
						creaObjProp('span', {className:'texto pre', html:(preg.i+1)+'-'+preg.pregunta}),
						t
						]}),
					]})
				]})
	}
VistaTest.prototype.generaDomRespuestas=function(preg, resp){
	var self=this
	var xr=[], letras='ABCDE'
	for (var i=0; i<preg.respuestas.length; i++){
		var opcion=preg.respuestas[i]
		if (opcion.texto==null || opcion.texto=='') 
			continue

		var hijos=[creaObjProp('p', {html:opcion.texto})]

		var estilos=this.getEstilosDomRespuestas(preg, resp, i)
		xr.push( creaObjProp('tr', {onclick:function(){self.marcaResp(this)}, hijos:[
			creaObjProp('td', {className:'clave '+ estilos[0], texto:letras.substr(i,1) }),
			creaObjProp('td', {className:'valor '+estilos[1], hijos:hijos }),
			]}))
		}
	if (this instanceof VistaRepasoTest){
		}
	else if (resp.respuestaUsuario!=null){
		jQuery(xr).addClass('atenuada')
		jQuery(xr[resp.respuestaUsuario]).removeClass('atenuada').addClass('active')
		}
	return creaObjProp('table', {hijos:xr})
	}
VistaTest.prototype.getEstilosDomRespuestas=function(preg, resp, i){
	var estilos=['bg-danger', 'bg-warning', 'bg-success', 'bg-info', 'bg-dark']
	return [estilos[i], '']
	}
VistaTest.prototype.fnAmpliarImg=function(ruta){
	return function(){
		var frm=jQuery('#frmImgAmpliada')
		var img=frm.find('img')[0]
		img.src=app.config.imgBase+ruta
		frm.openModal()
		}
	}
VistaTest.prototype.cerrarAmpliarImg=function(){
	jQuery('#frmImgAmpliada').closeModal()
	}
VistaTest.prototype.abrirNavegadorExterno=function(){
	var img=jQuery('#frmImgAmpliada img')[0]
	this.btnAbrirNavegadorExterno(img.src)
	}
VistaTest.prototype.ampliarImg=function(ruta){}
//////
VistaTest.prototype.convierteSegundosAHora=function(numSegundos){
	return this.convierteMinutosAHora(numSegundos/60)
	}
VistaTest.prototype.convierteMinutosAHora=function(numMinutos){
	return Math.floor(numMinutos/60)+':'+ lpad( Math.floor(numMinutos) % 60, '0', 2)
	}
//////
VistaTest.prototype.initMapa=function(){
	app.quitaThrobber()
	if (this.test.muestraGratis){ //modificamos botonera
		this.domHeader.find('.col.btnNormal').hide()
		this.domHeader.find('.col.btnMuestraGratis').show()
		}
	else {
		this.domHeader.find('.col.btnNormal').show()
		this.domHeader.find('.col.btnMuestraGratis').hide()
		}

	this.mapaInicializado=true
	var elPorFila=10

	// var numfilas=Math.floor(this.preguntas.length/elPorFila)
	var col=0,ul=[]
	
	//no reflejamos portada ni contraportada
	for (var i=1; i<this.respuestas.length-1; i++){
		var preg=this.preguntas[i]
		var resp=this.respuestas[i]

		var hijo
		if (resp.estrella)
			hijo=this.generaDomEstrella(i)
		else {
			if (i==0)
				throw ErrorSeVaAPoner0EnMapa
			hijo=creaObjProp('span', {texto:i})
			}

		var self=this
		ul.push( creaObjProp('li', {
							className:'col s1_10 liMapaTest '+this.getClassPregMapa(preg, resp), 
							id:'mapa_preg'+resp.i, 
							hijo:hijo, 
							onclick:function(){
								var xthis=jQuery(this)
								
								//cuando tiene estrella
								var t=xthis.find('.stack-text').text()
								if (t=='') t=xthis.text()
							
								var n=Number(t)

								self.slideTo(n)
							} }) ) 
		}

	jQuery('#mapatest').append(ul)
	jQuery('#mapatest-trigger').dropdown({constrain_width:false, belowOrigin:true})
	}
VistaTest.prototype.getClassPregMapa=function(preg, resp){
	return (resp.respuestaUsuario!=null? 'contestada':'')
	}
VistaTest.prototype.actualizaMapa=function(preg, resp){
	var td=jQuery('#mapa_preg'+resp.i)
	td.toggleClass('contestada', resp.respuestaUsuario!=null)

	td.empty()
	if (resp.estrella)
		td.append(this.generaDomEstrella(resp.i+1))
	else 
		td.append(creaObjProp('span', {texto:resp.i+1}))
	}
VistaTest.prototype.indicaPreguntaActivaEnMarcador=function(i){
	// console.log('pág >>'+i)

	this.preg=this.preguntas[i]
	this.resp=this.respuestas[i] //aquí no se usan, pero se establecen globalmente

	jQuery('#mapatest li').removeClass('active')
	jQuery('#mapa_preg'+(i-1) ).addClass('active')
	var np=i
	if (np==0)
		np=1
	else if (np==this.preguntas.length-1)
		np=this.preguntas.length-2

	jQuery('#numPag').text(np)
	}
VistaTest.prototype.goToPage=function(n){
	this.indicaPreguntaActivaEnMarcador(n)
	this.slideTo(n) 
	}
VistaTest.prototype.generaDomEstrella=function(i){
	return creaObjProp('span', {className:'fa-stack', mi:'star', hijos:[
				creaObjProp('span', {className:'fa-stack-1x stack-text', texto:i})
				]})
	}
VistaTest.prototype.toggleEstrella=function(celda){
	console.log('estrella >>'+this.preg.i)

	if (this.resp.estrella==null)
		this.resp.estrella=false
	this.resp.estrella=!this.resp.estrella

	var xcelda=jQuery(celda).find('i')
	if (this.resp.estrella){
		xcelda.text('star')
		app.trackEvent('question', 'star', this.test.cd_test+':'+this.preg.i)
		}
	else
		xcelda.text('star_border')

	this.actualizaMapa(this.preg, this.resp)
	}
VistaTest.prototype.marcaResp=function(fila){
	var xfila=jQuery(fila)
	var xfilas=xfila.closest('table').find('tr')

	if (xfila.hasClass('active')){
		xfilas.removeClass('active atenuada')
		this.resp.respuestaUsuario=null
		}
	else {
		xfilas.removeClass('active').addClass('atenuada')
		xfila.addClass('active').removeClass('atenuada')
		this.resp.respuestaUsuario=xfilas.index(fila)
		}

	this.actualizaMapa(this.preg, this.resp)

	if (xfila.hasClass('active') && app.cache.pasarPaginaAuto){
		this.gallery.slideNext()
		}

	}
//////
VistaTest.prototype.trackEvent=function(accion){
	app.trackEvent('test', accion, this.test.cd_test+'-'+this.test.ds_test)
	}
//////
VistaTest.prototype.tiempoAcabado=function(){
	this.frmdom=jQuery('.modal#frmTiempoTerminado')
	this.frmdom.openModal({dismissible:false,})
	}
VistaTest.prototype.pausarYSalir=function(){
	this.finExamen()
	this.trackEvent('pause')
	}
VistaTest.prototype.finExamen=function(){
	if (this.test.muestraGratis){
		app.trackEvent('muestraGratis', 'stop', this.test.cd_test+'-'+this.test.ds_test)
		this.cerrar()
		}
	else {
		this.trackEvent('stop')
		this.frmdom.closeModal()
		this.cerrar()
		}
	this.ajustaDragTarget(false)

	//quito del stack de navegación las fases del test
	for (var i=app.nav.length; i--; i>=0){
		if (app.nav[i].vista==this.id)
			app.popFromNav()
		else
			break
		}

	var s=app.getLastFromNav()
	
	this.actualizaRestoVistas('mod', this.test)

	if (app.vistaDetalleTest)	
		app.vistaDetalleTest.show(true, app.vistaDetalleTest.test, app.vistaDetalleTest.cat)
	else
		app.cargaVistaDetalleTest(true, ':'+this.test.matricula)
	}
VistaTest.prototype.guardaEstadoExamen=function(finalizado){
	if (finalizado==undefined)
		finalizado=false
	
	var respuestas=this.quitaPortadas(this.respuestas)

	app.cache.respuestasLocales=app.getRespuestasLocales()
	var idx=getIndiceFila(app.cache.respuestasLocales, {cd_test:this.test.cd_test}), resp
	
	var puntosYaConcedidos=false
	if (idx>-1){
		puntosYaConcedidos=app.cache.respuestasLocales[idx].puntosYaConcedidos
	}

	var nel={
		cd_test:this.test.cd_test, 
		respuestas:respuestas, 
		segundosConsumidos:this.examen.segundosConsumidos,
		finalizado:finalizado,
		preguntaActual:(this.preg?this.preg.i:0),
		fecha:new Date().toGMTString(),
		sincronizado:false
		}

	if (finalizado){
		var corregido=this.corrigeTest()
		
		nel.aciertos=corregido.aciertos
		nel.fallos=corregido.fallos
		nel.nc=corregido.nc
		
		nel.nota=corregido.nota
		nel.liscat=this.test.liscat

		if (nel.nota>5 && !puntosYaConcedidos){
			app.vistaMedallero.enviaPuntuacion(nel.nota, this.getCatFromTest(this.test) )
			nel.puntosYaConcedidos=true
			}
		}
	
	//estas estadísticas también son interesantes en finalizdos
	var stats=this.generaEstadisticasPausa()
	nel.minutosPorcentaje=stats.minutosPorcentaje
	nel.respondidasPorcentaje=stats.respondidasPorcentaje

	nel.noRespondidas = stats.noRespondidas
	nel.preguntas = stats.preguntas
	nel.minutosConsumidos = stats.minutosConsumidos
	nel.minutosTotal = stats.minutosTotal
	nel.respondidas = stats.respondidas
	
	if (idx==-1)
		app.cache.respuestasLocales.push(nel)
	else 
		app.cache.respuestasLocales[idx]=nel
		
	save('tapp37_listaTestRespuestas', app.cache.respuestasLocales)
	
	if (finalizado){//de momento no guardamos resultados parciales
		var self=this
		app.post({accion:'guardaResultadosTest', 
					cd_device:device.uuid,
					datos:JSON.stringify(nel), 
					cd_test:this.test.cd_test},
			function(data){
				var datos=xeval(data)
				if (datos.retorno==1){
					var idx=getIndiceFila(app.cache.respuestasLocales, {cd_test:self.test.cd_test})
					app.cache.respuestasLocales[idx].sincronizado=true
					}
				})
		}
	}
VistaTest.prototype.btnContinuarTest=function(){
	console.debug('Continuar')
	this.pausaTiempo()
	this.frmdom.closeModal()

	}
VistaTest.prototype.muestraFormPausa=function(tipo){
	var self=this
	// var stats=this.generaEstadisticasPausa()

	if (tipo=='pausa'){
		this.frmdom=jQuery('.modal#frmPausa').removeClass('error')
		this.frmdom.openModal({dismissible:false,})
		}
	else if (tipo=='fin' || tipo=='fintiempo'){
		var corrige=this.corrigeTest()
		}
	else {
		console.warn('Tipo de form desconocido!'+tipo)
		return
		}

	app.addToNav({vista:this.id, accion:'frmPausa'})
	}
VistaTest.prototype.btnFrmPausa_Play=function(){
	this.btnContinuarTest()
	}
VistaTest.prototype.btnFrmPausa_Pausa=function(){
	this.pausarYSalir()
	
	if (app.config.showAdAtTestPause)
		app.showAd()
	}
VistaTest.prototype.btnFrmPausa_Stop=function(){
	this.frmdom.closeModal()
	this.guardaEstadoExamen(true)
	this.finExamen()

	if (app.config.showAdAtTestFinish)
		app.showAd()
	}
VistaTest.prototype.quitaPortadas=function(arr){
	if (arr[0]==null)
	 	return arr.slice(1, arr.length-1)
	return arr
	}
VistaTest.prototype.generaEstadisticasPausa=function(){
	var resp=this.quitaPortadas(this.respuestas)
	var r={
		estrellas: buscaFilas(resp, {estrella:true}).length,
		noRespondidas: buscaFilas(resp, {respuestaUsuario:null}).length,
		preguntas:resp.length,

		minutosConsumidos:Math.floor(this.examen.segundosConsumidos/60),
		minutosTotal:this.examen.minutos
		}
	r.minutosPorcentaje= Math.floor(100*this.examen.segundosConsumidos/(r.minutosTotal*60) )
	r.minutosConsumidos=Math.floor(this.examen.segundosConsumidos/60)
	r.respondidas=r.preguntas-r.noRespondidas
	r.respondidasPorcentaje=Math.floor(100*r.respondidas/r.preguntas)
	return r
	}
VistaTest.prototype.corrigeTest=function(){
	var a=0, f=0, nc=0
	var preguntas=this.quitaPortadas(this.preguntas)
	var respuestas=this.quitaPortadas(this.respuestas)

	for (var i=0; i<preguntas.length; i++){
		var preg=preguntas[i], resp=respuestas[i]

		if (resp.respuestaUsuario==null)
			nc++
		else if (resp.respuestaUsuario==preg.cd_respuestacorrecta)
			a++
		else 
			f++
		}
	var fr=this.test.fallosrestan
	if (fr==null) fr=0

	var tn= (a-(f*fr))/preguntas.length
	if (tn<0) tn=0
	var nota=Math.floor(tn*100)/10

	return {aciertos:a, fallos:f, nc:nc, nota:nota}
	}
//////
VistaTest.prototype.pause=function(){
	if (this.crono)
		this.pausaTiempo()
	}
VistaTest.prototype.refrescoCrono=1000
VistaTest.prototype.iniciaTiempo=function(){
	var self=this
	this.crono=setTimeout(function(){self.tickCrono()}, this.refrescoCrono)

	var difMinutos=(this.examen.minutos-this.examen.segundosConsumidos/60)
	this.examen.horaFinal=new Date( new Date().getTime() + difMinutos*60000)
	// console.info(this.examen.horaFinal)
	}
VistaTest.prototype.pausaTiempo=function(){
	if (this.crono){ //pausamos
		clearTimeout(this.crono)
		this.crono=null

		var sRestantes=(this.examen.horaFinal-new Date())/1000

		this.examen.segundosConsumidos=(this.examen.minutos*60-sRestantes)
		// console.warn('Segundos consumidos:'+this.examen.segundosConsumidos)

		this.examen.horaFinal=null

		this.guardaEstadoExamen(false)
		this.muestraFormPausa('pausa')
		}
	else { //retomamos
		this.iniciaTiempo()
		}
	}
VistaTest.prototype.tickCrono=function(){
	if (this.crono==null){
		console.error('El tiempo debería estar parado')
		return
	}

	var self=this
	this.crono=setTimeout(function(){self.tickCrono()}, this.refrescoCrono)

	var sRestantes=(this.examen.horaFinal-new Date())/1000
	var minRestantes=Math.ceil(sRestantes/60)
	
	if (this.minRestantes==minRestantes){
		// console.log('No hay que actualizar el crono: segRestantes='+sRestantes)
		return
	}
	// console.warn('Actualizo crono: segRestantes='+sRestantes)
	jQuery('#tiempoConsumido').text(this.convierteMinutosAHora(this.examen.minutos-minRestantes))
	
	this.minRestantes=minRestantes

	if (sRestantes<=0){
		this.tiempoAcabado()
		clearTimeout(this.crono)
		this.crono=null
		}
	}
VistaTest.prototype.backButton=function(vTo, vFrom){
	if (app.vistaActiva==this){
		}
	else {
		if (vTo.vista=='vistaRepasoTest')
			this.show(true)
		else //con backButton no se puede volver a un test que hayas cerrado
			return
		}

	if (modalIsVisible('.modal#frmPausa')){
		this.btnFrmPausa_Pausa()
		app.showToast('Test pausado')
		return
		}
	else {
		this.pausaTiempo()
		return
	}

	var mapa=jQuery('ul#mapatest')
	if (mapa.is(':visible')){
		mapa.closest('.open').removeClass('open')
		return
		}

	// var sRestantes=(this.examen.horaFinal-new Date())/1000
	// var segundosConsumidos=(this.examen.minutos*60-sRestantes)
	// if (segundosConsumidos<10) {
	// 	//salimos sin más, ha debido entrar por error
	// 	if (this.returnTo){
	// 		if (this.returnTo.id==this.tipos.vistaTienda){
	// 			var nel=this.returnTo.nav[this.returnTo.nav.length-1]
			
	// 			var nv=new VistaTienda(true, true)
	// 			nv.toDOM()

	// 			nv.nav=this.returnTo.nav
	// 			nv.navegaEl(nel)
	// 			}
	// 		}
	// 	}
	// else 
		this.pausaTiempo()
	}
//////
VistaTest.prototype.testData=function(){
	return {
		md: {
				f_examen:'04/10/2014',
				ds_test:'Pruebas selectivas para el acceso a la condición de Personal Estatutario Fijo (BOCM: 10-09-2012)',
				liscat:'1,2', //1-enfermería, 3-tic

				region:'Comunidad de Madrid',
				organismo:'SaludMadrid/Servicio Madrileño de Salud',
				img:'http://1.bp.blogspot.com/-20rV8pKsdjQ/UJd4Ss6XSII/AAAAAAAAG0c/3Wu9Z25s4_A/s1600/SALUD_MADRID.jpg',
				version:1 //servirá para corregir las erratas y demás
				},
		examen: {
				fallosrestan:.25, //para indicar aquello de que cada 4 fallos resta 1 acierto
				minutos:20,
				numpreguntas:6, //redundante, pero vendrá bien para comprobar la integridad
				segundosConsumidos:30,
				// preguntaActiva:3,
				},
		preguntas:[
				{ 
					// cd_pregunta:0,
					pregunta:'1-¿Cuál de los siguientes estandares de directorios guarda relación con la descripción de servicios de usuario?', 
					img:null,
					cd_respuestacorrecta:3,
					respuestas:[
						{texto:'x.500'},
						{texto:'x.501'},
						{texto:'x.509'},
						{texto:'x.511'},
						],
					respuestaUsuario:1,
				},{ 
					texto:'2-Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD: Indicar cuál de las siguientes afirmaciones es cierta en el ámbito de la LOPD:', 
					img:null,
					respuesta:1,
					respuestas:[
						{texto:'La normativa de protección de datos es aplicable sólo a ficheros automatizados que contengan datos personales de personas físicas'},
						{texto:'La normativa de protección de datos es aplicable tanto a ficheros automatizados como no automatizados que contengan datos de carácter personal'},
						{texto:'La normativa de protección de datos no es aplicable a personas físicas ni jurídicas'},
						{texto:'B y C son ciertas'},
						],
					respuestaUsuario:1,
				},{ 
					texto:'3-Cuál de los siguientes derechos de explotación no precisan la realización o autorización por parte del titular de un programa de ordenador, según la ley española de propiedad intelectual:', 
					img:null,
					cd_respuestacorrecta:1,
					respuestas:[
						{texto:'Reproducción total o parcial'},
						{texto:'La realización de una copia de seguridad'},
						{texto:'Traducción, adaptación o arreglo'},
						{texto:'Cualquier forma de distribución pública'},
						]
				},{ 
					texto:'4-Respecto a la LSSI puede decirse que:', 
					img:null,
					cd_respuestacorrecta:3,
					respuestas:[
						{texto:'Queda prohibido el envío de comunicaciones publicitarias o promocionales por correo electrónico'},
						{texto:'Queda prohibido el envío de comunicaciones publicitarias o promocionales por correo electrónico u otro medio de comunicación electrónica equivalente'},
						{texto:'Queda prohibido el envío de comunicaciones publicitarias o promocionales por correo electrónico u otro medio de comunicación electrónica equivalente que previamente no hubieran sido solicitadas o expresamente autorizadas por los remitentes de las misma'},
						{texto:'Queda prohibido el envío de comunicaciones publicitarias o promocionales por correo electrónico u otro medio de comunicación electrónica equivalente que previamente no hubieran sido solicitadas o expresamente autorizadas por los destinatarios de las misma'},
						]
				},{ 
					texto:'5-¿Cuál de las siguientes no es una distribución de Linux ?', 
					img:null,
					cd_respuestacorrecta:3,
					respuestas:[
						{texto:'Debian'},
						{texto:'Gentoo'},
						{texto:'Max'},
						{texto:'FreeBSD'},
						]
				},{ 
					texto:'6-Dentro del análisis orientado a objetos, la cualidad que se refiere al tiempo durante el cual un objeto permanece accesible en la memoria del ordenador (principal o secundaria), se denomina:', 
					img:null,
					cd_respuestacorrecta:3,
					respuestas:[
						{texto:'Reusabilidad'},
						{texto:'Encapsulación'},
						{texto:'Abstracción'},
						{texto:'Persistencia'},
						],
					estrella:true
				}
			]
		}
	}
////////////////////////////////////////////////

function VistaRepasoTest(test, respuestas, desdeHistorial){
	VistaTest.call(this, test, respuestas, desdeHistorial)
	this.id='vistaTest vistaRepasoTest'
	}
VistaRepasoTest.prototype=new VistaTest
VistaRepasoTest.prototype.recuperaUltimaPaginaActiva=function(){
	this.goToPage(1)
	}
VistaRepasoTest.prototype.pausaTiempo=function(){
	this.cerrar()
	this.ajustaDragTarget(false)

	if (app.vistaDetalleTest)	
		app.vistaDetalleTest.show(true, app.vistaDetalleTest.test, app.vistaDetalleTest.cat)
	else
		app.cargaVistaDetalleTest(true, ':'+this.test.matricula)
	}
VistaRepasoTest.prototype.getClassPregMapa=function(preg, resp){
	if (resp.respuestaUsuario==null)
		return ''
	else if (resp.respuestaUsuario==preg.cd_respuestacorrecta)
		return 'bg-success'
	else
		return 'bg-danger'
	}
VistaRepasoTest.prototype.getEstilosDomRespuestas=function(preg, resp, i){
	// console.log( [resp.respuestaUsuario, preg.cd_respuestacorrecta, i] )
	var estilos=['bg-default', 'bg-warning', 'bg-success', 'bg-info', 'bg-primary']
	
	if (resp.respuestaUsuario==null && preg.cd_respuestacorrecta==i)
		return ['bg-noanswer', 'bg-noanswer']
	else if (preg.cd_respuestacorrecta==i)
		return ['bg-success', 'bg-success']
	else if (resp.respuestaUsuario==i)
		return ['bg-danger', 'bg-danger']
	else
		return ['bg-default', '']
	}
VistaRepasoTest.prototype.iniciaTiempo=function(){}
VistaRepasoTest.prototype.guardaEstadoExamen=function(){}
VistaRepasoTest.prototype.toggleEstrella=function(){}
VistaRepasoTest.prototype.marcaResp=function(){}
VistaRepasoTest.prototype.toggleMenuGlobal=function(visible, inmediate){
	var menu=jQuery('.barra.global .btn-menu')	
	menu.fadeOut()
	}
////////////////////////////////////////////////

function VistaTienda(desdeHistorial){
	if (app==null) return

	this.id='vistaTienda'
	this.title='Tienda de test'

	this.hashCat=null
	this.catFavorita=get('tapp37_catfavorita') || null
	this.cat=null

	this.leeTestLocales()
	this.leeRespuestasLocales()
	}
VistaTienda.prototype=new Vista
VistaTienda.prototype.getHeader=function(){
	var self=this

	return [
		creaObjProp('ul', {className:'dropdown-content', id:'categorias'}),
		creaObjProp('nav', {className:'vista-header '+this.id, hijos:[
			creaObjProp('div', {className:'nav-wrapper row padding0 bg-tienda', hijos:[
				creaObjProp('ul', {className:'left col s12 row ', hijos:[
					creaObjProp('li', {className:'col s5 m3', hijos:[
						creaObjProp('a', {className:'dropdown-button', texto:'Categorias', mi:'arrow_drop_down', 'data-activates':'categorias' })
						] }),
					creaObjProp('li', {className:'col s3 offset-m2', hijo:creaObjProp('a', {className:'portada', texto:'Portada', onclick:function(){self.navegarAPortada()} }) }),
					creaObjProp('li', {className:'col s4', hijo:creaObjProp('a', {className:'inicio', texto:'Favoritos', onclick:function(){self.navegarACatFavorita()} }) })
					]})
				]}),
			]})
		]
	}
VistaTienda.prototype.getBody=function(){
	return creaObjProp('div', {className:'vista-body tienda'})
	}
VistaTienda.prototype.tareasPostCarga=function(desdeHistorial){
	app.pushState(this.id)

	if (this.catFavorita==null)
		this.domHeader.find('.inicio').hide()
	else
		this.domHeader.find('.inicio').show()

	this.doRecuperarPosicion()
	this.cargaListaCategorias(app.cache.categorias)
	}
VistaTienda.prototype.backButton=function(vTo, vFrom){
	if (app.vistaTest && vFrom.vista==app.vistaTest.id){
		//estaba haciendo un test
		app.vistaTest.pausaTiempo()
		}
	else {
		if (app.vistaActiva!=this)
			this.show(true, true)
		this.navegaEl(vTo, vFrom)
		}
	}
VistaTienda.prototype.navegaEl=function(vTo, vFrom){
	if (vTo.vista==this.id && vTo.cd_categoria)
		this.ampliaPackOCat( this.getCat(vTo.cd_categoria), null, false)
	else { //
		this.cat=null
		
		this.navegarAPortada()

		if (vFrom && vFrom.cd_categoria){
			var oldcat=this.domBody.find('#cat-'+vFrom.cd_categoria).offset()
			if (oldcat) this.scrollTo( oldcat.top-100 )
			}
		}
	}
VistaTienda.prototype.navegarAPortada=function(){
	//hay ocasiones en que las categorías dinámicas no vienen, las inyecto
	if (buscaFilas(app.cache.categorias, {cd_categoria:-1}).length==0){
		var catMenos1={
			cd_categoria: -1,
			cd_categoriapadre: null,
			ds_categoria: 'Nuevos y actualizados',
			//i: 'cat--1.jpg',
			listarComoCategoria: 1,
			numtestsporcat: 10,
			}
		app.cache.categorias.splice(0,0,catMenos1)
		}

	if (buscaFilas(app.cache.categorias, {cd_categoria:-2}).length==0){
		var catMenos2={
			cd_categoria: -2,
			cd_categoriapadre: null,
			ds_categoria: 'Los más valorados',
			//i: 'cat--1.jpg',
			listarComoCategoria: 1,
			numtestsporcat: 10,
			}
		app.cache.categorias.splice(0,0,catMenos2)
		}

	// if (buscaFilas(app.cache.categorias, {cd_categoria:-3}).length==0){
	// 	var catMenos3={
	// 		cd_categoria: -3,
	// 		cd_categoriapadre: null,
	// 		ds_categoria: 'Gratuitos',
	// 		//i: 'cat--3.jpg',
	// 		listarComoCategoria: 1,
	// 		numtestsporcat: 10,
	// 		}
	// 	app.cache.categorias.splice(0,0,catMenos3)
	// 	}


	app.clearNav()
	// this.restauraHeaderApp() 
	this.pintaPortadaTienda(app.cache.categorias, app.cache.testTienda)

	app.trackEvent('nav', 'main')
	}
VistaTienda.prototype.navegarACatFavorita=function(){
	if (this.catFavorita==null) return

	var xcat=this.getCat(this.catFavorita)
	this.ampliaPackOCat( xcat, app.cache.testTienda, false)
	app.trackEvent('nav', 'favourite', xcat.cd_categoria+'-'+xcat.ds_categoria)
	// var cat=buscaFilas(app.cache.categorias, {cd_categoria:this.catFavorita})[0]
	// var xp=this.domBody.find('#cat-'+cat.cd_categoriapadre)
	// if (xp.length)
	// 	this.domBody.scrollTop( xp.offset().top-100 )
	}
VistaTienda.prototype.show=function(desdeHistorial, willReposition){
	Vista.prototype.show.call(this, desdeHistorial)

	app.pushState(this.id)
	if (!desdeHistorial) {
		app.addToNavIfEmpty({vista:this.id})
		}
	
	if (willReposition==null){
		if (this.recuperarPosicion!=null)
			this.doBuscarTest(null, this.recuperarPosicion, true) 
		else {
			this.inicio(desdeHistorial)
			}
		}	
	}
VistaTienda.prototype.inicio=function(desdeHistorial, vFrom){
	var catVolver=null, navegar=false
	if (desdeHistorial && vFrom) 
		catVolver=vFrom.cd_categoria

	if (catVolver){
		var cat=this.getCat(catVolver)
		
		var xp=this.domBody.find('#cat-'+cat.cd_categoriapadre)
		if (xp.length)
			this.domBody.scrollTop( xp.offset().top-100 )
		}
	else 
		this.navegaEl( {vista: 'vistaTienda'})

	}
VistaTienda.prototype.toggleMenuGlobal=function(visible, inmediate){
	var menu=jQuery('.barra.global .btn-menu')	
	
	if (visible){
		if (inmediate)
			menu.show()
		else 
			menu.fadeIn()
		}
	else{
		if (inmediate)
			menu.hide()
		else 
			menu.fadeOut()
		}
	}
VistaTienda.prototype.setOffline=function(v){
	var self=this
	if (!app.offline && app.cache.testTienda && app.cache.testTienda.length==0)
		self.leeTestTienda(function(datos){	
			app.cache.testTienda=datos
			self.pintaPortadaTienda(app.cache.categorias, datos)
			})
	}
//////
VistaTienda.prototype.doBuscarTest_response=function(filas, situar){
	var self=this
	var resultadosBusqueda=filas || []

	app.cache.categorias=app.cache.categorias || []
	var xcat={cd_categoria:-100, ds_categoria:'Resultados de la búsqueda', 
		i:'cat--2.jpg', cd_categoriapadre:-200,
		}

	if (this.getCat(xcat.cd_categoria)==null)
		app.cache.categorias.push(xcat)

	if (resultadosBusqueda.length==0){
		this.domBody.empty()
		var titulo, texto, sub, i
			titulo='No hay resultados'
			texto='No se ha encontrado ningún test que coincida con tu búsqueda.'
			sub='Trata de indicar unos criterios más amplios, por ejemplo "salud 2013"'
			i='search'
		this.domBody.append( this.admonition(titulo, texto, i, sub ) )

		app.addToNav({vista:this.id, cd_categoria:xcat.cd_categoria})
		}
	else 
		this.ampliaPack(xcat, resultadosBusqueda, false)
		
	app.quitaThrobber()
	}
//////
VistaTienda.prototype.fnMarcarCatFavorita=function(cd_cat){
	var self=this
	return function(e){
		self.marcarCatFavorita(cd_cat)

		e=e || window.event
		if (e && e.stopPropagation) 
        	e.stopPropagation()
    	else 
          	e.cancelBubble = true
		}
	}
VistaTienda.prototype.marcarCatFavorita=function(cd_cat){
	if (this.catFavorita==cd_cat)
		this.catFavorita=null
	else
		this.catFavorita=cd_cat

	save('tapp37_catfavorita', this.catFavorita)

	jQuery('ul#categorias .btnFav.on').removeClass('on')
	jQuery('ul#categorias .btnFav[data-id='+this.catFavorita+']').addClass('on')

	if (this.catFavorita==null)
		this.domHeader.find('.inicio').hide()
	else
		this.domHeader.find('.inicio').show()

	if (this.catFavorita){
		var cat=this.getCat(this.catFavorita)
		app.showToast('Has marcado la categoría "'+cat.ds_categoria+'" como favorita.')
		}
	else{
		app.showToast('Has eliminado la categoría favorita')
		}
	}
//////
VistaTienda.prototype.doRecuperarPosicion=function(){
	if (this.hashCat){
		var hashCat=this.getCat(this.hashCat)
		if (hashCat){
			
			this.ampliaPackOCat(hashCat)

			this.hash=null
			return
			}
		}

	this.cargaListaCategorias(app.cache.categorias)
	
	if (this.catFavorita){
		var xcat=this.getCat(this.catFavorita)
		this.ampliaCat(xcat)
		}
	else
	 	this.pintaPortadaTienda(app.cache.categorias, app.cache.testTienda)
	}
VistaTienda.prototype.cargaListaCategorias=function(lis, todosLosNiveles){
	var self=this
	//http://www.oposiciones.de/oposiciones.htm, opción "según estudios"

	var xl=[]
	var fn=function(){
		var idcat=jQuery(this).data('id')
		self.ampliaPackOCat( self.getCat(idcat), app.cache.testTienda, false)
		}

	for (var i=0; i<lis.length; i++){
		var cat=lis[i]
		if (cat==null || cat.ds_categoria=='') return

		var ds_cat=cat.ds_categoria
		var btn=creaT('')

		var cls=this.catFavorita==cat.cd_categoria?' on':''
		btn=creaObjProp('a', {className:'secondary-content btnFav '+cls, 'data-id':cat.cd_categoria, onclick:this.fnMarcarCatFavorita(cat.cd_categoria), mi:'star'})

		if (todosLosNiveles || cat.cd_categoriapadre==null){
			var hijos=[]
			hijos.push(creaT(ds_cat))
			hijos.push(btn)

			xl.push( 
				creaObjProp('li', {className:'collection-item', 'data-id':cat.cd_categoria, onclick:fn, hijos:[
					creaObjProp('div', {hijos:hijos})
					]}) 
				)
			}
		}
	jQuery('ul#categorias').empty().append(xl)
	jQuery('.dropdown-button').dropdown({belowOrigin:true})
	}
VistaTienda.prototype.sacaPadresCategoria=function(cat){
	// app.cache.categorias
	if (cat.cd_categoriapadre==null)
		return null

	var r=[]
	while (cat.cd_categoriapadre!=null){
		cat=this.getCat(cat.cd_categoriapadre)
		r.push(cat.ds_categoria)
		}
	return r.reverse()
	}

VistaTienda.prototype.escogeTestsCatDinamica=function(cd_categoria, lista){
	return buscaFilas(lista, {_contains_liscat:','+cd_categoria+','})
	}
VistaTienda.prototype.testEstaEnPack=function(test, packs){
	var temp=test.liscat.split(',')
	for (var i=0; i<temp.length; i++){
		var c=temp[i]
		if (c=='') 
			continue
		var f=buscaFilas(packs, {cd_categoria:c})
		if (f.length)
			return true
		}
	return false
	}
VistaTienda.prototype._formatoPrecio=function(domPrecio, fila){
	if (fila.precio==0) 
		this.oldBtnText='GRATIS'
	else 
		this.oldBtnText=formato.moneda(this.precioPlat(fila), '€')

	domPrecio.appendChild( creaT(this.oldBtnText) )
	}
VistaTienda.prototype.leeTestLocales=function(){
	if (app.cache.testLocales==null)
		app.cache.testLocales=app.getTestLocales()
	}
VistaTienda.prototype.leeRespuestasLocales=function(){
	if (app.cache.respuestasLocales==null)
		app.cache.respuestasLocales=app.getRespuestasLocales()
	}
VistaTienda.prototype.ordenaPorFecha=function(lista){
	lista.sort(function(a, b){
		var fa=formato.toDate(a.fu_modificacion)
		var fb=formato.toDate(b.fu_modificacion)

		if (fa==null && fb==null)
			return 0
		else if (fa!=null && fb==null)
			return -1
		else if (fa==null && fb!=null)
			return 1

		else if (fa==fb)
			return 0
		else if (fa>fb)
			return -1
		else
			return 1
		})
	return lista
	}
//////
VistaTienda.prototype.getTestDeCategoria=function(cat){
	var sl=[]
	if (cat.tests==null) cat.tests=[]
	for (var i=0; i<cat.tests.length; i++){
		var cd_test=cat.tests[i]
		var test=buscaFilas(app.cache.testTienda, {cd_test:cd_test})[0]
		if (test)
			sl.push(test)
		}
	return sl
	}
VistaTienda.prototype.cargarMasCat=function(cat, recursivo){
	var self=this

	var sl=this.getTestDeCategoria(cat)
	var totalPorCat=sl.length

	//ahora buscamos los cargados
	for (var i=sl.length-1; i>=0; i--){
		var cd_test=sl[i].cd_test
		if (this.domBody.find('.test[data-id='+cd_test+']').length)
			sl.splice(i,1)
		}

	var cuantosQuedan=sl.length
	if (cuantosQuedan>6){//ya tenemos en memoria
		this.ampliaPackOCat(cat, sl, true)
		}
	else if (recursivo){
		this.ampliaPackOCat(cat, sl, true)
		}
	else if (cat.cd_categoria==-100)//buscar
		this.ampliaPackOCat(cat, sl, true)
	else if ( (this.domBody.find('.test').length+cuantosQuedan)==Number(cat.numtestsporcat) ) 
		this.domBody.find('.cargarMas-cont').remove()
	else if ( (this.domBody.find('.test').length+cuantosQuedan)>Number(cat.numtestsporcat)){
		//ya no hay más, ni siquiera en BD
		this.ampliaPackOCat(cat, sl, true)
		}
	else {
		var cuantos=10
		app.post({accion:'cargarMasCat', cat:cat.cd_categoria, desde:totalPorCat, cuantos:cuantos},
			function(data){
				var datos=xeval(data)
				if (datos.retorno==1){

					if (datos.tests.length==0){
						jQuery('#cat-'+cat.cd_categoria).find('.cargarMas-cont').remove()
						return
						}
					// añadimos
					for (var i=0; i<datos.tests.length; i++){
						app.cache.testTienda.push(datos.tests[i])
						}
					// repintamos, pero sólo una vez
					if (!recursivo)
						self.cargarMasCat(cat, true)
					}
			}, function(){
				if (this.domBody.find('.test').length==0){
					self.admonNoHayDatos()
					}
				else {
					app.alert('Es posible que haya problemas de conectividad, inténtalo más tarde.')
					}
			})
		}

	app.trackEvent('nav', 'load-more', cat.cd_categoria+'-'+cat.ds_categoria)
	}
VistaTienda.prototype.ampliaPackOCat=function(cat, tests, mantenerLosCargados){
	if (cat.listarcomocategoria==0 || cat.cd_categoriapadre!=null)
		this.ampliaPack(cat, tests, mantenerLosCargados)
	else
		this.ampliaCat(cat, tests, mantenerLosCargados)
	}
VistaTienda.prototype.ampliaPack=function(cat, tests, mantenerLosCargados){
	app.pushState(this.id+':'+cat.cd_categoria)
	app.addToNav({vista:this.id, cd_categoria:cat.cd_categoria})

	tests=tests || app.cache.testTienda

	app.ponThrobber()
	if (mantenerLosCargados==null || mantenerLosCargados==false) {
		var tope=cat.cd_categoria==-100?40:10

		this.domBody.empty()
		this.domBody.append( 
			this.anhadeContenedorCat(
				cat, 
				tests,
				tope, 
				this.previewCat(cat, tests, tope, true, true, mantenerLosCargados),
				true, 
				false
				)
			)
		}
	else {
		this.domBody.find('.cargarMas-cont').remove()
		this.domBody.find('.contenedor').append( this.previewCat(cat, tests, 10, true, true, mantenerLosCargados) )
		}

	if (!mantenerLosCargados) this.scrollTop()
	app.quitaThrobber()
	
	app.trackEvent('nav', 'pack', cat.cd_categoria+cat.ds_categoria)
	}
VistaTienda.prototype.ampliaCat=function(cat, tests, mantenerLosCargados){
	var l=app.getLastFromNav()
	if (l==null){
		}
	else if (l.vista==this.id && l.cd_categoria==cat.cd_categoria)
		return

	app.pushState(this.id+':'+cat.cd_categoria)
	app.addToNav({vista:this.id, cd_categoria:cat.cd_categoria})

	tests=tests || app.cache.testTienda

	app.ponThrobber()
	if (mantenerLosCargados==null || mantenerLosCargados==false) {
		var tope=10

		this.domBody.empty()
		this.domBody.append( 
			this.anhadeContenedorCat(
				cat, 
				tests,
				tope, 
				this.previewCat(cat, tests, tope, true),
				true, 
				false
				)
			)
		}
	else {
		this.domBody.find('.cargarMas-cont').remove()
		this.domBody.find('.contenedor').append( this.previewCat(cat, tests, 10) )
		}

	if (!mantenerLosCargados) this.scrollTop()
	app.quitaThrobber()
	
	app.trackEvent('nav', 'cat', cat.cd_categoria+cat.ds_categoria)
	}
VistaTienda.prototype.anhadeContenedorCat=function(cat, tests, numTestsPorCat, listaCajas, conTitulo, conBotonEnTitulo){
	var titulo, self=this, sl

	if (listaCajas==null)
		return creaT('')

	if (conTitulo || conBotonEnTitulo)
		sl=cat.tests

	if (listaCajas.length==0)
		return creaObjProp('div', {className:'section bloque cat row', 'data-id':cat.cd_categoria})
	else if (!conTitulo)
		titulo=creaT('')
	else if (!conBotonEnTitulo)
		titulo=creaObjProp('h5', {className:'col s12 titulo', onclick:function(){self.ampliaCat(cat)}, texto:cat.ds_categoria})
	else if (sl.length>numTestsPorCat && numTestsPorCat==this.numTarjetasPorAncho)
		titulo=creaObjProp('h5', {className:'col s12 titulo', onclick:function(){self.ampliaCat(cat)}, hijos:[
				creaObjProp('span', {className:'col s10 padding0', texto:cat.ds_categoria}),	
				creaObjProp('span', {onclick:function(){self.ampliaCat(cat)}, className:'btn cargarMas right col s2 m1', texto:'Más'})
				] })
	else
		titulo=creaObjProp('h5', {className:'col s12 titulo', onclick:function(){self.ampliaCat(cat)}, texto:cat.ds_categoria})

	var xcajas=[]
	for (var i=0; i<listaCajas.length; i++){
		xcajas.push( listaCajas[i] )
		}
	return creaObjProp('div', {id:'cat-'+cat.cd_categoria, className:'section bloque cat row', 'data-id':cat.cd_categoria, hijos:[
			titulo,
			creaObjProp('div', {className:'col contenedor s12', hijos:xcajas})
			]} ) 
	}
VistaTienda.prototype.previewCat=function(cat, tests, numTestsPorCat, conBotonAbajo, esPack, mantenerLosCargados, paraPortada){
	var packs=[], self=this
	
	if (esPack){
		//pass
		}
	else if ( cat.listarcomocategoria==0 || cat.cd_categoriapadre!=null) 
		return

	if (cat.cd_categoria<0)
		packs=[]
	else if (mantenerLosCargados){
		//se supone que ya están los packs
		}
	else
		packs=buscaFilas(app.cache.categorias, {cd_categoriapadre:cat.cd_categoria})

	var cajas=creaObjProp('span')//si no es en el dom no funciona la func jQuery.find
	for (var j=0; j<packs.length; j++){
		var pack=packs[j]

		if (jQuery(cajas).find('#pack-'+ pack.cd_categoria).length==0){
			var xpack=this._generaDomPack(pack, j, cat)
			if (xpack!=null)
				cajas.appendChild( xpack )
			}
		}

	var sl
	if (cat.cd_categoria==-100)
		sl=tests
	else
		sl=this.getTestDeCategoria(cat)

	var maxTest=sl.length
	if (paraPortada)
		maxTest=Math.min(numTestsPorCat, sl.length)

	var totalTanda=0
	for (var j=0;  j<sl.length; j++){
		var t=sl[j]

		if (packs.length && this.testEstaEnPack(t, packs))
			continue
		else if (this.domBody.find('#test-'+t.cd_test).length>0){
			}
		else if (jQuery(cajas).find('#test-'+ t.cd_test).length==0){
			var xdom=this._generaDomTest(t, j, cat)
			if (xdom) {
				cajas.appendChild(xdom)
				totalTanda++
				
				if (totalTanda>=maxTest) break
				}

			}

		if (localStorage.tapp37_apprate==null){
			var nt=app.cache.testLocales.length
			
			if (nt==0 || (nt % 3!=0) ){
				console.log('banner apprate? nope')
				}
			else if (jQuery(cajas).find('.card').length==8 )
				cajas.appendChild( this.getDomBannerRateApp() ) 
			}

		}

	return cajas.childNodes
	}
VistaTienda.prototype.getDomBannerRateApp=function(){
	var d=new Date().getDate()

	var f=(d % 2)?'gatete.jpg':'perrete.jpg'

	return creaObjProp('div', {onclick:function(){app.appRateDialog()}, className:'card small banner', hijos:[
			creaObjProp('div', {className:'card-image', hijos:[
				creaObjProp('img', {src:'./images/'+f})
				]}),
			creaObjProp('div', {className:'card-content', hijos:[
				creaObjProp('p', {texto:'¿Te gusta Octopus? Ayúdanos a llegar a más gente con una valoración'})
				]}),
			// creaObjProp('div', {className:'card-action', hijos:[
			// 	]})
			]})
	}
VistaTienda.prototype.pintaPortadaTienda=function(cats, tests){
	app.pushState(this.id)
	app.addToNav({vista:this.id})

	this.numTarjetasPorAncho=this.calculaAnchoTarjetas()

	this.domBody.empty()
	if (tests==null || tests.length==0){
		var titulo, texto, sub, i
		// if (app.offline || navigator.connection.type==Connection.NONE){
			this.admonNoHayDatos()
			// }
		this.domBody.addClass('flowable')
		return
		}

	this.domBody.addClass('flowable')
	for (var i=0; i<cats.length; i++){
		var cat=cats[i]
		if (cat==null) continue //puede deberse a alguna categoría que ha desaparecido

		this.domBody.append( 
			this.anhadeContenedorCat(
				cat, 
				tests,
				this.numTarjetasPorAncho,
				this.previewCat(cat, tests, this.numTarjetasPorAncho, null, null, null, true),
				true, 
				true
				)
			)
		}

	this.scrollTop()
	app.quitaThrobber()
	}
//////
VistaTienda.prototype.leeTestTienda=function(fnCallBack){
	if (this.ftestTienda && (new Date()-this.ftestTienda<86400000)){//86400s = 24h
		console.info('leeTestTienda: la última lectura es reciente, la reaprovechamos')
		if (fnCallBack){
			this.cargaListaCategorias(app.cache.categorias)
			fnCallBack(app.cache.testTienda)
			app.quitaThrobber()
			}
		return
		}

	var self=this
	self.domBody.empty()

	if (app.cache.usuario==null || navigator.connection.type==Connection.NONE){
		this.admonNoHayDatos()
		}

	if (app.offline){
		app.cache.testTienda=[]
		if (fnCallBack){
			fnCallBack(app.cache.testTienda)
			app.quitaThrobber()
			}
		return
		}

	self.doLeeTestTienda(fnCallBack)
	}
VistaTienda.prototype.doLeeTestTienda=function(fnCallBack){
	var self=this
	this.iniciaSincroTestTienda(fnCallBack)
	}
//////
VistaTienda.prototype.iniciaSincroTestTienda=function(fnCallBack, silent){
	// localStorage.tapp37_lastSynced
	// localStorage.tapp37_dataPath	
	var fnProcesaArchivo=function(){
		var url
		if (device.platform=='iOS' || device.platform=='Android')
			url='file://' + localStorage.tapp37_dataPath + '/data.min.js'
		else
			url='./data/data.min.js'
	
		jQuery.getScript(url).done(function(d){        
	    	// el archivo tiene la forma "var tests=[]; var cats=[]"
	    	for (var i=0;i<cats.length; i++){
	    		if (cats[i].tests){
	    			cats[i].tests=cats[i].tests.split(',')
	    			cats[i].numtestsporcat=cats[i].tests.length
	    			}
	    		else {
	    			cats[i].tests=[]
	    			cats[i].numtestsporcat=0
	    			}
	    		
	    	}
			app.cache.testTienda=tests
			app.cache.categorias=cats

			app.quitaThrobber()
			if (fnCallBack)
				fnCallBack(app.cache.testTienda)

			}).fail(function(jqxhr, settings, exception){
				console.log('Error recuperando el data de la caché')
				localStorage.removeItem('tapp37_lastSynced')
				app.VistaTienda.iniciaSincroTestTienda()
				} )
		}

	var self=this
	if (device.platform=='iOS' || device.platform=='Android'){
		if (!silent) app.ponThrobber()
		//check for new data
		jQuery.ajax({url:app.config.data, method:'HEAD'})
    		.done(function(res,text,jqXHR) {
        		var lastMod = jqXHR.getResponseHeader('Last-Modified')
        		console.log('Sync: lastmod=', lastMod)
        		
        		if (!localStorage.tapp37_lastSynced || localStorage.tapp37_lastSynced != lastMod) {
            		console.log('Sync: need to sync')
            		self._startSincroTestTienda(fnProcesaArchivo, silent)
            		localStorage.tapp37_lastSynced = lastMod
        			} 
        		else {
            		console.log('Sync: NO need to sync')
            		fnProcesaArchivo()
        			}
    			})
    		.fail(function(){
    			// offline?
    			if (localStorage.tapp37_dataPath)
    				fnProcesaArchivo()
    			else
					fnCallBack()
    		})
		}
	else if (device.platform=='web'){
		fnProcesaArchivo()
		app.quitaThrobber()
		}
	}
VistaTienda.prototype._startSincroTestTienda=function(fnCallBack, silent){
	var sync = ContentSync.sync({ src: app.config.data, id: 'test_data' })
    
    sync.on('progress', function(data) {
        console.log('Sync progress: '+data.progress+'%')
    	})
    
    sync.on('complete', function(data) {
        localStorage.tapp37_dataPath = data.localPath
        fnCallBack()
        app.quitaThrobber()
    	})
    
    sync.on('error', function(e) {
        console.log('Sync error: ', e.message)
        app.quitaThrobber()
   	 	})
    
    sync.on('cancel', function() {
        console.log('Sync cancel: ', e.message)
        app.quitaThrobber()
   		})
	}
//////
VistaTienda.prototype.testData=function(){
	return [
			{cd_test:1,    ds_test:'Test Enfermería 1',  liscat:'1', nota:5.5},
			{cd_test:12,   ds_test:'Test Enfermería 2',  liscat:'1', nota:6},
			{cd_test:19,   ds_test:'Test Enfermería 3',  liscat:'1'},
			{cd_test:99,   ds_test:'Test Enfermería 4',  liscat:'1'},
			{cd_test:999,  ds_test:'Test Enfermería 99', liscat:'1'},
			{cd_test:1000, ds_test:'Test Enfermería 100',liscat:'1'},
			{cd_test:1001, ds_test:'Test Enfermería 101',liscat:'1'},

			{cd_test:2, ds_test:'Test Autoescuela ABC', liscat:'2'},
			{cd_test:3, ds_test:'Test Autoescuela DEF', liscat:'2'},
			{cd_test:4, ds_test:'Test Autoescuela 3', 	liscat:'2'},
			{cd_test:5, ds_test:'Test Autoescuela 4', 	liscat:'2'},
			{cd_test:6, ds_test:'Test Autoescuela 5', 	liscat:'2'},
			{cd_test:7, ds_test:'Test Autoescuela 99', 	liscat:'2'},

			{cd_test:201, ds_test:'Test TIC 1',  		liscat:'3'},
			{cd_test:301, ds_test:'Test TIC 11', 		liscat:'3'},
			{cd_test:401, ds_test:'Test TIC 9',  		liscat:'3'},
			{cd_test:501, ds_test:'Test TIC 10', 		liscat:'3'},
			{cd_test:601, ds_test:'Test TIC 11', 		liscat:'3'},
			{cd_test:701, ds_test:'Test TIC 12', 		liscat:'3'},
		]
	}
////////////////////////////////////////////////
function VistaMisTest(desdeHistorial){
	Vista.call(this, desdeHistorial)

	this.id='vistaMisTest'
	this.title='Mis test'
	}
VistaMisTest.prototype=new Vista
VistaMisTest.prototype.getHeader=function(){
	return [
		creaObjProp('nav', {className:'vista-header '+this.id, hijos:[
			creaObjProp('div', {className:'nav-wrapper row padding0 bg-mistest fg-mistest'}),
			]})
		]
	}
VistaMisTest.prototype.getBody=function(){
	return creaObjProp('div', {className:'vista-body fg-mistest'})
	}
VistaMisTest.prototype.tareasPostCarga=function(desdeHistorial){
	app.ponThrobber()
	this.pintaPortadaTienda()

	// if (!desdeHistorial) {
	// 	app.addToNavIfEmpty({vista:this.id})
	// 	}
	}
VistaMisTest.prototype.show=function(desdeHistorial){
	Vista.prototype.show.call(this, desdeHistorial)

	app.pushState(this.id)
	if (!desdeHistorial) {
		app.addToNavIfEmpty({vista:this.id})
		}
	}
VistaMisTest.prototype.ponHorasACero=function(d, diasMenos){
	if (diasMenos){
		d=new Date( d.getTime()-diasMenos*24*3600*1000 )
		}
	d.setHours(0); d.setMinutes(0); d.setSeconds(0)
	return d
	}
VistaMisTest.prototype.pintaPortadaTienda=function(){
	app.pushState(this.id)
	app.addToNav({vista:this.id})

	this.domBody.empty()

	var lista=app.cache.testLocales
	if (lista.length==0){
		var titulo, texto, sub, i
			titulo='No hay test'
			texto='Aquí se muestran los test que tienes almacenados en tu dispositivo, pero ahora mismo no hay ninguno.'
			sub='¿Por qué no descargas alguno de la tienda?'
			i='info'
		this.domBody.append( this.admonition(titulo, texto, i, sub ) )
		app.quitaThrobber()
		return
		}

	this.domBody.addClass('flowable')

	//hoy, ayer, hace 2 días, esta semana, la semana pasada, antes
	var hoy=this.ponHorasACero(new Date())
	var ayer=this.ponHorasACero(new Date(), 1)
	var estaSemana=this.ponHorasACero(hoy, hoy.getDay()+1)

	
	var hoy= {ds:'Hoy',  t:hoy, it:[]}
	var ayer={ds:'Ayer', t:ayer, it:[]}
	var estaSemana={ds:'Esta semana', t:estaSemana, it:[]}
	var antes={ds:'Antes', it:[]}
		
	for (var j=0;j<app.cache.testLocales.length; j++){
		var t=app.cache.testLocales[j]
		
		var f=formato.toDate(t.fu_modificacion)

		if (f>hoy.t)
			hoy.it.push(t)
		else if (f>ayer.t)
			ayer.it.push(t)
		else if (f>estaSemana.t)
			estaSemana.it.push(t)
		else
			antes.it.push(t)
		}
	
	var l=[hoy, ayer, estaSemana, antes]
	for (var i=0; i<l.length; i++){

		var periodo=l[i]
		var d=creaObjProp('div', {className:'col contenedor s12'})
		
		if (periodo.it.length){
			for (var j=0;  j<periodo.it.length; j++){	
				var t=periodo.it[j]
				var cat=this.getCatFromTest(t)
				
				if (jQuery(d).find('#test-'+ t.cd_test).length==0){
					var xdom=jQuery(this._generaDomTest(t, j, cat))
					//xdom.addClass('tanda1')
					d.appendChild( xdom[0] )
					}
				}
			this.domBody.append(
				creaObjProp('div', {className:'section bloque cat row', hijos:[
					creaObjProp('h5', {className:'col s12 titulo', texto:periodo.ds}),
					d
					]})
				)
			}
		}

	app.quitaThrobber()
	}
VistaMisTest.prototype.inicio=function(){
	this.pintaPortadaTienda()
	}
VistaMisTest.prototype.doBuscarTest_response=function(filas, situar){
	var self=this
	var res=filas || []
	
	var xcat={cd_categoria:-100, ds_categoria:'Resultados de la búsqueda', mi:'search', cd_categoriapadre:-200}

	this.domBody.empty()
	// if (res.length==1)
	// 	this.testPreview(res[0], this.getCat(res[0]))
	// else 
	if (res.length==0){
		var titulo, texto, sub, i
			titulo='No hay resultados'
			texto='No se ha encontrado ningún test que coincida con tu búsqueda.'
			sub='Trata de indicar unos criterios más amplios, por ejemplo "salud 2013"'
			i='search'
		this.domBody.append( this.admonition(titulo, texto, i, sub ) )

		app.addToNav({vista:this.id, cd_categoria:xcat.cd_categoria})
		}
	else 
		this.ampliaCat(xcat, res)
		
	app.quitaThrobber()
	}
VistaMisTest.prototype.ampliaCat=function(cat, tests){
	app.pushState(this.id+':'+cat.cd_categoria)
	app.addToNav({vista:this.id, cd_categoria:cat.cd_categoria})

	app.ponThrobber()

	var d=creaObjProp('div', {className:'col contenedor s12'})
	for (var j=0; j<tests.length; j++){
		
		var t=tests[j]
		var cat=this.getCatFromTest(t)
		
		if (jQuery(d).find('#test-'+ t.cd_test).length==0){
			var xdom=jQuery(this._generaDomTest(t, j, cat))
			xdom.addClass('tanda1')
			d.appendChild( xdom[0] )
			}
		}

	var bloque=creaObjProp('div', {id:'cat-'+cat.cd_categoria, className:'section bloque cat row', hijo:d} )
	this.domBody.addClass('flowable').append(bloque)

	this.scrollTop()
	app.quitaThrobber()
	}
VistaMisTest.prototype.backButton=function(vTo, vFrom){
	//sólo para salir de la búsqueda

	app.clearNav()
	app.addToNav({vista:this.id})

	this.pintaPortadaTienda()
	}
////////////////////////////////////////////////
function VistaDetalleTest(desdeHistorial, test, cat){
	VistaFlotante.call(this)

	this.test=test
	this.cat=cat

	this.id='vistaDetalleTest'
	this.title='Detalle del test'

	}
VistaDetalleTest.prototype=new VistaFlotante
VistaDetalleTest.prototype.getHeader=function(){
	var self=this
	return [
		creaObjProp('nav', {className:'vista-header '+this.id, hijos:[
			creaObjProp('div', {className:'nav-wrapper row padding0 ', hijos:[
				creaObjProp('a', {className:'button-collapse btn-navdrawer', mi:'close', onclick:function(){app.backButton()} })
				]}),
			]})
		]
	}
VistaDetalleTest.prototype.getBody=function(){
	var i=this.cat?this.cat.i:'cat-0.jpg'
	var test={
		cd_test:0,
		ds_test:'2008, Examen turno 1, Servicio Extremeño de Salud', 
		organismo:'Servicio Extremeño de Salud',
		anho:2008,
		grupo:'GR',
		numpreguntas:0,
		minutos:0,
		likes:11,
		}
	var estadisticas={
		respondidasPorcentaje:23,

		aciertos:49,
		fallos:40,
		nc:11,	

		minutosConsumidos:30,
		minutosTotal:90, 
		minutosPorcentaje:30,
		}

	var f={dia:1, mesl:'jun'}
	var resultadoTest='Aprobado (5.5)'
	
	var self=this
	return [
		creaObjProp('div', {className:'vista-body', hijos:[
			creaObjProp('div', {className:'row header', hijos:[
				creaObjProp('img', {className:'col s12 padding0 portada', src:'./images/cats/pack.jpg', onerror:function(evt){
																	evt.srcElement.src='./images/cats/pack.jpg'
																	} }),
				// creaObjProp('div', {className:'rotated-addon'}),
				creaObjProp('a', {className:'icono btn-floating btn-large red needsclick', mi:'shopping_cart', onclick:function(){self.ejecutaAccionPrincipal()} }),
				creaObjProp('span', {className:'btn-floating red precio', texto:'0,50€'}),
				]}),
			creaObjProp('div', {className:'row dg', hijos:[
				//título
				creaObjProp('h5', {className:'col s12 title', texto:test.ds_test}),
				creaObjProp('p', {className:'col s12 sub-title', texto:test.organismo}),
	
				]}),
			
			creaObjProp('div', {className:'row carrusel', hijos:[
				creaObjProp('div', {className:'slider', hijos:[
					creaObjProp('ul', {className:'slides', hijos:[

						//diapo1: compartir y valorar
						creaObjProp('li', {className:'social', hijos:[
							creaObjProp('img', {src:'./images/onepx.png'}),//si no pones la imagen no va el slider
							creaObjProp('div', {className:'caption left-align', hijos:[
								creaObjProp('div', {className:'share col s4', mi:'share', onclick:function(){self.compartir()} }),
								creaObjProp('div', {className:'desinstalar col s3', mi:'delete', onclick:function(){self.desinstalarTest()} }),
								creaObjProp('div', {className:'love col s5',  mi:'favorite_border', onclick:function(){self.toggleLike()}, hijos:[
									creaObjProp('span', {className:'counter', texto:11})
									]}),
								]})

							]}),

						//diapo2: más datos del test
						creaObjProp('li', {className:'moredata', hijos:[
							creaObjProp('img', {src:'./images/onepx.png'}),//si no pones la imagen no va el slider
							creaObjProp('div', {className:'caption', hijos:[
								// creaObjProp('ul', {className:'col s12 collection props padding0', hijos:[
									(test.anho?
										creaObjProp('div', {className:'mini avatar li_anho', mi:'left today', hijos:[
											creaObjProp('p', {className:'anho', texto:'Año '+test.anho}),
											]}):
										creaT('') 
										),
									(test.grupo?
										creaObjProp('div', {className:'mini avatar li_grupo', mi:'left label', hijos:[
											creaObjProp('p', {className:'grupo', texto:'Grupo '+test.grupo}),
											]}):
										creaT('') 
										),
									creaObjProp('div', {className:'mini avatar li_numpregs', mi:'left watch', hijos:[
										creaObjProp('p', {className:'numpregs', texto:test.numpreguntas+' preguntas/'+test.minutos+' minutos'}),
										]}),
									// ]}),
								]})
							]})
						]})
					]})
				]}),

			creaObjProp('div', {className:'row testEnCurso', hijos:[
				creaObjProp('h5', {className:'col s12 title', texto:'Tienes este test a medias'}),
				
				creaObjProp('div', {className:'col s12 section', hijos:[
					
					creaObjProp('span', {className:'col s10 textoProgress padding0', texto:'Preguntas respondidas'}), 
					creaObjProp('span', {className:'col s2 textoProgress alignr respondidasPorcentaje', texto:estadisticas.respondidasPorcentaje+'%' }), 

					creaObjProp('div', {className:'progress col s12', hijos:[
						creaObjProp('div', {className:'determinate respondidasPorcentaje', 'style.width':estadisticas.respondidasPorcentaje+'%'}),
						]}),
					
					]}),

				creaObjProp('div', {className:'col s12 section', hijos:[
					
					creaObjProp('span', {className:'col s6 textoProgress padding0', texto:'Tiempo consumido'}), 
					creaObjProp('span', {className:'col s6 textoProgress alignr minutosPorcentaje', texto:estadisticas.minutosPorcentaje+'%' }), 

					creaObjProp('div', {className:'progress col s12', hijos:[
						creaObjProp('div', {className:'determinate minutosPorcentaje', 'style.width':estadisticas.minutosConsumidos+' minutos ('+estadisticas.minutosPorcentaje+'%)'}),
						]}),
					]}),
				]}),
			creaObjProp('div', {className:'row testFinalizado', hijos:[

				creaObjProp('h5', {texto:resultadoTest, className:'col s12 title'}), 
				creaObjProp('p', {texto:'', className:'fecha col s12 sub-title'}), 

				creaObjProp('a', {className:'icono col btn-floating secondary grey', mi:'healing', onclick:function(){self.repasarExamen()}}),
			
				
				creaObjProp('div', {className:'col s12 section stats', hijos:[
					creaObjProp('div', {className:'col s5 aciertos', hijos:[
						creaObjProp('span', {className:'l', texto:'aciertos'}),
						creaObjProp('span', {className:'v', texto:estadisticas.aciertos}),
						]}),
					creaObjProp('div', {className:'col s5 fallos col2', hijos:[
						creaObjProp('span', {className:'l', texto:'fallos'}),
						creaObjProp('span', {className:'v', texto:estadisticas.fallos})
						]}),
					creaObjProp('div', {className:'col s5 nc', hijos:[
						creaObjProp('span', {className:'l', texto:'No contestadas'}),
						creaObjProp('span', {className:'v', texto:estadisticas.nc}) 
						]}),
					creaObjProp('div', {className:'col s6 t col2 minutos', hijos:[
						creaObjProp('span', {className:'l', texto:'Tiempo'}),
						creaObjProp('span', {className:'v', texto:estadisticas.minutosConsumidos+'/'+estadisticas.minutosTotal+' min'}),
						]}),
					]})
				]}),

			creaObjProp('div', {className:'row muestraGratis get', hijos:[
				creaObjProp('h5', {texto:'¿Tienes dudas? ', className:'col s9 title'}), 
				creaObjProp('p', {className:'col s9 sub-title', texto:'Puedes obtener una muestra gratuita para ver si se trata de lo que estás buscando'}),
				creaObjProp('a', {className:'btn-floating red secondary', mi:'visibility', onclick:function(){self.muestraGratis()} }),
				]}),
			creaObjProp('div', {className:'row muestraGratis launch', hijos:[
				creaObjProp('h5', {texto:'Muestra gratuita', className:'col s9 title'}), 
				creaObjProp('p', {className:'col s9 sub-title', texto:'Pulsa el botón para ver el primer bloque de preguntas'}),
				creaObjProp('a', {className:'btn-floating blue-grey', mi:'play_arrow', onclick:function(){self.lanzaTest()} }),
				]})

			]})
		]
	}
VistaDetalleTest.prototype.show=function(fromHistory, test, cat){
	app.ponThrobber()

	this.lastScrollPosition=jQuery('body')[0].scrollTop

	if (app.esTablet)
		VistaFlotante.prototype.show.call(this)
	else
		Vista.prototype.show.call(this)

	if (!app.esTablet) jQuery('body > .navbar-fixed > #navigation_bar').hide()

	app.pushState(this.id+':'+test.matricula)
	if (!fromHistory)app.addToNav({vista:this.id, test:test.cd_test})

	this.test=test
	var loTengoEnLocal
	if (isNaN(test.cd_test))
		loTengoEnLocal=buscaFilas(app.cache.testLocales, {matricula:test.matricula})
	else
		loTengoEnLocal=buscaFilas(app.cache.testLocales, {cd_test:test.cd_test})

	var loTengo=loTengoEnLocal
	if (loTengo.length>0){
		this.test=loTengo[0]
		}
	else {
		if (this.test!=null || isNaN(this.test.cd_test))
			loTengo=buscaFilas(app.cache.testTienda, {cd_test:this.test.matricula})
		else
			loTengo=buscaFilas(app.cache.testTienda, {cd_test:this.test.cd_test})

		if (loTengo.length==0)
			loTengo=buscaFilas(app.cache.testTienda, {matricula:this.test.matricula})

		this.test=loTengo[0]
		}

	if (cat!=null){
		this.cat=cat
		}
	else if (this.test && this.cat==null){
		this.cat=this.getCatFromTest(this.test)
		}
	var xcat=this.cat?this.cat:{i:'cat-0.jpg'}

	var self=this
	setTimeout(
		function(){
			self.domBody.find('.header .portada')[0].src=self.getImagen(xcat)
			}, 100)

	if (this.currTest && this.currTest.cd_test==test.cd_test) {
		app.quitaThrobber()
		return
	}

	var loHice
	if (this.test){
		loHice=buscaFilas(app.cache.respuestasLocales, {cd_test:this.test.cd_test})
		}

	if (loTengo.length>0){ //no hace falta consultar al servidor
		this.actualizaInfoPantalla(this.test, this.cat, loHice[0], loTengoEnLocal.length>0)
		app.trackEvent('test', 'preview', this.test.cd_test+'-'+this.test.ds_test)
		app.quitaThrobber()
		}
	else {
		var self=this
		jQuery.get(app.config.url, {accion:'getPreviewTest', cd_test:test.cd_test, matricula:test.matricula, cd_device:device.uuid},
			function(data){
				var test=xeval(data).test
				
				self.test=test
				self.cat=self.getCatFromTest(test)

				app.trackEvent('test', 'preview', self.test.cd_test+'-'+self.test.ds_test)
				self.actualizaInfoPantalla(self.test, self.cat, null, false)
				app.quitaThrobber()
				}
			)
		}
	// this.scrollTop()
	}
VistaDetalleTest.prototype.infoEsAntigua=function(){
	var n=new Date()
	if (this.test.likes==null)
		return true
	else if (this.test.fu_modificacion==null)
		return true
	else {
		var o=new Date(this.test.fu_modificacion)
		return (n-o)>3600000 //1hora
		}
	return false
	}
VistaDetalleTest.prototype.ejecutaAccionPrincipal=function(){
	console.info('>> acc principal')

	var test=this.test

	var loTengo
	if (isNaN(test.cd_test))
		loTengo=buscaFilas(app.cache.testLocales, {matricula:test.matricula}).length>0
	else
		loTengo=buscaFilas(app.cache.testLocales, {cd_test:test.cd_test}).length>0

	if (test.muestraGratis){
		loTengo=false
		test.lotengo=false
		}

	if (loTengo)
		this.lanzaTest()
	else if (test.precio==0 || test.lotengo)
		this.descargaTest()
	else if (test.yaCompradoSegunITunes)
		this.descargaTest(test.yaCompradoSegunITunes, 'Compra restaurada')
	else {
		if (isPhone())
			this.compra.doCompraProducto()
		else 
			app.alert('La compra de test no está disponible para tu plataforma (actualmente sólo es posible realizar compras desde nuestra apps para Android e iOS)', 'Compra no disponible')
		}
	}
VistaDetalleTest.prototype.actualizaInfoPantalla=function(test, cat, estadisticas, loTengo){
	if (test==null) return

	var xcat=cat?cat:{i:'cat-0.jpg'}
	this.domBody.find('.header .portada')[0].src=this.getImagen(xcat)
	this.scrollTop()

	if (this.currTest && this.currTest.cd_test==test.cd_test) return
	
	this.currTest=test
	this.test=test

	var self=this

	if (test.muestraGratis){
		loTengo=false
		test.lotengo=false
		}

	var //fnAccionBoton, 
		icono, css, precio
	if (loTengo){
		//fnAccionBoton=function(){self.lanzaTest()}

		icono='play_arrow'
		css='negroTrans'
		precio=''

		jQuery('.desinstalar').css('visibility', 'visible')
		this.domBody.find('.muestraGratis').hide()
		}
	else if (test.lotengo){
		//fnAccionBoton=function(){self.descargaTest()}

		icono='cloud_download'
		css='red'
		precio='COMPRADO'

		jQuery('.desinstalar').css('visibility', 'hidden')
		this.domBody.find('.muestraGratis').hide()
		}
	else if (test.precio==0){
		//fnAccionBoton=function(){self.descargaTest()}

		icono='cloud_download'
		css='red'
		precio='GRATUITO'

		jQuery('.desinstalar').css('visibility', 'hidden')
		this.domBody.find('.muestraGratis').hide()
		}
	else {
		icono='shopping_cart'
		
		if (isPhone()){
			css='red'
			// if (device.platform=='iOS')
			// 	css='red lighten-3'

			precio=formato.moneda( this.precioPlat(test), '€')+' - Comprar'
			}
		else {
			css='red'
			precio=formato.moneda( this.precioPlat(test), '€')+' - Compra no disponible'
			}

		if (test.muestraGratis){
			this.domBody.find('.muestraGratis.get').hide()
			this.domBody.find('.muestraGratis.launch').show()
			jQuery('.desinstalar').css('visibility', 'visible')
			}
		else {
			this.domBody.find('.muestraGratis.get').show()
			this.domBody.find('.muestraGratis.launch').hide()
			jQuery('.desinstalar').css('visibility', 'hidden')
			}
		}

	this.domBody.find('.header .icono')
		.removeClass('red negroTrans lighten-3')
		.addClass(css)
		.find('i').text(icono)

	var btn=this.domBody.find('.header .icono')[0]
	
	this.domBody.find('.header .precio')
		.removeClass('red negroTrans lighten-3')
		.addClass(css)
		.text(precio)
	

	if (loTengo){}
	else if (test.lotengo){}
	else if (test.precio==0){}
	else if (isPhone()) {
		try {
			this.preparaCompraTest()
			}
		catch (e){
			console.log(e)
			}
		}

	this.domBody.find('.dg .title').text(test.ds_test)
	this.domBody.find('.dg .sub-title').text(test.organismo || '')


	this.domBody.find('.carrusel .li_anho').toggle(test.anho!=null)
	this.domBody.find('.carrusel .anho').text('Año '+test.anho)

	this.domBody.find('.carrusel .li_grupo').toggle(test.grupo!=null)
	this.domBody.find('.carrusel .grupo').text('Grupo '+test.grupo)


	var love=jQuery('.row.carrusel .love')

	if (this.infoEsAntigua()){
		love.find('span, i').css('opacity', .3)
		love.find('span').text('')

		app.post({accion:'getNumLikes', cd_test:test.cd_test, cd_device:device.uuid},
			function(data){
				var datos=xeval(data)

				if (datos.retorno==1){
					self.test.likeit=datos.likeit!='0'
					self.test.likes=datos.likes
					self.test.fu_modificacion=new Date()

					self.actualizaOcurrenciasTest(self.test)

					love.find('span, i').css('opacity', 1)
					love.find('i').text(test.likeit?'favorite':'favorite_border')
					love.find('span').text( Math.max(test.likes, 0) )

					// love.find('span').counterUp({delay: 1, time: 100})
					}
			})
		}
	else {
		// console.log('No hay que preguntar el núm de likes, la info es reciente')

		love.find('i').text(test.likeit?'favorite':'favorite_border')
		love.find('span').text( Math.max(test.likes, 0) )
		}

	this.domBody.find('.carrusel .numpregs').text(test.numpreguntas+' preguntas/'+test.minutos+' minutos')

	if (test.muestraGratis){
		this.domBody.find('.testEnCurso, .testFinalizado').hide()
		}
	else if (estadisticas){
		if (!estadisticas.finalizado){
			this.domBody.find('.testEnCurso').show()
			this.domBody.find('.testFinalizado').hide()

			this.domBody.find('.testEnCurso .textoProgress.respondidasPorcentaje').text(estadisticas.respondidasPorcentaje+'%')
			this.domBody.find('.testEnCurso .determinate.respondidasPorcentaje').css('width', estadisticas.respondidasPorcentaje+'%')

			this.domBody.find('.testEnCurso .textoProgress.minutosPorcentaje').text( estadisticas.minutosConsumidos+' minutos ('+estadisticas.minutosPorcentaje+'%)' )
			this.domBody.find('.testEnCurso .determinate.minutosPorcentaje').css('width', estadisticas.minutosPorcentaje+'%')
			}
		else {
			this.domBody.find('.testEnCurso').hide()
			this.domBody.find('.testFinalizado').show()

			var texto='No aprobado ('+estadisticas.nota+')'
			if (estadisticas.nota>5)
				texto='Aprobado ('+estadisticas.nota+')'
			this.domBody.find('.testFinalizado .title').text(texto)

			var f=formato.fechaUHora(estadisticas.fecha)

			this.domBody.find('.testFinalizado .aciertos .v').text(estadisticas.aciertos)
			this.domBody.find('.testFinalizado .fallos .v').text(estadisticas.fallos)
			this.domBody.find('.testFinalizado .nc .v').text(estadisticas.nc)
			
			this.domBody.find('.testFinalizado .minutos .v').text(estadisticas.minutosConsumidos+'/'+estadisticas.minutosTotal+' min')
			this.domBody.find('.testFinalizado .fecha').text(f)
			}
		}
	else 
		this.domBody.find('.testEnCurso, .testFinalizado').hide()

	app.quitaThrobber()
	}
VistaDetalleTest.prototype.backButton=function(){
	var x=jQuery('#frmContinuarTest')
	if (modalIsVisible(x))
		x.closeModal()
	else
		this.cerrar()
	}
VistaDetalleTest.prototype.cerrar=function(){
	VistaFlotante.prototype.cerrar.call(this)

	if (app.config.showAdAtTestDetailsClosed)
		app.showAd()

	this.domHeader.hide()

	var cargarVistaPorDef=false, irATienda=false, irAMisTest=false
	if (app.nav.length==0)
		cargarVistaPorDef=true
	else {
		app.popFromNav()
		var u=app.getLastFromNav()

		if (u!=null && u.vista=='vistaDetalleTest'){
			app.popFromNav()
			u=app.getLastFromNav()
			}

		if (u==null)
			cargarVistaPorDef=true
		else if (u.vista=='vistaTienda')
			irATienda=true
		else if (u.vista=='vistaMisTest')
			irAMisTest=true
		}
	
	if (cargarVistaPorDef || irAMisTest){
		var tl=app.getTestLocales()
		if (tl.length>0){
			app.cargaVistaMisTest(true)
			}
		else 
			irATienda=true
		}
	else 
		irATienda=true

	if (irATienda){
		if (app.vistaTienda.domBody)
			app.vistaTienda.show(true, true)
		else
			app.vistaTienda.toDOM(true)

		app.vistaTienda.scrollTo(this.lastScrollPosition, 100)
		}

	//reseteo la imagen para la siguiente ocasión
	this.domBody.find('.header .portada')[0].src='./images/cats/pack.jpg'
	}
VistaDetalleTest.prototype.tareasPostCarga=function(){
	if (!app.esTablet) jQuery('body > .navbar-fixed > #navigation_bar').hide()
	this.actualizaInfoPantalla(this.test, this.cat)

	this.domBody.find('.slider').slider({height:120, interval:25000, transition:200})    
	}
////
VistaDetalleTest.prototype.toggleLike=function(){
	var cd_test=this.test.cd_test
	var btn=this.domBody.find('.love')
	var i=btn.find('i')
	var s=btn.find('span')
	var diff

	var wasOn=(i.text()=='favorite')	

	if (wasOn){
		i.text('favorite_border')
		diff=-1
		}
	else{
		i.text('favorite')
		diff=1

		if (Math.random()>.8) app.showToast('¡Gracias! yo también te quiero ❤')

		app.vistaMedallero.nuevoLogro('varios_favorito')
		}
	

	var res=Number(s.text())+diff
	if (diff=-1 && res<0) {//parece que hay algún dato mal, que no salga negativo
		res=1 
		i.text('favorite')
		}

	s.text( res )

	var param={accion:'like+', cd_usuario:app.cache.usuario?app.cache.usuario.cd_usuario:null, cd_test:cd_test, cd_device: device.uuid}
	if (wasOn)
		param.accion='like-'
	
	this.test.likes=res
	this.test.fu_modificacion=new Date()
	this.test.likeit=!wasOn

	this.actualizaOcurrenciasTest(this.test)
	this.actualizaRestoVistas('mod', this.test)

	app.post(param,function(data){
		var datos=xeval(data)
		})

	app.trackEvent('test', (param.accion=='like+'?'like':'hate'), this.test.cd_test+'-'+this.test.ds_test)
	}
VistaDetalleTest.prototype.btnLanzaTest_desdeCero=function(){
	var self=this
	var test=this.test
	var resp=buscaFilas(app.cache.respuestasLocales, {cd_test:test.cd_test})[0]

	app.lanzaTest(test, null, self)	
	this.frmdom.closeModal()
	}
VistaDetalleTest.prototype.btnLanzaTest_continuar=function(){
	var self=this
	var test=this.test
	var resp=buscaFilas(app.cache.respuestasLocales, {cd_test:test.cd_test})[0]

	app.lanzaTest(test, resp, self)
	this.frmdom.closeModal()
	}
VistaDetalleTest.prototype.lanzaTest=function(){
	var self=this

	var test=this.test
	var resp=buscaFilas(app.cache.respuestasLocales, {cd_test:test.cd_test})[0]

	if (test.muestraGratis){
		app.lanzaTest(test, null, self)	
		}
	else if (resp){
		this.frmdom=jQuery('.modal#frmContinuarTest')
		if (resp.finalizado){
			this.frmdom.find('.testAMedias').hide()
			this.frmdom.find('.testTerminado').show()
			}
		else {
			this.frmdom.find('.testAMedias').show()
			this.frmdom.find('.testTerminado').hide()
			}

		this.frmdom.openModal({dismissible:true})
		}
	else {
		app.lanzaTest(test, resp, self)	
		}
	}
VistaDetalleTest.prototype.compartir=function(){
	app.compartirTest(this.test)
	}
VistaDetalleTest.prototype.repasarExamen=function(){
	var test=buscaFilas(app.cache.testLocales, {cd_test:this.test.cd_test})[0]
	var resp=buscaFilas(app.cache.respuestasLocales, {cd_test:this.test.cd_test})[0]

	jQuery('.vista.vistaTest').remove()
	new VistaRepasoTest(test, resp, false).toDOM()
	}
//////
VistaDetalleTest.prototype.desinstalarTest=function(){
	var self=this

	var t=this.test.muestraGratis?
		'¿Deseas eliminar la muestra gratis?':
		'¿Deseas desinstalar el test? Puedes volver a instalarlo desde la tienda cuando quieras, sin ningún coste'

	if (isPhone()){
		navigator.notification.confirm(
		    t ,
		    function( buttonIndex ) { 
		        switch ( buttonIndex ) {
		            case 1:
		            	self.doDesinstalarTest()
		                break;
		        	}
		    	},
		    'Confirmar desinstalación', 
		    ['Desinstalar','Cancelar']

			)
		}
	else {
		var r=confirm(t)
		if (r) this.doDesinstalarTest()
		}
	}
VistaDetalleTest.prototype.doDesinstalarTest=function(){
	var cd_test=this.test.cd_test

	var idxBorrar=getIndiceFila(app.cache.testLocales, {cd_test:cd_test})

	while (idxBorrar>-1){
		var xtest=app.cache.testLocales[idxBorrar]
		xtest.muestraGratis=false

		app.cache.testLocales.splice(idxBorrar, 1)
		idxBorrar=getIndiceFila(app.cache.testLocales, {cd_test:cd_test})
		}

	this.salvaTestLocales()

	app.showToast('Test desinstalado')
	this.domBody.removeClass('enMiColeccion')

	this.actualizaOcurrenciasTest(xtest)
	this.currTest=null
	this.actualizaInfoPantalla(this.test, this.cat, null, false)
	this.actualizaRestoVistas('del', xtest)

	if (this.test.muestraGratis)
		app.trackEvent('muestraGratis', 'delete', xtest.cd_test+'-'+xtest.ds_test)
	else
		app.trackEvent('test', 'delete', xtest.cd_test+'-'+xtest.ds_test)
	}
//////
VistaDetalleTest.prototype.muestraProgreso=function(){
	var self=this
	this.progreso=progressJs('body')

	var pp=Math.random()*14+7
	var t=500

	try {
		app.check_appRateDialog()
		}
	catch(e){
		}

    this.progreso.setOptions({overlayMode: true, theme: 'blueOverlayRadiusHalfOpacity'})
	     .start()
	     .autoIncrease( pp, t)
	     .onprogress(function(targetElm, percent) {
	  				if (percent==100){
	  					self.progresoTerminado=true
	  					if (self.testDescargado) self.actualizaResDescarga()
	  					self.progreso.end()
	  					}
	  					
					})
	}
VistaDetalleTest.prototype.actualizaResDescarga=function(){
	var self=this
	//app.showToast(texto || 'Test instalado')
	self.currTest=null
	self.actualizaInfoPantalla(self.test, self.cat, null, true)
	self.progresoTerminado=false
	self.testDescargado=false
	}
VistaDetalleTest.prototype.descargaTest=function(pruebaCompra, texto){
	console.log('>>descargaTest', pruebaCompra)
	var self=this

	app.ponThrobber()
	var xbtn=this.domBody.find('.precio')
	//this.oldBtnText=xbtn.text()
	xbtn.text('Descargando...').addClass('cargando')

	if (pruebaCompra) 
		app.vistaMedallero.nuevoLogro('varios_comprar')
	else if (app.config.showAdAtTestDownload) //gratuito
		app.showAd() 

	self.progresoTerminado=false
	self.testDescargado=false
	this.muestraProgreso()
	console.info('Iniciamos descarga test '+this.test.cd_test)
	app.post({accion:(pruebaCompra?'getTestComprado':'getTest'), cd_test:this.test.cd_test, cd_device:device.uuid, pruebaCompra:pruebaCompra?JSON.stringify(pruebaCompra):null},
		function(data){
			var datos=xeval(data)
			if (datos.retorno==1){
				datos.test.fu_modificacion=new Date()

				self.test.lotengo=true
				self.actualizaOcurrenciasTest(self.test)
				self.anhadeATestLocales(datos.test)

				//app.cache.categorias=datos.cats
				var xcat=datos.test.liscat.split(',')[1]
				
				self.cat=self.getCat(xcat)
				self.test=datos.test
				self.testDescargado=true
				if (self.progresoTerminado) self.actualizaResDescarga()

				console.info('test '+datos.test.cd_test+' descargado!, '+datos.test.numpreguntas+' preguntas')

				app.trackEvent('test', (pruebaCompra?'download-paid':'download-free'), datos.test.cd_test+'-'+datos.test.ds_test)
				}
			else {
				app.trackEvent('test', (pruebaCompra?'download-paid-error':'download-free-error'), self.test.cd_test+'-'+datos.msgError)
				app.alert('Ha habido un problema al descargar el test', 'Descarga no disponible')
				console.error(data)
				xbtn.removeClass('cargando').text('Error al descargar')
				}
			app.quitaThrobber()
			})
	}
VistaDetalleTest.prototype.preparaCompraTest=function(){
	var self=this

	var xbtn=this.domBody.find('.precio')
	// xbtn.text('Conectando...').addClass('cargando')
	
	if (!window.store) {
        app.alert('Ha habido un problema al tratar de acceder a la tienda', 'Tienda no disponible')
        console.info('Store not available')
        return
    	}

	var prod
	
    if (device.platform=='iOS'){
    	prod=this.test.iap_ios
    	this.compra=new CompraIOS(prod)
    	}
    else if (device.platform=='Android'){
    	prod=this.test.iap_android
    	this.compra=new CompraAndroid(prod)
    	}
    
    if (prod==''){//no está bien dado de alta en BD
    	app.alert('Este test no se puede comprar en este momento', 'Test no disponible')
    	app.quitaThrobber()
    	return
    	}

    this.iniciaTienda(
    	prod,
    	function(){
    		self.compra.iniciaProducto()
    	})

	}
VistaDetalleTest.prototype.iniciaTienda=function(soloProdSeleccionado, fnCallBack){
	var self=this

	if (app.cache.testTienda==null){
		VistaTienda.prototype.doLeeTestTienda(function(datos){ 
			app.cache.testTienda=datos
			self.iniciaTienda(soloProdSeleccionado, fnCallBack)
			} )
		return
		}

	//store.verbosity = store.DEBUG // Enable maximum logging level
	if (this.tiendaIniciada) {
		console.log('Inicializar tienda --> ya inicializada')
		fnCallBack()
		return
		}

	// Inform the store of your products
    console.info('registerProducts')

    if (soloProdSeleccionado){
    	var xkeys=Object.keys(store.products.byAlias)
    	if (xkeys.indexOf(xp)==-1){
			store.register({
		        id:     soloProdSeleccionado,
		        alias: 	soloProdSeleccionado,
		        type:   store.NON_CONSUMABLE
		    	})
			}
    	}
    else {
    	var xkeys=Object.keys(store.products.byAlias)
	    for (var i=0; i<app.cache.testTienda.length; i++){
	    	var xt=app.cache.testTienda[i]
	    	var xp=(device.platform=='iOS'? xt.iap_ios : xt.iap_android)

	    	var xkeys=Object.keys(store.products.byAlias)
		    if (xp==null){
		    	}
		    else if (xkeys.indexOf(xp)==-1){
			    store.register({
			        id:     xp,
			        alias: 	xp,
			        type:   store.NON_CONSUMABLE
			    	})
			    }
		    }
    	this.tiendaIniciada=true
    	}

	fnCallBack()
	}
VistaDetalleTest.prototype.muestraGratis=function(){
	var self=this

	app.ponThrobber()
	var cd_test=this.test.cd_test

	var xbtn=this.domBody.find('.precio')
	//this.oldBtnText=xbtn.text()
	xbtn.text('Descargando...').addClass('cargando')

	console.info('Iniciamos descarga muetra gratis test '+cd_test)
	app.post({accion:'getMuestraGratis', cd_test:cd_test, cd_device:device.uuid},
		function(data){
			var datos=xeval(data)
			if (datos.retorno==1){

				datos.test.fu_modificacion=new Date()
				datos.test.muestraGratis=true
				self.actualizaOcurrenciasTest(datos.test)

				self.anhadeATestLocales(datos.test)

				app.cache.categorias=app.cache.categorias || datos.cats
				var xcat=datos.test.liscat.split(',')[1]
				
				self.cat=self.getCat(xcat)
				self.test=datos.test

				self.currTest=null

				setTimeout(function(){
					app.showToast('Muestra gratis instalada')
					self.actualizaInfoPantalla(self.test, self.cat, null, true)
					},1500)
				console.info('Muestra gratis '+cd_test+' descargado!, '+datos.test.numpreguntas+' preguntas')

				app.trackEvent('muestraGratis', 'download', datos.test.cd_test+'-'+datos.test.ds_test)
				}
			else {
				app.alert('Ha habido un problema al descargar el test', 'Descarga no disponible')
				console.error(data)
				xbtn.removeClass('cargando').text('Error al descargar')

				app.trackEvent('muestraGratis', 'download-error', datos.test.cd_test+'-'+datos.test.ds_test)
				}
			})
	}
////////////////////////////////////////////////
function VistaMedallero(desdeHistorial){
	// https://docs.google.com/presentation/d/1dKUvDuPFhj0DnoNAB55wE9923itmHKf0FAGFptMf6FQ/pub?start=false&loop=false&delayms=3000&slide=id.gaf1640f1c_1_378

	this.authenticated=false
	this.plat=null
	
	if (device.platform=='iOS')//gamecenter
		this.plat='ios'
	else if (device.platform=='Android') //googleplay
		this.plat='android'
	else//web
		this.plat='web'
		
	this.init()
	}
VistaMedallero.prototype=new Vista
VistaMedallero.prototype.keyLogros='tapp37_playcenter_logrosnoenviados'
VistaMedallero.prototype.keyPuntos='tapp37_playcenter_puntuacionesnoenviadas'
VistaMedallero.prototype.resetAutologin=function(){
	save('tapp37_playcenter_autologin',1)
	}
VistaMedallero.prototype.listaLogros=[
	{android:'', 					ios:'usoApp_novato'},
	{android:'', 					ios:'usoApp_avanzado'},
	{android:'', 					ios:'usoApp_experto'},

	{android:'', 					ios:'porcentajefallos_15'},
	{android:'', 					ios:'porcentajefallos_5'},
	{android:'', 					ios:'porcentajefallos_0'},

	{android:'', 					ios:'velocidad_80'},
	{android:'', 					ios:'velocidad_70'},
	{android:'', 					ios:'velocidad_50'},

	{android:'CgkIiYSmvpULEAIQAQ', 	ios:'varios_favorito'}, //impl
	{android:'CgkIiYSmvpULEAIQAg', 	ios:'varios_compartir'},//impl
	{android:'CgkIiYSmvpULEAIQBA', 	ios:'varios_comprar'}, //impl
	{android:'CgkIiYSmvpULEAIQAw', 	ios:'varios_corrector'},//impl

	{android:'',					ios:'varios_2horastest'},
	{android:'',					ios:'varios_repaso'},
	
	{android:'',					ios:'varios_enviartest'},
	{android:'CgkIiYSmvpULEAIQBQ', 	ios:'varios_onfire'},
	]
VistaMedallero.prototype.tablaGlobal={	cd_categoria:0,  
										android:'CgkIiYSmvpULEAIQBw', 
										ios:'octopus_globalLeaderBoard'}
VistaMedallero.prototype.getUserAuthenticated=function(){
	return this.authenticated
	}
VistaMedallero.prototype.init=function(fnCallBack){
	if (!isPhone()) 
		return false
		
	var autologin=get('tapp37_playcenter_autologin')
	if (autologin==null || autologin==0)
		return

	if (this.plat=='ios')
		this.iosSetUp(fnCallBack)
	else if (this.plat=='android')
		this.androidSetUp(fnCallBack)
	}
VistaMedallero.prototype.iosSetUp=function(fnCallBack){
	var self=this

	this.gc=gameCenter
	if (this.gc==null) return
	
	var msgError='Se ha producido un error al contactar con Game Center. Inténtalo más tarde, por favor.'
	this.gc.authenticate(
		function(result){
			self.authenticated=true
			self.user=result
			self.resetAutologin()

			console.log('onLoginSucceeded: ')
			console.log(result)

			self.sincronizaPuntuaciones()
	        self.sincronizaLogros()

			if (fnCallBack)
				fnCallBack()
			}, 
		function(){
			console.log('onLoginFailed')

			if (get('tapp37_playcenter_autologin')!=null)
				app.showToast(msgError)
				
			save('tapp37_playcenter_autologin', 0)
			} 
		)
	}
VistaMedallero.prototype.androidSetUp=function(fnCallBack){
	var self=this

	var msgError='Se ha producido un error al contactar con Play Games. Inténtalo más tarde, por favor.'
	this.gc=window.game
	if (this.gc==null) return

	this.gc.onLoginSucceeded =function(userData) {
    	self.authenticated=true
        self.resetAutologin()

        save('tapp37_playcenter_autologin', 1)
        console.log('onLoginSucceeded')

        self.sincronizaPuntuaciones()
        self.sincronizaLogros()

		self.callbackGetPlayerData(userData)

		if (fnCallBack)
			fnCallBack()
    	}
    this.gc.onLoginFailed = function() {
        console.log('onLoginFailed')
	    save('tapp37_playcenter_autologin', 0)
		app.showToast('No se ha podido hacer login en Google Play Games')
    	}
    this.gc.setUp()
    this.gc.login()

	}
VistaMedallero.prototype.callbackGetPlayerData=function(data){
	self.user=data
	}
VistaMedallero.prototype.getPlayerImage=function(){
	}
VistaMedallero.prototype.toDOM=function(){
	app.trackView(this.id)
	if (this.authenticated)
		this.muestraLogros()
	}
VistaMedallero.prototype.show=function(){}
// VistaMedallero.prototype.getLogros=function(){
// 	if (!this.authenticated) return 
	
// 	var self=this
// 	// var successCallback = function (results) {
// 	// 	self.user.logros=results
//  	//    	console.log(self.user.logros)
// 	//     }

// 	this.gc.showAchievements()
// 	}
VistaMedallero.prototype.log=function(t){
	// app.showToast(t)
	console.log(t)
	}
////
VistaMedallero.prototype.muestraLogros=function(){
	if (!this.authenticated) {
		this.resetAutologin()
		this.init( function(){self.muestraTablaPuntuacion()} )
		}

	var self=this	
	if (this.plat=='ios'){
		this.gc.showAchievements(self.log, self.log)
		app.trackView('vistaMedallero-ios')
		}
	else if (this.plat=='android'){
		this.gc.showAchievements()
		app.trackView('vistaMedallero-android')
		}
	else if (this.plat=='web')
		console.log('>>show achievements')
	}
VistaMedallero.prototype.muestraTablaPuntuacion=function(){
	var self=this
	if (!this.authenticated) {
		this.resetAutologin()
		this.init( function(){self.muestraTablaPuntuacion()} )
		}

	var tabla=this.tablaGlobal

	var self=this	
	if (this.plat=='ios'){
		this.gc.showLeaderboard(tabla.ios, self.log, self.log)
		app.trackView('vistaPuntuaciones-ios')
		}
	else if (this.plat=='android'){
		// this.gc.showLeaderboard({leaderboardId:tabla.android}, self.log, self.log)
		this.gc.showLeaderboard(tabla.android)
		app.trackView('vistaPuntuaciones-android')
		}
	else if (this.plat=='web')
		console.log('>>show leaderboard:'+tabla)
	}
////
VistaMedallero.prototype.sincronizaLogros=function(){
	var logros=get(this.keyLogros) || []
	for (var i=0; i<logros.length; i++){
		this.nuevoLogro( logros[i] )
		}
	localStorage.removeItem(this.keyLogros)
	
	if (logros.length) app.trackEvent('achievement', 'synced', 'all')
	}
VistaMedallero.prototype.sincronizaPuntuaciones=function(){
	var puntos=get(this.keyPuntos) || []
	for (var i=0; i<puntos.length; i++){
		this.enviaPuntuacion( puntos[i] )
		}
	localStorage.removeItem(this.keyPuntos)
	
	if (puntos.length) app.trackEvent('score', 'synced', 'all')
	}
////
VistaMedallero.prototype.nuevoLogro=function(logro){
	var logros=get(this.keyLogros) || []
	logros.push(logro)
	save(this.keyLogros, logros)

	if (!this.authenticated) return 

	var self=this
	var cat=buscaFilas(this.listaLogros, {ios:logro})[0]
	if (cat==null){
		console.log('Logro no encontrado: '+logro)
		return
		}
	
	if (this.plat=='ios' && cat.ios!=''){
		this.gc.reportAchievement(cat.ios, self.log, self.log)
		app.trackEvent('achievement', 'unlocked', 'ios-'+logro)
		}
	else if (this.plat=='android' && cat.android!=''){
		// this.gc.unlockAchievement({achievementId:cat.android})
		this.gc.unlockAchievement(cat.android)
		app.trackEvent('achievement', 'unlocked', 'android-'+logro)
		}
	}
VistaMedallero.prototype.enviaPuntuacion=function(puntuacion, cat){
	var self=this

	var puntuaciones=get(this.keyPuntos) || []
	puntuaciones.push(puntuacion)
	save(this.keyPuntos, puntuaciones)

	if (!this.authenticated) return 

	var tabla=this.tablaGlobal

	if (this.plat=='ios'){
		this.gc.reportScore(tabla.ios, puntuacion, self.log, self.log)
		app.trackEvent('score', 'submitted', 'ios-'+puntuacion)
		}
	else if (this.plat=='android'){
		// this.gc.submitScore({score:puntuacion, leaderboardId:tabla.android})
		this.gc.submitScore(puntuacion, tabla.android)
		app.trackEvent('score', 'submitted', 'android-'+puntuacion)
		}
	}
////////////////////////////////////////////////
function VistaEstadisticas(desdeHistorial){
	Vista.call(this, desdeHistorial)

	this.id='vistaEstadisticas'
	this.title='Estadísticas'

	if (!desdeHistorial) 
		app.pushState(this.id)
	}
VistaEstadisticas.prototype=new Vista
VistaEstadisticas.prototype.showMenu=function(){
	this.domMenu.hide()
	}
VistaEstadisticas.prototype.getHeader=function(){
	return null //creaObjProp('header', {className:'vista-header', 'style.display':'none'})
	}
VistaEstadisticas.prototype.getBody=function(){
	var todos=app.getRespuestasLocales() //this.testData()
	app.cache.respuestasLocales=buscaFilas(todos, {finalizado:true})

	var paneles=[]
	if (app.cache.respuestasLocales.length>0){
		var self=this
		
		this.cats=app.catsConRespuestasLocales()
		this.resps=buscaFilas( app.cache.respuestasLocales, {finalizado:true} )

		this.resps.sort(function(a,b){return new Date(a.fecha)>new Date(b.fecha)})

		var _idx=0
		this.resps.map(function(el){el._idx=_idx; _idx++})

		for (var i=0; i<this.cats.length; i++){
			var cat=this.cats[i]
			
			if (cat==null) 
				continue
			else if (cat.cd_categoria<0) 
				continue

			var respsCat=buscaFilas(this.resps, {_contains_liscat:','+cat.cd_categoria+','})
			this.cats[i].resps=respsCat

			var fIni=formato.fechaDDMMYYYY(respsCat[0].fecha)
			var fFin=formato.fechaDDMMYYYY(respsCat[respsCat.length-1].fecha)
			if (fFin==formato.fechaDDMMYYYY(new Date()))
				fFin='hoy'

			var domgra1=creaObjProp('div', {className:'bl row-body gra gra1'})

			var t=(respsCat.length>1?
				(respsCat.length+' test realizados entre '+fIni+' y '+fFin):
				('1 test realizado en '+fIni) )

			paneles.push(
				creaObjProp('div', {className:'row panelCat', 'data-id':cat.cd_categoria, hijos:[
					creaObjProp('h5', {className:'row-header m-b-none', texto:cat.ds_categoria}),
					creaObjProp('small', {texto:t}),
					this.creaPanel('Aciertos y fallos por test', domgra1),
					]})
				)
			this.fnPintaGraficaEstadisticasPorExamen(domgra1, i)
			}
		}
	else {
		paneles.push(
			this.admonition('Sin datos', 'Hasta que no termines algún test no habrá estadísticas', 'not_interested')
			)
		}

	app.quitaThrobber()
	return creaObjProp('div', {className:'vista-body container', hijos:paneles})
	}
VistaEstadisticas.prototype.backButton=function(){
	}
VistaEstadisticas.prototype.show=function(desdeHistorial){
	Vista.prototype.show.call(this, desdeHistorial)

	app.clearNav()
	app.pushState(this.id)
	if (!desdeHistorial) {
		app.addToNav({vista:this.id})
		}
	}
VistaEstadisticas.prototype.creaPanel=function(tit, cont){
	return creaObjProp('section', {className:'panel panel-default', hijos:[
					creaObjProp('header', {className:'panel-heading', texto:tit}),
					creaObjProp('div', {className:'panel-body', hijo:cont}),
					]})
	}
VistaEstadisticas.prototype.fnPintaGraficaEstadisticasPorExamen=function(panel, i){
	var self=this
	setTimeout( function(){self.pintaGraficaEstadisticasPorExamen(panel)}, 200*i)
	}
VistaEstadisticas.prototype.pintaGraficaEstadisticasPorExamen=function(panel){
	var self=this

	var catID=jQuery(panel).closest('.panelCat').data('id')

	var col=buscaFilas(this.cats, {cd_categoria:catID})[0].resps
	var maxPuntos=8
	var p0=Math.max(col.length-maxPuntos, 0)

	var aciertos=[], fallos=[], nc=[]
	for (var i=p0; i<col.length; i++){
		var r=col[i]

		aciertos.push([i, r.aciertos])
		fallos.push([i, r.fallos])
		nc.push([i, r.nc])
		}

	var gridOptions={ 
		series: {
        	lines: {
                show: true,
                lineWidth: 2,
                fill: true,
                fillColor: { colors: [{opacity: 0.3}, {opacity: 0.1}] }
            	},
            points: {radius: 5, show: true},
            grow: {active: true, steps: 5},
            shadowSize: 2
        	},
        grid: {
            hoverable: true,
            // clickable: true,
            tickColor: "#f0f0f0",
            borderWidth: 0
        	},
        colors: ["#25313e", "#fb6b5b", "#dddddd",],
        xaxis: {ticks: 5, show:false},
        yaxis: {ticks: 5},
        tooltip: true,
        tooltipOpts: {
          	content: function(label, xval, yval, flotItem){
          		return self.graphTooltip(catID, label, xval, yval, flotItem)
          		},
          	defaultTheme: false,
          	shifts: {x: 0,y: 20}
        	}
      	}

  	jQuery.plot(panel, 
  				[{data: aciertos,label: ' % Aciertos'}, {data: fallos, label: ' % Fallos'}, {data: nc, label: ' % No contestadas'}],
      			gridOptions)
	}
VistaEstadisticas.prototype.graphTooltip=function(catID, label, xval, yval, flotItem){
	var resps=buscaFilas(this.cats, {cd_categoria:catID})[0].resps
	var r=resps[xval]

	return  'Nota: '+r.nota+
			'<small class="f">'+formato.fechaDDMMYYYY(r.fecha)+'</small>'+
			'<br/>'+
			//+'(idx '+xval+')'+
			'<small>'+r.aciertos+' aciertos, '+
			r.fallos+' fallos y '+
			r.nc+' nc </small>'
	}
VistaEstadisticas.prototype.rnd=function(n, m){
	return Math.floor((Math.random() * m) + n)
	}
VistaEstadisticas.prototype.testData=function(){
	var numpreg=100, fr=.333
	var ret=[]

	for (var i=0; i<35; i++){
		// var a=i, f=0, nc=0
		var a=this.rnd(1,numpreg)
		var f=this.rnd(0, numpreg-a)
		var nc=numpreg-a-f

		var tn= (a-(f*fr))/numpreg
		if (tn<0) tn=0
		var nota=Math.floor(tn*100)/10

		var el={
				fecha: new Date(new Date()-3600*1000*24*this.rnd(0,10)),
				aciertos:a,
				fallos:f,
				nc:nc,
				nota:nota,
				liscat:','+([201,250,104][this.rnd(0,3)])+',',
				finalizado:true,
				}
		// jQuery.extend(el, { aciertos:i, fallos:80-i, nc:5, nota:0, 
		// 					fecha:new Date(new Date().getTime()+3600*1000*24*(i-30)),
		// 					liscat:',201,'})

		ret.push(el)
		}
	return ret
	}
VistaEstadisticas.prototype.toggleMenuGlobal=function(visible){
	var menu=jQuery('.barra.global .btn-menu')	
	
	if (visible)
		menu.fadeIn()
	else
		menu.fadeOut()
	}
////////////////////////////////////////////////
function VistaAjustes(desdeHistorial){
	this.id='vistaAjustes'
	this.title='Ajustes'

	this.txtEnviarMensaje=null
	}
VistaAjustes.prototype=new Vista
VistaAjustes.prototype.showMenu=function(){
	this.domMenu.hide()
	}
VistaAjustes.prototype.getHeader=function(){
	return null //creaObjProp('header', {className:'vista-header', 'style.display':'none'})
	}
VistaAjustes.prototype.getBody=function(){
	var self=this

	var paneles=[
		this.ncheck(null, 'Pasar página automático', 'chk_pasarPaginaAuto', app.cache.pasarPaginaAuto, 'Al seleccionar una respuesta, la página cambia automáticamente'),
		
		creaObjProp('div', {className:'ios android row separator'}),
		
		this.nfila('ios android',
					'Soporte de la app',
					null,
					'build',
					function(){self.btnCorreoSoporte()}
					),

		this.nfila('ios android',
					'Enviar un test',
					null,
					'mail',
					function(){self.btnEnvianosTest()}
					),

		
	
		this.nfila('ios android',
					'Invitar a un amigo',
					null,
					'share',
					function(){self.btnInvitarAmigo()}
					),

		creaObjProp('div', {className:'ios android row separator'}),
		this.nfila('ios android',
					'Octopus en la web', 
					null, 
					'web',
					function(){self.btnAbrirNavegadorExterno('http://www.octopusapp.es/web')}),

		// creaObjProp('div', {className:'android row separator'}),
		this.nfila('ios android',
					'Convenios con academias', 
					null, 
					'supervisor_account',
					function(){self.btnAbrirNavegadorExterno('http://www.octopusapp.es/web/faq.html#convenios')}),
		
		this.nfila( 'ios android canjearCodigo',
					'Canjear un código', 
					'txtCodPromo',
					'card_giftcard',
					function(){self.btnIntroducirCodigo()}
					),
		
		creaObjProp('div', {className:'ios row separator'}),
		this.nfila('ios',
					'Restaurar compras', 
					null,
					'history',
					function(){self.restaurarCompras()}
					),
		
		]

	
	return creaObjProp('div', {className:'vista-body container config', hijos:paneles})
	}
VistaAjustes.prototype.restaurarCompras=function(){
	var self=this

	if (!isPhone()){
		navigator.notification.alert('Esta opción no está disponible en la plataforma Web', null, 'Restaurar compras')
		}
	else {
		navigator.notification.confirm(
			'Si has reinstalado la app o cambiado tu dispositivo puedes recuperar las compras que ya hubieras hecho en nuestra tienda',
		    function( buttonIndex ) { 
		        switch ( buttonIndex ) {
		            case 1:
		            	self.unRegister()
		            	self.doRestaurarCompras()
		                break;
		        	}
		    	},
		    'Restaurar compras', 
		    ['Restaurar', 'Cancelar']
		    )
		}
	}
///
VistaAjustes.prototype.btnInvitarAmigo=function(){
	app.enviarInvitacion()
	}
VistaAjustes.prototype.btnEnvianosTest=function(){
	var fnCallBack=function(ok){
		if (ok) {
			app.vistaMedallero.nuevoLogro('varios_enviartest')
			app.trackEvent('app', 'new-test-submitted')
			}
		}
	try{
		window.plugins.socialsharing.shareViaEmail(
			'[RECUERDA ADJUNTAR EL ARCHIVO PDF, DOC O SIMILAR]<br><br>Hola,<br><br> os envío un nuevo test para que lo incorporéis a Octopus.<br><br>:)', 
			'Nuevo test para Octopus', 
			['8ctopusapp@gmail.com'], 
			null, // CC: must be null or an array
			null, // BCC: must be null or an array
			null, // files
			fnCallBack)
		}
	catch (e){}
	}
VistaAjustes.prototype.btnCorreoSoporte=function(){
	var fnCallBack=function(ok){
		if (ok) {
			app.trackEvent('app', 'support-request-submitted')
			}
		}
	try{
		window.plugins.socialsharing.shareViaEmail(
			'[POR FAVOR, INDÍCANOS EN QUÉ PODEMOS AYUDARTE. TE ATENDEREMOS LO MÁS RÁPIDO POSIBLE]<br><br>Hola,<br><br> tengo una consulta.<br><br>:)', 
			'Solicitud de soporte', 
			['8ctopusapp@gmail.com'], 
			null, // CC: must be null or an array
			null, // BCC: must be null or an array
			null, // files
			fnCallBack
			)
		}
	catch (e){}
	}
VistaAjustes.prototype.ncheck=function(className, texto, id, value, textoExtendido){
	var self=this
	// return creaObjProp('div', {className:'switch row '+className, hijos:[
	// 			creaObjProp('label', {className:'col-xs-12 valor ellipsis', hijos:[
	// 				creaT(texto),
	// 				creaObjProp('input', {type:'checkbox', id:id, checked:value}),
	// 				creaObjProp('span', {className:'lever'}),
	// 				]}),
	// 			creaObjProp('small', {texto:textoExtendido})
	//  		]})
	return creaObjProp('div', {className:'xswitch row '+className, hijos:[
				creaObjProp('p', {className:'row padding0', hijos:[
					
				
					creaObjProp('label', {htmlFor:id, className:'padding0 col s10 valor ellipsis', texto:texto}),
					creaObjProp('input', {type:'checkbox', id:id, checked:value }),
					]}),
				creaObjProp('small', {className:'col s10', texto:textoExtendido})
	 		]})
	}
VistaAjustes.prototype.nfila=function(className, texto, id, i, onclick){
	var obji=creaT('')
	if (i)
		obji=creaObjProp('i', {className:'mdx right', texto:i})

	return creaObjProp('div', {className:'row '+className, onclick:onclick, hijos:[
				creaObjProp('span', {className:(i!=null?'col-xs-10':'col-xs-12')+' valor ellipsis '+id, texto:texto}),
				obji
	 		]})
	}
VistaAjustes.prototype.btnIntroducirCodigo=function(){
	var self=this

	// if (isPhone()){
		navigator.notification.prompt(
		    'Código promocional',
		    function( result ) { //result.buttonIndex y result.input1
		        switch ( result.buttonIndex ) {
		            case 1:
		            	app.post({accion:'compruebaCodigoPromocional', 
		            								cod:result.input1 },
							function(data){
								var datos=xeval(data)
								if (datos.retorno==1){
									var resp=datos.resp, msg

									if (resp.promocioninexistente || resp.usuyaenpromocion || resp.agotada || resp.caducada){
										if (resp.promocioninexistente=='1')
											msg='Código incorrecto'
										else if (resp.usuyaenpromocion=='1')
											msg='Ya te has beneficiado de esta promoción'
										else if (resp.agotada=='1')
											msg='Lo lamentamos, esta promoción ya está agotada'
										else if (resp.caducada=='1')
											msg='Lo lamentamos, esta promoción ya ha terminado'
										}
									else {
										msg=resp.resp_promocion
										}
									self.domBody.find('#txtCodPromo').text(result.input1)
									app.alert(msg, 'Código promocional')
									}
	            				
								})
							
		                break;
		            case 2:
		                break;
		        }
		    },
		    'Octopus',     // a title
		    [ "Aceptar", "Cancelar" ], // text of the buttons
		    null //valor por defecto
			)
	// 	}
	// else {
		
	// 	}
	}
VistaAjustes.prototype.show=function(desdeHistorial){
	Vista.prototype.show.call(this, desdeHistorial)

	app.clearNav()
	app.pushState(this.id)
	if (!desdeHistorial) {
		app.addToNav({vista:this.id})
		}
	}
VistaAjustes.prototype.tareasPostCarga=function(desdeHistorial){
	var self=this
	Vista.prototype.tareasPostCarga.call(this)

	this.domBody.find('#chk_pasarPaginaAuto:checkbox').iphoneStyle({
		onChange: function(elem, value) { 
          	self.setPasarPaginaAuto(value)
          	console.log('changed', value)

          	var d=jQuery(elem).closest('.row').find('.iPhoneCheckContainer')
          	if (value) 
          		d.removeClass('off')
          	else
          		d.addClass('off')
        }
	})

	var dd=jQuery('#chk_pasarPaginaAuto').closest('.row').find('.iPhoneCheckContainer')
	if (!app.cache.pasarPaginaAuto)
		dd.addClass('off')


	app.pushState(this.id)
	if (!desdeHistorial) {
		app.addToNav({vista:this.id})
		}
	app.quitaThrobber()
	}
VistaAjustes.prototype.setPasarPaginaAuto=function(v){
	app.cache.pasarPaginaAuto=v
	save('tapp37_pasarPaginaAuto', app.cache.pasarPaginaAuto?1:0)
	}
VistaAjustes.prototype.toggleMenuGlobal=function(visible, inmediate){
	var menu=jQuery('.barra.global .btn-menu')		
	menu.fadeOut()
	}
////////////////////////////////////////////////
Controlador.prototype.cargaVistaMigraTest=function(desdeHistorial){
	new VistaMigraTest(desdeHistorial).toDOM()
	if (!desdeHistorial) this.cierraNavDrawer()
	}
function VistaMigraTest(desdeHistorial){
	this.id='vistaMigraTest'

	if (!desdeHistorial) 
		app.pushState(this.id)
	}
VistaMigraTest.prototype=new Vista
VistaMigraTest.prototype.getHeader=function(){
	var self=this

	
	// return creaObjProp('header', {className:'btn-primary vista-header btn-dark' , hijos:[
	// 		creaObjProp('div', {className:'btn-group', hijos:[

	// 			creaObjProp('div', {className:'btn-group', hijos:[
	// 				creaObjProp('button', {className:'btn btn-dark dropdown-toggle', 'data-toggle':'dropdown', hijos:[
	// 					creaT(' Lista de categorias '),
	// 					creaObjProp('b', {className:'caret'})
	// 					]}), 
	// 				this.ulCategorias[0],
	// 				]}),

	// 		]}),
			
	// 	]})
	// }
	var self=this

	this.ulCategorias=jQuery( 
		creaObjProp('ul', {id:'categorias', className:'dropdown-content'})
		)

	return [
		creaObjProp('nav', {className:'vista-header '+this.id, hijos:[
			creaObjProp('div', {className:'nav-wrapper row padding0 bg-tienda', hijos:[
				creaObjProp('ul', {className:'left col s12 row ', hijos:[
					creaObjProp('li', {className:'col s5 m3', hijos:[
						creaObjProp('a', {id:'btn-categorias', className:'dropdown-button', texto:'Categorias', mi:'arrow_drop_down', 'data-activates':'categorias' }),
						this.ulCategorias[0],
						] }),
					]})
				]}),
			]})
		]
	}
VistaMigraTest.prototype.getBody=function(){
	this.btn=jQuery( creaObjProp('button', {texto:'Verifica test y sube', 
									mi:'cloud_upload', 
									className:'btn btn-default btn-lg',  
									'style.width':'100%',
									onclick:function(){app.vistaActiva.uploadTest()} }) 
				)
	this.txtDatos= jQuery( creaObjProp('textarea', {'style.width':'100%', 'style.height':'150px', className:'bl', id:'txtDatos'}) )
	this.txtPreguntas= jQuery( creaObjProp('textarea', {'style.width':'100%', 'style.height':'200px', className:'bl', id:'txtPreguntas'}) )
	this.spError=jQuery( creaObjProp('span', {className:'msgError label label-danger'}) )

	return creaObjProp('div', {className:'vista-body', hijos:[
			creaObjProp('span', 	{className:'bl', texto:'JSON datos generales'}),
			this.txtDatos[0],
			
			creaObjProp('span', 	{className:'bl', texto:'JSON preguntas'}),
			this.txtPreguntas[0],
			
			this.btn[0],
			this.spError[0]
		]})
	}
VistaMigraTest.prototype.tareasPostCarga=function(){
	var plantillaDG={
		ds_test:'Identificación del examen',
		organismo:'Organismo (por ej, "Administración General del Estado")',
		numpreguntas:100,
		minutos:100,
		fallosrestan:.5,
		precio:0, 
		liscat:'201',
		}
	var plantillaPreguntas={
		cd_pregunta:0,
		pregunta: "Texto pregunta",
		cd_respuestacorrecta: 0,

		respuesta0:"Respuesta1",
		respuesta1:"Respuesta2",
		respuesta2:"Respuesta3",
		respuesta3:"Respuesta4",
		respuesta4:"Respuesta5",

		notas:'Unidad u otros datos'
		}

	var plantillaDG='{'+vbCrLf+
		'  "ds_test": "Identificaci\u00f3n del examen",'+vbCrLf+
		
		'  "anho": "2018",'+vbCrLf+
		'  "grupo": "Grupo X",'+vbCrLf+

		'  "organismo": "Organismo",'+vbCrLf+
		'  "numpreguntas": 100,'+vbCrLf+
		'  "minutos": 100,'+vbCrLf+
		'  "fallosrestan": 0.5,'+vbCrLf+
		'  "precio": 0,'+vbCrLf+
		'  "liscat": "201",'+vbCrLf+
		
		'  "archivos": "2014/nombreArchivo1.pdf,"'+vbCrLf+
		'}'
	var plantillaPreguntas='{'+vbCrLf+
		'  "cd_pregunta": 0,'+vbCrLf+
		'  "pregunta": "Texto pregunta",'+vbCrLf+
		'  "cd_respuestacorrecta": 0,'+vbCrLf+
		'  "respuesta0": "Respuesta1",'+vbCrLf+
		'  "respuesta1": "Respuesta2",'+vbCrLf+
		'  "respuesta2": "Respuesta3",'+vbCrLf+
		'  "respuesta3": "Respuesta4",'+vbCrLf+
		'  "respuesta4": "Respuesta5",'+vbCrLf+
		'  "notas": "Unidad u otros datos"'+vbCrLf+
		'}'

	this.txtDatos.val( plantillaDG )
	this.txtPreguntas.val( '['+plantillaPreguntas+']' )

	this.cargaListaCategorias()
	app.quitaThrobber()
	}
VistaMigraTest.prototype.toggleMenuGlobal=function(visible, inmediate){
	var menu=jQuery('.barra.global .btn-menu')		
	menu.fadeOut()
	}
VistaMigraTest.prototype.cargaListaCategorias=function(){
	var self=this
	
	var xl=[]
	// var fn=function(){
	// 	var idcat=jQuery(this).data('id')
	// 	self.navegaCat(idcat) 
	// 	}

	for (var i=0; i<app.cache.categorias.length; i++){
		var cat=app.cache.categorias[i]
		
		if (cat.cd_categoria<0) continue
		xl.push( creaObjProp('li', {hijo:creaObjProp('a', {texto:cat.cd_categoria+'-'+cat.ds_categoria})} ) )
		}
	this.ulCategorias.empty().append(xl)
	this.domHeader.find('#btn-categorias').dropdown({
		belowOrigin:true,
		constrain_width: false
		})
	}
VistaMigraTest.prototype.quitaAcutes=function(s){
	var trans={
		'&iquest;':'¿',

		'&aacute;':'á','&Aacute;':'Á',
		'&eacute;':'é','&Eacute;':'É',
		'&iacute;':'í','&Iacute;':'Í',
		'&oacute;':'ó','&Oacute;':'Ó',
		'&uacute;':'ú','&Uacute;':'Ú',

		'&ntilde;':'ñ',

		'&lsquo;':'"', '&rsquo;':'"',
		'&ldquo;':'"', '&rdquo;':'"',
		'&laquo;':'"', '&raquo;':'"',
		'&quot;':'"',

		'&gt;':'"', '&lt;':'"',
		}
	var claves=Object.keys(trans)
	for (var i=0; i<claves.length; i++){
		var k=claves[i], v=trans[k]
		s=s.replace(new RegExp(k, 'g'), v)
		}

	var esta=s.indexOf(')  ')
	if (esta>-1 && esta<=6 )
		s=s.substring(esta+3)
	return s
	}
VistaMigraTest.prototype.xeval=function(s){
	var s=s.replace(/(\r\n|\n|\r)/gm,"")
	return JSON.parse(s)
	}
VistaMigraTest.prototype.montaTest=function(){
	this.spError.text('')

	var test=this.xeval( this.txtDatos.val() )
	var preguntas=this.xeval( this.txtPreguntas.val() )
	test.preguntas=preguntas

	this.assert(preguntas instanceof Array, 'No viene un array de preguntas')
	this.assert(preguntas.length==test.numpreguntas, 'El número de preguntas indicado en datos generales ('+test.numpreguntas+
												') no coincide con la cantidad de preguntas introducida ('+preguntas.length+')')
	return test
	}
VistaMigraTest.prototype.assert=function(condition, message){
    if (!condition) {
        message = message || "Assertion failed";
        // if (typeof Error !== "undefined") {
        //     throw new Error(message);
        // 	}
        // throw message; // Fallback
        this.spError.text(message)
        throw message;
    	}
	}
VistaMigraTest.prototype.uploadTest=function(){
	var test=this.montaTest()
	
	app.post({accion:'creaBorradorTest', secret:get('tapp37_secret'), datos:JSON.stringify(test) },
	function(data){
		var datos=xeval(data)
		if (datos.retorno==1){
			app.alert('Test '+datos.cd_test+' creado')
			}
		else
			console.error(data)
		})

	}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
function CompraAndroid(prod){
	if (prod==null) return

	this.prod=prod
	this.xbtn=app.vistaActiva.domBody.find('.precio')
	this.v=app.vistaActiva

	app.ponThrobber()

	this.handler={}
	}
CompraAndroid.prototype.textoPorDefectoBoton=function(){
	var test=this.v.test
	this.xbtn.removeClass('cargando')
			 .text( formato.moneda( this.v.precioPlat(test), '€') + ' - Comprar' )
	}
CompraAndroid.prototype.eventProductoPreparado=function(prod){
	this.prodListoParaCompra=prod

	app.quitaThrobber()
	console.log('Producto preparado para la compra', prod)
	this.v.domBody.find('.precio, .icono').removeClass('lighten-3')
	}
CompraAndroid.prototype.isSameTest=function(p){
	//https://github.com/j3k0/cordova-plugin-purchase/issues/192

	var t=app.vistaActiva.test
	var iap= (device.platform=='iOS'?t.iap_ios:t.iap_android)

	return p.alias==iap
	}
CompraAndroid.prototype.iniciaProducto=function(){
	var self=this, prod=this.prod

	this.unRegister()

    // When any product gets updated, refresh the HTML
    this.handler.updated=store.when('product').updated(function (p) {
    	if (!self.isSameTest(p))
    		return
		
    	if (self.compraCancelada || self.compraCompletada)
    		return

    	if (p.order){
    		// self.xbtn.removeClass('cargando').text('Comprado')
    		}
    	else if (self instanceof CompraIOS && self.prodListoParaCompra && p.state==store.APPROVED && p.transaction.appStoreReceipt!=null){
    		//iOS
			self.compraCompletada=true
        	self.v.descargaTest(p.transaction)

        	p.finish()
    		}
    	else if (!(self.prodListoParaCompra && p.state==store.APPROVED) && self.prodListoParaCompra && p.state==store.APPROVED){
    		self.compraCompletada=true
        	self.v.descargaTest(p.transaction)

        	p.finish()
    		}
    	else if (self.compraIniciada!=null){
			self.xbtn.addClass('cargando').text('Procesando')
			app.ponThrobber()
    		}

    	if (p.transaction)
    		console.log(p.transaction)

        if (!p.owned){
        	if (p.valid==false){
        		}
	        else if ((store.get(prod).state==store.VALID || store.get(prod).state==store.REGISTERED) 
					//&& self.prodListoParaCompra==null && self.compraCompletada==null){
        			){
				self.eventProductoPreparado(p)
				}
        	}

        self.lastState=p.state
	    })

	this.handler.cancelled=store.when(prod).cancelled(function(p){
		if (!self.isSameTest(p))
    		return

		console.info('>> cancelled', p)

		app.quitaThrobber()
		self.compraCancelada=true
		// self.prodListoParaCompra=null //-> sólo cancelo, pero puede volver a intentarlo
		self.compraCompletada=null
		self.compraIniciada=null

		self.xbtn.removeClass('cargando').text('Compra cancelada')
		setTimeout(function(){
			self.textoPorDefectoBoton()
			//self.unRegister()
			}, 2000)
		self.storeRefresh()
		})

 	// When purchase of the full version is approved,
    // download content and confirm to store that purchase was delivered
    this.handler.approved=store.when(prod).approved(function (order) {
    	if (!self.isSameTest(order))
    		return
    	
    	if (self.compraIniciada==null){//no se ha pulsado descargar pero iTunes me lanza el evento
    		self.v.test.yaCompradoSegunITunes=order.transaction
    		
    		self.xbtn.removeClass('cargando').text('Comprado')
    		self.v.domBody.find('.icono').find('i').text('cloud_download')
    		self.v.domBody.find('.precio, .icono').removeClass('lighten-3')
    		self.v.domBody.find('.muestraGratis').hide()

    		return
    		}

    	console.info('>> approved', order)
        self.xbtn.removeClass('cargando').text('Comprado')

        self.compraCompletada=true
        self.v.descargaTest(order.transaction)

        order.finish()
    	})

    this.handler.finished=store.when(prod).finished(function (order) {
    	if (!self.isSameTest(order))
    		return
    	console.info('>> finished', order)
		app.quitaThrobber()
		
        setTimeout(function(){self.xbtn.removeClass('cargando').text('Comprado')}, 500)
        setTimeout(function(){self.unRegister()}, 2000)
    	})

    // When store is ready, activate the "refresh" button;
    store.ready(function() {
    	console.info('>> Store ready')
        //self.storeRefresh()
    	})

    // Log all errors
    this.handler.error=store.error(function(error) {
    	console.info('>> ERROR ', error)
    	app.quitaThrobber()
    	self.xbtn.removeClass('cargando').text(self.oldBtnText)
    	})

    this.storeRefresh()

    //ya refrescado antes?
    var deAntes=store.products.byAlias[this.prod]
    if (deAntes && deAntes.valid){
    	this.eventProductoPreparado(deAntes)
    	}
	}
CompraAndroid.prototype.storeRefresh=function(){
	store.refresh()
	}
CompraAndroid.prototype.doCompraProducto=function(){
	if (this.prodListoParaCompra==null){ //Producto no inicializado
		
		var deberiaSer=store.products.byAlias[this.prod]
		if (deberiaSer){
			this.prodListoParaCompra=deberiaSer
			store.order(deberiaSer)
			}

		return
		}

	app.ponThrobber()
	this.xbtn.text('Conectando...').addClass('cargando')

	this.compraIniciada=this.prodListoParaCompra
    store.order(this.prodListoParaCompra)
	}
CompraAndroid.prototype.unRegister=function(){
	if (this.handler==null) return

	this.compraCancelada=null
	this.compraCompletada=null
	this.compraIniciada=null	
	this.prodListoParaCompra=null

	store.off(this.handler.updated)
	store.off(this.handler.cancelled)
	store.off(this.handler.approved)
	store.off(this.handler.finished)
	store.off(this.handler.error)
	store.off(this.handler.restore)

	this.handler={}
	}
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
function CompraIOS(prod){
	if (prod==null) return

	this.prod=prod
	this.xbtn=app.vistaActiva.domBody.find('.precio')
	this.v=app.vistaActiva

	app.ponThrobber()

	this.handler={}
	this.lastState=null
	}
CompraIOS.prototype.textoPorDefectoBoton=function(){
	var test=this.v.test
	this.xbtn.removeClass('cargando')
			 .text( formato.moneda( this.v.precioPlat(test.precio), '€') + ' - Comprar' )
	}
CompraIOS.prototype.eventProductoPreparado=function(prod){
	this.prodListoParaCompra=prod

	app.quitaThrobber()
	console.log('Producto preparado para la compra', prod)
	this.v.domBody.find('.precio, .icono').removeClass('lighten-3')
	}
CompraIOS.prototype.isSameTest=function(p){
	var t=app.vistaActiva.test
	var iap= (device.platform=='iOS'?t.iap_ios:t.iap_android)

	return p.alias==iap
	}
CompraIOS.prototype.iniciaProducto=function(){
	var self=this, prod=this.prod

	this.unRegister()

    // When any product gets updated, refresh the HTML
    this.handler.updated=store.when(prod).updated(function (product) {
    	self.lastState=product.state
    	console.log(product.state)

   		if (product.canPurchase ) 
    		self.eventProductoPreparado()
	    })
    this.handler.approved=store.once(prod).approved(function (product) {
        self.compraCompletada=true
        self.v.descargaTest(product.transaction)

        if (this.siguiente){
        	clearTimeout(this.siguiente)
        	}

        product.finish()
    	})

    this.handler.finished=store.once(prod).owned(function (product) {
    	console.info('>> finished', product)
		app.quitaThrobber()
		
        setTimeout(function(){self.xbtn.removeClass('cargando').text('Comprado')}, 500)
        setTimeout(function(){self.unRegister()}, 2000)
    	})
	
	var xkeys=Object.keys(store.products.byAlias)
	if (xkeys.indexOf(this.prod)==-1){
		store.register({
	        id:     this.prod,
	        alias: 	this.prod,
	        type:   store.NON_CONSUMABLE
	    	})
		}

    this.storeRefresh()

    this.reintentos=0
	}
CompraIOS.prototype.storeRefresh=function(){
	store.refresh()
	}
CompraIOS.prototype.doCompraProducto=function(){
	if (this.prodListoParaCompra==null){ //Producto no inicializado
		
		var deberiaSer=store.products.byAlias[this.prod]
		if (deberiaSer){
			this.prodListoParaCompra=deberiaSer
			this.bucleCompra()
			}

		return
		}
	
	app.ponThrobber()
	this.xbtn.text('Conectando...').addClass('cargando')

	this.compraIniciada=this.prodListoParaCompra

	this.bucleCompra()
	}
CompraIOS.prototype.bucleCompra=function(){
	if (this.prodListoParaCompra==null) return

	app.ponThrobber()
	console.log('>> reintentos', this.reintentos, 'lastState', this.lastState)

	if (this.lastState==store.INITIATED || this.lastState==store.APPROVED || this.lastState==store.OWNED){

		}
	else{
		storekit.load(app.vistaActiva.test.iap_ios)
		store.order(this.prodListoParaCompra)
		}

	this.reintentos=this.reintentos+1
	if (this.compraCompletada){
		return //éxito
		}
	else if (this.reintentos<10){
		var self=this
		this.siguiente=setTimeout(function(){self.bucleCompra()}, 5500)
		}
	}
CompraIOS.prototype.unRegister=function(){
	if (this.handler==null) return

	this.compraCancelada=null
	this.compraCompletada=null
	this.compraIniciada=null	
	this.prodListoParaCompra=null

	store.off(this.handler.updated)
	// store.off(this.handler.cancelled)
	store.off(this.handler.approved)
	store.off(this.handler.finished)
	// store.off(this.handler.error)
	// store.off(this.handler.restore)

	this.handler={}
	}
////
VistaAjustes.prototype.unRegister=function(){
	// this.compraCancelada=null
	// this.compraCompletada=null
	// this.compraIniciada=null	
	// this.prodListoParaCompra=null
	this._descargasComenzadas=false
	this.reintentos=0

	if (this.handler==null) return
	store.off(this.handler.updated)
	// store.off(this.handler.cancelled)
	store.off(this.handler.approved)
	store.off(this.handler.finished)
	// store.off(this.handler.error)
	// store.off(this.handler.restore)

	this.handler={}
	}
VistaAjustes.prototype.doRestaurarCompras=function(){
	var self=this
	app.ponThrobber()
	if (app.cache.testTienda==null){
		//por si le van a dar a "restaurar compras", más vale que tengamos una copia fresca de los test
		VistaTienda.prototype.doLeeTestTienda(function(datos){ 
			app.cache.testTienda=datos
			self.doRestaurarCompras()
			} )
		return
		}
	else if (this._descargasComenzadas)
		return
	else if (this.reintentos>5)
		return

	this.reintentos++
	setTimeout(function(){self.doRestaurarCompras()}, 6000)
	
	this.handler={}
	this.colaRestaurar=[]
	
    // When any product gets updated, refresh the HTML
    this.handler.updated=store.when('product').updated(function (product) {
    	self.lastState=product.state
    	console.log(product.state)
	    })
    this.handler.approved=store.when('product').approved(function (product) {
        var cd_test=Number(product.id.split('_')[1]) //es.octopusapp.clo.test_202
        if (isNaN(cd_test)) return

        var c=buscaFilas(self.colaRestaurar, {cd_test: cd_test})
        var l=buscaFilas(app.cache.testLocales, {cd_test: cd_test})
        if (c.length==0 && l.length==0)
            self.colaRestaurar.push({cd_test:cd_test, test: {cd_test:cd_test}, transaction:product.transaction, completado:false, iniciado:false})

        console.info('colaRestaurar', self.colaRestaurar.length)
        self.continuaDescargas()

        if (this.siguiente){
        	clearTimeout(this.siguiente)
        	}

        product.finish()
    	})

  //   this.handler.finished=store.once('product').owned(function (product) {
  //   	console.info('>> finished', product)
		// app.quitaThrobber()
		
  //       setTimeout(function(){self.xbtn.removeClass('cargando').text('Comprado')}, 500)
  //       setTimeout(function(){self.unRegister()}, 2000)
  //   	})
	
	var xkeys=Object.keys(store.products.byAlias)
    for (var i=0; i<app.cache.testTienda.length; i++){
        var xt=app.cache.testTienda[i]
        var xp=(device.platform=='iOS'? xt.iap_ios : xt.iap_android)

        if (xp==null){
            }
        else if (xkeys.indexOf(xp)==-1){
            store.register({
                id:     xp,
                alias:  xp,
                type:   store.NON_CONSUMABLE
                })
            }
        }

    store.refresh()
	}
VistaAjustes.prototype.continuaDescargas=function(){
	if (this._descargasComenzadas) return
	this._descargasComenzadas=true

	for (var i=0; i<this.colaRestaurar.length; i++){
		var c=this.colaRestaurar[i]
		if (!c.iniciado){
			this.colaRestaurar[i]['iniciado']=true
			app.showToast('Descargando... ('+i+' de '+this.colaRestaurar.length+')')
			this.restauraTest(c.test, c.transaction)
			return
			}
		}
	//si llega aquí es que hemos terminado
	app.showToast(this.colaRestaurar.length+' compras restauradas')
	app.quitaThrobber()
	}
VistaAjustes.prototype.restauraTest=function(test, pruebaCompra){
	var self=this

	app.ponThrobber()

	console.log('Iniciamos restaurar compras '+test.cd_test)
	app.post({accion:'getTestComprado', cd_test:test.cd_test, pruebaCompra:JSON.stringify(pruebaCompra) },
		function(data){
			var datos=xeval(data)
			if (datos.retorno==1){
				datos.test.fu_modificacion=new Date()

				test.lotengo=true
				self.actualizaOcurrenciasTest(datos.test)
				self.anhadeATestLocales(datos.test)

				console.info('test '+datos.test.cd_test+' restaurado!, '+datos.test.numpreguntas+' preguntas')

				app.trackEvent('test', 'restored' , datos.test.cd_test+'-'+datos.test.ds_test)
				}
			else {
				app.trackEvent('test', 'restoration-download-error', datos.test.cd_test+'-'+datos.msgError)
				//app.alert('Ha habido un problema al descargar el test', 'Descarga no disponible')
				console.error(data)
				}

			var idx=getIndiceFila(self.colaRestaurar, {cd_test:datos.test.cd_test})
			if (idx>-1) {
				self.colaRestaurar[idx]['completado']=true
				}
			self._descargasComenzadas=false
			self.continuaDescargas()
			})
	}
