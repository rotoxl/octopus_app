<?php
require_once(__DIR__.'/creaConn.php'); 
require_once(__DIR__.'/itunesReceiptValidator.php'); 

$conn=new Conn();

class FasesTramitacion{ // tests_t
    const Alta='Alta';
    // const Borrador='Borrador';
    const Favorito='Favorito';
    // const CambioPrecio='CambioPrecio';
    const InformarError='InformarError';
 	}
function uneArray($arr, $arrUObj){
	if (!is_array($arr)){
	  	throw new Exception('uneArray: en p1 debe venir un array ** '.($arr->sql).' **');
	  	}

	if (is_array( $arrUObj )){
	  	$arr=array_merge($arr, $arrUObj);
	  	}
	else {
	  	$arr[]=$arrUObj;
	  	}
	return $arr;
	}

$limitePreview=10;
$IOS_sandbox=true;

class Metadatos{
	public $conn=null;

	function __construct($conn, $usu=null){
        $this->conn=$conn;
        if ($usu!=null){
            $conn->setUsu($usu);
    	    }
        }
	function __logSQL($mostrar){
		if ($mostrar)
			return $this->conn->arrResultSet;
		else 
			return null;
		}
	//////
	public function numerador($tabla, $col, $arr=null, $paratran=false){ // Uso: numerador ('centroscoste', 'colNumerador', array('id_empresa'=>1 ))
		$params=array();
		$sql='select max('. $col .') from ' . $tabla;
		if (!is_null($arr)){
			$sql = $sql . ' where ';

			for ($i=0; $i< count(array_keys($arr)); $i++){
				$k=array_keys($arr)[$i];
				$v=$arr[$k];

				if ($i > 0) {
					$sql = $sql . ' AND ';
					}
				$sql = $sql . $k . '= ?';
				array_push($params, $v);
				}
			}
		if($paratran) {
			return new Sql($sql, $params);
			} 
		else {
			$ret=$this->conn->lookupSimple($sql, $params);
			if ($ret == null) {
				return 1;
				}
			return 1+$ret;
			}
		}
	private function fechaHora(){
		return date('d/m/Y H:i:s');
		}
	//////
    function getGoogleUserProfile($token){
    	$url = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';
		
		$json = file_get_contents($url.$token);
		$userData = json_decode($json, true);
		
		if (array_key_exists('email', $userData)){
			$arr=array(
				'cd_usuario'=>$userData['email'],
				'email'=>$userData['email'],
				'given_name'=>$userData['given_name'],
				'family_name'=>$userData['family_name'],
				'picture'=>$userData['picture'],
				);
			return $arr;
			}
		else {
			throw new Exception($json);
			}

    	}
	function altaUsuario($d){
		$cd_usuario=$d['cd_usuario'];

		$yaExiste=$this->conn->lookupSimple('select cd_usuario from usuarios where cd_usuario=?', array($cd_usuario));

		if ($yaExiste==$cd_usuario){
			$sql="update usuarios set nombre=?, apellidos=?, picture=? where cd_usuario=?";
			$this->conn->ejecuta($sql, array($d['given_name'], $d['family_name'], $d['picture'], $d['cd_usuario'] ));
			return false; //devolvemos esUsuarioNuevo
			}
		else {
			$sql='insert into usuarios (cd_usuario, nombre, apellidos, picture) values (?, ?, ?, ?)';
			$this->conn->ejecuta($sql, array($d['cd_usuario'], $d['given_name'], $d['family_name'], $d['picture'] ));
			return true; //devolvemos esUsuarioNuevo
			}
		}
	private function correoe($destino, $asunto, $mensaje){
		mail($destino, $asunto, $mensaje, 'From: <info@octopusapp.es>');
		}
	//////
	function compruebaCert($json_order, $cd_test){
		$esIOS=false; $esAndroid=false;
		
		if (isset($json_order->type)) {
			$esIOS=$json_order->type=='ios-appstore'?true:false;
			}
		if (isset($json_order->receipt)) {
			$esAndroid=$json_order->receipt!=null?true:false;
			}
		
		if ($esAndroid){
			$this->conn->logInfo('Este test es de pago, vamos a verificar el json de Google Play');

			//comprobamos que realmente es una compra: 
			//	http://stackoverflow.com/questions/16535025/android-in-app-billing-v3-with-php
	 		global $GPLAY_BILLINGKEY;

	 		$key = "-----BEGIN PUBLIC KEY-----\n" . chunk_split($GPLAY_BILLINGKEY, 64, "\n") . "-----END PUBLIC KEY-----";
	 		$ret= openssl_verify($json_order->receipt, base64_decode($json_order->signature), $key);

	 		$this->conn->logInfo('Resultado comprobación certificado de recibo de compra: '.$ret==1?'OK':'ERROR', 'SSL');
	 		// var_dump( array(
	 		// 	$ret,
	 		// 	$json_order->receipt, 
	 		// 	$json_order->signature,
	 		// 	$GPLAY_BILLINGKEY,
	 		// 	));
	 		return $ret!=0;
	 		}
	 	else if ($esIOS){
	 		$this->conn->logInfo('Este test es de pago, vamos a verificar el json de iTunes');
			
			// https://github.com/chrismaddern/iOS-Receipt-Validator-PHP/blob/master/itunesReceiptValidator.php
	 		$endpoint = IOS_sandbox? itunesReceiptValidator::SANDBOX_URL : itunesReceiptValidator::PRODUCTION_URL;
	 		try {
			    $rv = new itunesReceiptValidator($endpoint, $json_order->appStoreReceipt );
			    $info = $rv->validateReceipt();

			    if ($info->product_id==('es.octopusapp.clo.test_'.$cd_test) ){
			    	//al menos es una compra válida, pero no significa que sea suya
			    	}
			    else {
			    	return false;
			    	}

			    return true;
				}
			catch (Exception $ex) {
			    return false;
				}
	 		}
	 	else{
	 		return false;
	 		}
		}
	//////
    function sendPush_IOS($registrationIdsArray, $messageData){
        $resp=array('failure'=>0, 'success'=>0, 'results'=>array());
        for ($i=0; $i<count($registrationIdsArray); $i++){
            $deviceToken = $registrationIdsArray[$i];

            global $APPLE_PUSH_SERVER_KEY, 
           		 	$APPLE_PUSH_SERVER_CERT,
           		 	$APPLE_PUSH_SERVER;

            // Put your private key's passphrase here:
            $passphrase=$APPLE_PUSH_SERVER_KEY;
            $certPath= 	$APPLE_PUSH_SERVER_CERT;
            $serverPath=$APPLE_PUSH_SERVER; 

            ////////////////////////////////////////////////
            $ctx = stream_context_create();
            stream_context_set_option($ctx, 'ssl', 'local_cert', $certPath);
            stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);

            // Open a connection to the APNS server
            $fp = stream_socket_client($serverPath, $err, $errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

            if (!$fp)
                exit("Failed to connect: $err $errstr" . PHP_EOL);

            // Create the payload body
            $body['aps'] = $messageData;

            // Encode the payload as JSON
            $payload = json_encode($body);

            // Build the binary notification
            $msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;

            $this->conn->logInfo(json_encode($messageData), 'Push-iOS-envio: ');
            // Send it to the server
            $result = fwrite($fp, $msg, strlen($msg));
       	   	
            if (!$result){
                array_push($resp['results'], 'Message not delivered' . PHP_EOL);
                $resp['failure']=$resp['failure']+1;
                }
            else {
                array_push($resp['results'], 'Message successfully delivered' . PHP_EOL);
                $resp['success']=$resp['success']+1;
                }

            // Close the connection to the server
            fclose($fp);
            }
        $this->conn->logInfo(json_encode($resp), 'Push-iOS-retorno: ');
        return json_encode($resp);//las de android se devuelven como texto
        }
	private function sendPush_Android($arrDispositivos, $messageData){
		if (count($arrDispositivos)==0) return;

		global $GCM_SERVER_KEY;
		$apiKey = $GCM_SERVER_KEY; //server or browser key

		$this->conn->logInfo(json_encode($messageData), 'Push-Android-envio: ');

		if ($messageData==null)
		   	$messageData=array();
		else if (!is_array($messageData))
			$messageData=array($messageData);	

		$headers = array("Content-Type:" . "application/json", "Authorization:" . "key=" . $apiKey);
		$payload = array(
		   	'data' => $messageData,
		   	'registration_ids' => $arrDispositivos,
		   	);

		$ch = curl_init();

		curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers ); 
		curl_setopt( $ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send" );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 0 );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 0 );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode($payload) );

		$response = curl_exec($ch);
		curl_close($ch);

		$this->conn->logInfo(json_encode($response), 'Push-Android-retorno: ');
  		return $response;
		}
    public  function sendPush($registrationIdsArray, $messageData){
		$tamID_IOS=64;

		$registrationIdsArray_IOS=array();
		for ($i=0; $i<count($registrationIdsArray); $i++){
			$id=$registrationIdsArray[$i];

			if ( strlen($id)==$tamID_IOS ){
			    array_push($registrationIdsArray_IOS, $id );
			    unset( $registrationIdsArray[$i] );
				}
			}

		//////////////////
		$ret=array();
		if (count($registrationIdsArray_IOS)){
			$resp=$this->sendPush_IOS($registrationIdsArray_IOS, $messageData);
			array_push($ret, $resp);
			}
		if (count($registrationIdsArray)){
			$resp=$this->sendPush_Android($registrationIdsArray, $messageData);
			array_push($ret, $resp);
			}
		return $ret;
		}
	//////
	public function sendPushGrupo($cd_grupo, $excluir, $datos){
		$gr=$this->conn->lookupFilas('select distinct cd_dispositivo, ug.cd_usuario from usuarios u, usuarios_grupos ug 
										where ug.cd_usuario=u.cd_usuario and cd_grupo=?', 
									array($cd_grupo))->filas;
		$arr=array();
		for ($i=0; $i<count($gr); $i++){
			$u=$gr[$i]['cd_usuario'];

			if ($u==$excluir){
				continue;
				}

			$d=$gr[$i]['cd_dispositivo'];
			if ($d!=null ){
				array_push( $arr, $d );
				}
			}
		$this->sendPush($arr, $datos); 
		}
	// public function sendPushUsuario($cd_usuario, $datos){}
	// private function getArrDispositivos(){}
	public function guardaID_Dispositivo($cd_usuario, $cd_gcm){
		$sql="update usuarios set cd_dispositivo=? where cd_usuario=?";
		$this->conn->ejecuta($sql, array($cd_gcm, $cd_usuario));
		}
	private function genDatosPush($modulo, $accion, $datos, $msgAltIOS, $titAlt='Hay alguna actualización en Octopus', $msgAlt='Por favor, entra en la app'){
		return array(
			'f_push'=>$this->fechaHora(),
			'vista'=>$modulo,
			'accion'=>$accion,
			'datos'=>$datos,

			'title'=> $titAlt,  //
			'message'=> $msgAlt, //texto que se mostrará en notif emergente cuando la app esté en segundo plano

			'alert'=> $msgAltIOS,  //push ios
			'sound' => 'default'//push ios
			);
		}
	//////
//obsoleto 18-feb-2016
	public function cargarMasCat($cd_categoria, $desde, $hasta){
		if ($cd_categoria==-3){//gratuitos
			$sql="select 
				v.cd_test, v.ds_test, 
				v.anho, v.grupo, 
				v.matricula, v.f_examen, v.organismo,
				v.numpreguntas, v.fallosrestan, 
				v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
				concat(lisCat, ?, ',') as lisCat,
				iap_ios, iap_android, v.precio_android, v.precio_ios
			from vs_testpreview v
			where v.precio=0
			order by v.likes desc, v.fu_modificacion desc limit ?, ?";
			}
		else if ($cd_categoria==-2){//los más valorados
			$sql="select 
				v.cd_test, v.ds_test, 
				v.anho, v.grupo,
				v.matricula, v.f_examen, v.organismo,
				v.numpreguntas, v.fallosrestan, 
				v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
				concat(lisCat, ?, ',') as lisCat,
				v.iap_ios, v.iap_android, v.precio_android, v.precio_ios
			from vs_testpreview v
			where v.likes>0
			order by v.likes desc, v.fu_modificacion desc, v.cd_test
			limit ?, ?";
			}
		else if ($cd_categoria==-1){//nuevos y actualizados
			$sql="select 
				v.cd_test, v.ds_test, 
				v.anho, v.grupo, 
				v.matricula, v.f_examen, v.organismo,
				v.numpreguntas, v.fallosrestan, 
				v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
				concat(lisCat, ?, ',') as lisCat,
				v.iap_ios, v.iap_android, v.precio_android, v.precio_ios
			from vs_testpreview v
			order by v.fu_modificacion desc limit ?, ?";
			}
		else {
			$sql=" select 
						v.cd_test, v.ds_test, 
						v.anho, v.grupo,
						v.matricula, v.f_examen, v.organismo,
						v.numpreguntas, v.fallosrestan, 
						v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
						v.liscat,
						iap_ios, iap_android
					from 
						vs_testpreview v, 
						test_categorias ct
					where 
						ct.cd_test=v.cd_test
						and ct.cd_categoria=?
					order by 
						v.orden
					limit ?, ?";
			}
		return $this->conn->lookupFilas($sql, array($cd_categoria, $desde, $hasta))->filas;
		}
	//////
//obsoleto 18-feb-2016		
	public function getCategoriasPersonalizadas($cd_usuario){
		$sql="	select
				 	c.ds_categoria, c.cd_categoria, c.i,
					(select count(*) from vs_testpreview vt where vt.liscat like concat('%,', c.cd_categoria, ',%') ) as numTestsPorCat,
					c.listarComoCategoria,
					c.cd_categoriapadre,
					(select group_concat(cc.cd_categoria) from categorias cc where cc.cd_categoriapadre=c.cd_categoria) as cd_categoriashijas,
					CD_LeaderBoardAndroid, CD_LeaderBoardIOS
				 from categorias c, usuarios_categorias uc
					where c.cd_categoria=uc.cd_categoria and uc.cd_usuario=?
				order by cd_categoria";
		return $this->conn->lookupFilas($sql, array($cd_usuario));
		}
//obsoleto 18-feb-2016	
	public function getCategorias(){
		$sql="select
					c.ds_categoria,
					c.cd_categoria,  
					c.i,
					(select count(*) from vs_testpreview vt where vt.liscat like concat('%,', c.cd_categoria, ',%') ) as numTestsPorCat,
					c.listarComoCategoria,
					c.cd_categoriapadre,
					(select group_concat(cc.cd_categoria) from categorias cc where cc.cd_categoriapadre=c.cd_categoria) as cd_categoriashijas,
					CD_LeaderBoardAndroid, CD_LeaderBoardIOS
				from categorias c 
				-- having numTestsPorCat > 0
				order by cd_categoria";
		return $this->conn->lookupFilas($sql, array());
		}
//obsoleto 18-feb-2016	
	public function getPreviewCategoria($cd_usuario, $arrCats){
		global $limitePreview;

		$sql=''; $arr=array();
		for ($i=0; $i<count($arrCats); $i++){
			$cd_categoria=$arrCats[$i];

			if ($cd_categoria==-1){//últimos actualizados
				// if ($sql!='')
				// 	$sql=$sql . " UNION ALL ";

				// $sql=$sql . "(select t.* from vs_testpreview t
				// 	where t.fu_modificacion>DATE_SUB(CURDATE(),INTERVAL 30 DAY)
				// 	order by t.likes, t.fu_modificacion desc
				// 	limit ?)";
				// array_push($arr, $limitePreview);
				}
			else {
				if ($sql!='')
					$sql=$sql . " UNION ALL ";

				$sql=$sql . "(select t.*,
								exists (select * from usuarios_tests ut where ut.cd_test=t.cd_test and ut.cd_usuario=?) as lotengo
						from vs_testpreview t 
						where t.liscat like concat('%', ?, ',%')
						order by t.orden 
						limit ?)";
				array_push($arr, $cd_usuario, $cd_categoria, $limitePreview);
				}
			}
		$sql="select * from (".$sql.") xx group by cd_test order by orden, lotengo desc, likes desc, cd_test";
		return $this->conn->lookupFilas($sql, $arr);
		}
	////
//obsoleto 18-feb-2016
	public function getPreviewCategoriaGratuitos($cd_usuario, $cd_categoria){
		global $limitePreview;
		$sql="select 
				v.cd_test, v.ds_test, 
				v.anho, v.grupo, 
				v.matricula, v.f_examen, v.organismo,
				v.numpreguntas, v.fallosrestan, 
				v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
				concat(lisCat, ?, ',') as lisCat,
				v.iap_ios, v.iap_android, v.precio_android, v.precio_ios,
				exists (select * from usuarios_tests ut where ut.cd_test=v.cd_test and ut.cd_usuario=?) as lotengo
			from vs_testpreview v
			where v.precio=0
			order by v.likes desc, v.fu_modificacion desc limit ?";
		return $this->conn->lookupFilas($sql, array($cd_categoria, $cd_usuario, $limitePreview));
		}
//obsoleto 18-feb-2016
	public function getPreviewCategoriaValorados($cd_usuario, $cd_categoria){
		global $limitePreview;
		$sql="select 
				v.cd_test, v.ds_test, 
				v.anho, v.grupo,
				v.matricula, v.img, v.f_examen, v.organismo,
				v.numpreguntas, v.fallosrestan, 
				v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
				concat(lisCat, ?, ',') as lisCat,
				v.iap_ios, v.iap_android, v.precio_android, v.precio_ios,
				exists (select * from usuarios_tests ut where ut.cd_test=v.cd_test and ut.cd_usuario=?) as lotengo
			from vs_testpreview v
			where v.likes>0
			order by v.likes desc, v.fu_modificacion desc, v.cd_test
			limit ?";
		return $this->conn->lookupFilas($sql, array($cd_categoria, $cd_usuario, $limitePreview));
		}
//obsoleto 18-feb-2016
	public function getPreviewCategoriaNuevosActualizados($cd_usuario, $cd_categoria){
		global $limitePreview;
		$sql="select 
				v.cd_test, v.ds_test, 
				v.anho, v.grupo, 
				v.matricula, v.img, v.f_examen, v.organismo,
				v.numpreguntas, v.fallosrestan, 
				v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
				concat(lisCat, ?, ',') as lisCat,
				v.iap_ios, v.iap_android, v.precio_android, v.precio_ios,
				exists (select * from usuarios_tests ut where ut.cd_test=v.cd_test and ut.cd_usuario=?) as lotengo
			from vs_testpreview v
			order by v.fu_modificacion desc limit ?";
		return $this->conn->lookupFilas($sql, array($cd_categoria, $cd_usuario, $limitePreview));
		}
////
	public function getPreviewTest($cd_usuario, $cd_test, $matricula){
		///exists (select * from usuarios_tests ut where ut.cd_test=t.cd_test and ut.cd_usuario=?) as lotengo 
		$sql="select * from vs_testpreview t where cd_test=? || matricula=?";
		$test=$this->conn->lookupDict($sql, array($cd_test, $matricula));

		$porcentajePreguntas=10;
		$maxCD_Pregunta=$porcentajePreguntas*$test['numpreguntas']/100;

		// $sqlPreguntas="select pregunta from preguntas_tests where cd_test=? and cd_pregunta<?";
		// $preg=$this->conn->lookupFilas($sqlPreguntas, array($cd_test, $maxCD_Pregunta));
		// $test['preguntas']=$preg->filas;

		$likeit=$this->conn->lookupSimple("select cd_usuario from usuarios_likes where cd_usuario=? and cd_test=?", array($cd_usuario, $cd_test));
		$test['likeit']=($likeit==$cd_usuario);

		$tieneImagenes=$this->conn->lookupSimple("select count(recursopregunta) from preguntas_tests where cd_test=?", array($cd_test));
		$test['tieneImagenes']=($tieneImagenes==1);

		return $test;
		}
	public function getDatosTest($cd_test){
		$sql="select 
			 	v.cd_test, v.ds_test, 
			 	v.anho, v.grupo, 
				v.matricula, v.img, v.f_examen, v.organismo,
				v.numpreguntas, v.liscat,
				v.iap_ios, v.iap_android,
				v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion
			from vs_testpreview v where v.cd_test=?";
		return $this->conn->lookupDict($sql, array($cd_test));
		}
	public function getTest($cd_usuario, $cd_test, $json_order){
		$md=$this->conn->lookupDict(
			"select cd_test, 1 as lotengo, anho, grupo, matricula, f_examen, ds_test, liscat, iap_ios, iap_android, precio_android, precio_ios, region, organismo, img, fallosRestan, minutos, numPreguntas, precio, cd_moneda from vs_testpreview t where cd_test=?", 
			array($cd_test));

		if ($cd_usuario!=null){
			$yaComprado=$this->conn->lookupSimple("select cd_test from usuarios_tests where cd_usuario=? and cd_test=?", array($cd_usuario, $cd_test));
			if ($md['precio']==0){
				}
			else if ($md['precio']>0 && $yaComprado==$cd_test ){
				$this->conn->logInfo('Este test es de pago, pero el usuario ya lo compró');
				}
			else if ($md['precio']>0 && isset($json_order) ){
				}
			else{
				throw new Exception('No se permite descargar este test, no es gratuito');
				}
			}

		$preg=$this->conn->lookupFilas("select * from preguntas_tests where cd_test=? order by cd_pregunta", array($cd_test));
		$arrPreguntas=array();
		for ($i=0; $i<count($preg->filas); $i++){
			$f=$preg->filas[$i];
			$pregunta=array(
				'pregunta'=>$f['pregunta'],
				'img'=>$f['recursopregunta'],
				'cd_respuestacorrecta'=>$f['cd_respuestacorrecta'],
				'respuestas'=>array(
					array( 'texto'=>$f['respuesta0'], 'img'=>$f['recursorespuesta0']),
					array( 'texto'=>$f['respuesta1'], 'img'=>$f['recursorespuesta1']),
					array( 'texto'=>$f['respuesta2'], 'img'=>$f['recursorespuesta2']),
					array( 'texto'=>$f['respuesta3'], 'img'=>$f['recursorespuesta3']),
					array( 'texto'=>$f['respuesta4'], 'img'=>$f['recursorespuesta4']),
					array( 'texto'=>$f['respuesta5'], 'img'=>$f['recursorespuesta5']),
					)
				);
			array_push($arrPreguntas, $pregunta);
			}

		$md['preguntas']=$arrPreguntas;

		if ($cd_usuario!=null){
			$this->vinculaTestConUsuario($cd_usuario, $cd_test, $json_order, $md['precio'], $md['cd_moneda']);
			}

		try {
			if (isset($json_order)){
				$this->correoe('8ctopusapp@gmail.com', 'Test vendido - cd_test='.$cd_test.'/DS_Test='.$md['ds_test'], 'CD_Test='.$cd_test.'/DS_Test='.$md['ds_test'].' '.$json_order);
			}
		} catch (Exception $ex){
		}

		return $md;
		}
	public function getMuestraGratis($cd_usuario, $cd_test){
		$md=$this->conn->lookupDict(
			"select cd_test, 1 as lotengo, anho, grupo, matricula, f_examen, ds_test, liscat, iap_ios, iap_android, region, organismo, img, fallosRestan, minutos, numPreguntas, precio, cd_moneda from vs_testpreview t where cd_test=?", 
			array($cd_test));

		$md['esMuestraGratis']=true;
		$preguntasDescargar=$md['numpreguntas']/10;

		$preg=$this->conn->lookupFilas("select * from preguntas_tests where cd_test=? and cd_pregunta<? order by cd_pregunta", array($cd_test, $preguntasDescargar));
		$arrPreguntas=array();
		for ($i=0; $i<count($preg->filas); $i++){
			$f=$preg->filas[$i];
			$pregunta=array(
				'pregunta'=>$f['pregunta'],
				'img'=>$f['recursopregunta'],
				'cd_respuestacorrecta'=>$f['cd_respuestacorrecta'],
				'respuestas'=>array(
					array( 'texto'=>$f['respuesta0'], 'img'=>$f['recursorespuesta0']),//, 'texto_recurso'=>$f['textorecursorespuesta0']),
					array( 'texto'=>$f['respuesta1'], 'img'=>$f['recursorespuesta1']),//, 'texto_recurso'=>$f['textorecursorespuesta1']),
					array( 'texto'=>$f['respuesta2'], 'img'=>$f['recursorespuesta2']),//, 'texto_recurso'=>$f['textorecursorespuesta2']),
					array( 'texto'=>$f['respuesta3'], 'img'=>$f['recursorespuesta3']),//, 'texto_recurso'=>$f['textorecursorespuesta3']),
					array( 'texto'=>$f['respuesta4'], 'img'=>$f['recursorespuesta4']),//, 'texto_recurso'=>$f['textorecursorespuesta4']),
					array( 'texto'=>$f['respuesta5'], 'img'=>$f['recursorespuesta5']),//, 'texto_recurso'=>$f['textorecursorespuesta5']),
					)
				);
			array_push($arrPreguntas, $pregunta);
			}

		$md['preguntas']=$arrPreguntas;

		return $md;
		}
	public function buscaTests($cd_usuario, $q){
		global $limitePreview;

		$where=''; $param=array($cd_usuario);

		$temp=explode(' ', $q);
		for ($i=0; $i<count($temp); $i++){
			$where=$where." and searchPoint like concat('%', ?, '%') ";
			array_push($param, $temp[$i]);
			}

		if (strlen($where)>0 ){
			$where=substr($where, 4);
			array_push($param, 40);
			}

		$sql="select * from (
				select 
					v.cd_test, v.ds_test, anho, grupo, 
					v.matricula, v.img, v.f_examen, v.organismo,
					v.numpreguntas, v.fallosrestan, 
					v.admiteReordenarPreguntas, v.admiteReordenarRespuestas, v.minutos, v.region, v.precio, v.cd_moneda, v.likes, v.fu_modificacion,
					concat(ifnull(v.lisCat, ''), '-100,') as lisCat,
					v.iap_ios, v.iap_android, v.precio_android, v.precio_ios,
					exists (select * from usuarios_tests ut where ut.cd_test=v.cd_test and ut.cd_usuario=?) as lotengo,
					v.orden,
					concat( ifnull(anho, ''),  ' ',
							ifnull(grupo, ''), ' ', 
							v.ds_test, ' ', 
							ifnull(v.matricula, ''), ' ', 
							ifnull(v.organismo, ''), ' ', 
							ifnull(v.region, ''), ' ', 
							case f_examen when  not null then date_format(f_examen, 'dd-mm-yyyy') else  '' end
							) as searchPoint
			from vs_testpreview v ) vis
			where " . $where . "
			order by vis.likes, vis.orden desc limit ?";

		// echo $sql;
		// var_dump($param);
		return $this->conn->lookupFilas($sql, $param)->filas;
		}
	//////
	public function getNumLikes($cd_usuario, $cd_test){
		$numlikes=$this->conn->lookupSimple("select sum(numlikes) from usuarios_likes where cd_test=?", array($cd_test));
		$likeit=$this->conn->lookupSimple("select count(*) from usuarios_likes where cd_test=? and cd_usuario=?", array($cd_test, $cd_usuario));
		return array(
			'likes'=>$numlikes,
			'likeit'  =>$likeit		
			);
		}
	public function toggleLike($accion, $cd_usuario, $cd_test){
		$arrSql=array();

		if ($accion=='like+'){
			$existe=$this->conn->lookupSimple("select cd_usuario from usuarios where cd_usuario=?", array($cd_usuario));

			if ($existe!=$cd_usuario){
				array_push($arrSql, new Sql( "insert into usuarios (cd_usuario) values (?)", array($cd_usuario) ));
				}
			else {
				$existe=$this->conn->lookupSimple("select cd_usuario from usuarios_likes where cd_usuario=? and cd_test=?", array($cd_usuario, $cd_test));
				if ($existe==$cd_usuario){
					return;
					}
				}

			$sql='insert into usuarios_likes (cd_usuario, cd_test) values (?, ?)';
			}
		else
			$sql='delete from usuarios_likes where cd_usuario=? and cd_test=?';
		
		array_push($arrSql, new Sql($sql, array($cd_usuario, $cd_test)) );
		array_push($arrSql, $this->sql_test_t($cd_test, $cd_usuario, FasesTramitacion::Favorito, $accion));
		
		$this->conn->ejecutaLote($arrSql);
		}
	//////
	public function vinculaTestConUsuario($cd_usuario, $cd_test, $json_order, $precio, $cd_moneda){
		$arr_sql=$this->vinculaTestConUsuario_getSql($cd_usuario, $cd_test, $json_order, $precio, $cd_moneda);	
		$this->conn->ejecutaLote($arr_sql);
		}
	public function vinculaTestConUsuario_getSql($cd_usuario, $cd_test, $json_order, $precio, $cd_moneda){
		$arrSql=array();

		$existeVinculo=$this->conn->lookupSimple('select cd_test from usuarios_tests where cd_usuario=? and cd_test=?', array($cd_usuario, $cd_test));
		if ($existeVinculo==false){
			$existeUsuario=$this->conn->lookupSimple("select cd_usuario from usuarios where cd_usuario=?", array($cd_usuario));

			
			if ($existeUsuario!=$cd_usuario){
				array_push($arrSql, new Sql( "insert into usuarios (cd_usuario) values (?)", array($cd_usuario) ));
				}

			$sql="insert into usuarios_tests (cd_usuario, cd_test, json_order, precio, cd_moneda) values (?, ?, ?, ?, ?)";
			array_push($arrSql, new Sql($sql, array($cd_usuario, $cd_test, json_encode($json_order), $precio, $cd_moneda)) );
			}
		return $arrSql;
		}
	//////
	private function sql_test_t($cd_test, $cd_usuario, $fase, $ds_operacion){
		return new Sql('insert into tests_t (cd_test, cd_usuario, cd_operacion, ds_operacion, f_ejecucion) values (?, ?, ?, ?, now())',
					array(
						$cd_test, $cd_usuario, $fase, $ds_operacion
						) );
		}
	private function completaCamposOpcionales($datos, $arrCamposOpcionales){
		for ($j=0; $j<count($arrCamposOpcionales); $j++){
			$k=$arrCamposOpcionales[$j];
			if (!array_key_exists($k, $datos))
				$datos->$k = null;
			}
		return $datos;
		}
	public function creaBorradorTest($datos, $cd_usuario, $sent_secret){
		global $secret;

		if ($secret==$sent_secret){
			}
		else {
			throw new Exception($cd_usuario.' no está autorizado para subir tests');
			}
		
		$nuevoCD_Test=$this->numerador('tests', 'cd_test');;
		$datos=$this->completaCamposOpcionales($datos, array('region', 'organismo', 'img', 'f_examen', 'admiteReordenarPreguntas', 'admiteReordenarRespuestas', 'precio', 'cd_moneda') );
		
		$arr=array(
			new Sql('insert into tests (cd_test, ds_test, anho, grupo, region, organismo, img, f_examen, 
										fallosRestan, minutos, numpreguntas, admiteReordenarPreguntas, admiteReordenarRespuestas, 
										precio, cd_moneda, matricula) 
					values (?,?,?,?,?,?,?, ?,?,?,?,?, ?,?,?, generaMatricula_Test() )',
					array(
						$nuevoCD_Test,
						$datos->ds_test, 

						$datos->anho, 
						$datos->grupo, 

						$datos->region, 
						$datos->organismo, 
						$datos->img, 
						$datos->f_examen, 

						$datos->fallosrestan, 
						$datos->minutos, 
						$datos->numpreguntas, 
						$datos->admiteReordenarPreguntas, 
						$datos->admiteReordenarRespuestas, 

						$datos->precio, 
						$datos->cd_moneda, 
						))
			);

		for ($i=0; $i<count($datos->preguntas); $i++ ) {
			$preg=$datos->preguntas[$i];
			$preg=$this->completaCamposOpcionales($preg, array('respuesta3', 'respuesta4', 'respuesta5', 
															'recursopregunta',
															'recursorespuesta0', 'recursorespuesta1', 'recursorespuesta2', 'recursorespuesta3', 'recursorespuesta4', 'recursorespuesta5', 
															'notas'));

			array_push($arr, new Sql(
				'insert into preguntas_tests (cd_test, cd_pregunta, pregunta, cd_respuestacorrecta, 
							respuesta0, respuesta1, respuesta2, respuesta3, respuesta4, respuesta5, 
							recursopregunta, 
							recursorespuesta0, recursorespuesta1, recursorespuesta2, recursorespuesta3, recursorespuesta4, recursorespuesta5, 
							notas) 
					values (?, ?, ?, ?, 
							?, ?, ?, ?, ?, ?, 
							?, 
							?, ?, ?, ?, ?, ?,
							?)', 
				array($nuevoCD_Test, $i, $preg->pregunta, $preg->cd_respuestacorrecta,
					$preg->respuesta0, $preg->respuesta1, $preg->respuesta2, $preg->respuesta3, $preg->respuesta4, $preg->respuesta5, 
					$preg->recursopregunta,
					$preg->recursorespuesta0, $preg->recursorespuesta1, $preg->recursorespuesta2, $preg->recursorespuesta3, $preg->recursorespuesta4, $preg->recursorespuesta5,
					$preg->notas 
					)
				));
			}

		$liscat=explode(',', $datos->liscat); //2,3
		for ($i=0; $i<count($liscat); $i++){
			array_push($arr, 
					new Sql( "insert into test_categorias (cd_test, cd_categoria) values (?, ?)", array($nuevoCD_Test, $liscat[$i] ))
					);
			}

		$archivos=explode(',', $datos->archivos); // ruta1, ruta2
		for ($i=0; $i<count($archivos); $i++){
			if ($archivos[$i]=='')
				continue;

			array_push($arr, 
				new Sql( "insert into archivos_tests (cd_test, cd_archivo) values (?, ?)", array($nuevoCD_Test, $archivos[$i] ))
				);
			}

		array_push($arr, 
			$this->sql_test_t($nuevoCD_Test, $cd_usuario, FasesTramitacion::Alta, null, null)
			);

		$this->conn->ejecutaLote($arr);

		$this->correoe('8ctopusapp@gmail.com', 'Nuevo Test en BD - cd_test='.$nuevoCD_Test, 'CD_Test='.$nuevoCD_Test.'/DS_Test='.$datos->ds_test);

		return $nuevoCD_Test;
		}
	public function informarErrorPregunta($cd_usuario, $cd_test, $cd_pregunta, $motivo){
		$arr=array(
			$this->sql_test_t($cd_test, $cd_usuario, FasesTramitacion::InformarError, 'Pregunta CD_Pregunta='.$cd_pregunta.'/Motivo:'.$motivo)
			);
		$this->conn->ejecutaLote($arr);
		$this->correoe('8ctopusapp@gmail.com', FasesTramitacion::InformarError .': '.$cd_usuario, 'CD_Test='.$cd_test.'/Pregunta CD_Pregunta='.$cd_pregunta.'/Motivo:'.$motivo);
		}
	public function guardaResultadosTest($cd_usuario, $cd_test, $datos_json){
		$arr=array();
		$sql=$this->vinculaTestConUsuario_getSql($cd_usuario, $cd_test, null, null, null);

		if ($sql!=null)	array_push($arr, $sql);
		array_push($arr, new Sql(
				'update usuarios_tests set json_actividad=? where cd_usuario=? and cd_test=?', 
				array($datos_json, $cd_usuario, $cd_test)
				));
		$this->conn->ejecutaLote($arr);
		}
	//////
	public function getMisGrupos($cd_usuario){
		$sql='select g.cd_grupo, g.ds_grupo, g.picture, g.admin from grupos g
				where exists (select cd_usuario from usuarios_grupos ug
							where g.cd_grupo=ug.cd_grupo and cd_usuario=?)';
		return $this->conn->lookupFilas($sql, array($cd_usuario));
		}
	public function getMiembrosGrupo($cd_grupo){
		$sql='select cd_usuario, nombre as given_name, apellidos as family_name, picture from usuarios where cd_usuario in (select cd_usuario from usuarios_grupos where cd_grupo=?)';
		return $this->conn->lookupFilas($sql, array($cd_grupo));
		}
	public function getMsgGrupo($cd_grupo, $lastDate){
		if (isset($lastDate)){
			$sql='select cd_usuario, cd_mensaje, texto as msg, cd_test, badge, f_msg as f from usuarios_grupos_mensajes where cd_grupo=? and f_msg>=? order by cd_mensaje asc';
			return $this->conn->lookupFilas($sql, array($cd_grupo, $lastDate));
			}
		else { //50 últimos
			$sql='select * from (select cd_usuario, cd_mensaje, texto as msg, cd_test, badge, f_msg as f from usuarios_grupos_mensajes where cd_grupo=? order by cd_mensaje desc limit 50) s order by cd_mensaje asc';
			return $this->conn->lookupFilas($sql, array($cd_grupo));
			}
		}
	public function nuevoMsgGrupo($cd_usuario, $cd_grupo, $msg, $cd_test, $cd_badge, $cd_token){
		//verificamos que el grupo sigue vivo
		$sigueVivo=$this->conn->lookupSimple("select cd_grupo from grupos where cd_grupo=? and f_borrado is null", array($cd_grupo));
		if ($cd_grupo!=$sigueVivo) return;

		$sql="insert into usuarios_grupos_mensajes (cd_usuario, cd_grupo, cd_mensaje, texto, cd_test, badge) values (?, ?, ?, ?, ?, ?)";

		$idx=$this->numerador('usuarios_grupos_mensajes', 'cd_mensaje', array('cd_grupo'=>$cd_grupo));
		$this->conn->ejecuta($sql, array($cd_usuario, $cd_grupo, $idx, $msg, $cd_test, $cd_badge));

		//ahora el push
		$test=null;
		if (isset($cd_test) ){
			$test=$this->getDatosTest($cd_test);
			}
		
		$datos=array(
			'cd_grupo'=>$cd_grupo,
			'cd_usuario'=>    $cd_usuario,
			'msg'=>    $msg,
			'cd_mensaje'=> $idx,
			'test'=>   $test,
			'badge'=>  null,
			'f_msg'=>  $this->fechaHora(),
			'cd_token'=> $cd_token,
			);

		$titAlt='Nuevo mensaje de '.$cd_usuario; $msgAlt=$msg;
		$msgIOS='Nuevo mensaje de '.$cd_usuario.': '.$msg;
		$this->sendPushGrupo($cd_grupo, $cd_usuario, $this->genDatosPush('vistaSocial', 'mensajeGrupo', $datos, $msgIOS ,$titAlt, $msgAlt) );
		return $idx;
		}
	public function guardarGrupo($datos, $cd_usuario){
		$arrSql=array(); $ususQueNoExisten=null;

		if ($datos['esBorrado']==1){
			$par=array($datos['cd_grupo']);
			$arrSql=array(
				new Sql("delete from usuarios_grupos_mensajes where cd_grupo=?", $par),
				new Sql("delete from usuarios_grupos where cd_grupo=?", $par),
				// new Sql("delete grupos set f_borrado=now() where cd_grupo=?", $par)
				);
			}
		else {
			if ($datos['esNuevo']==1){
				$sql="insert into grupos (cd_grupo, ds_grupo, picture, admin) values (?, ?, ?, ?)";
				$idx=$this->numerador('grupos', 'cd_grupo');
				$datos['cd_grupo']=$idx;

				$arr=array($idx, $datos['ds_grupo'], null, $cd_usuario);

				array_push($arrSql, new Sql($sql, $arr));
				}
			else {
				$sql="update grupos set ds_grupo=?, picture=? where cd_grupo=?";
				$arr=array($datos['ds_grupo'], null, $datos['cd_grupo']);

				array_push($arrSql, new Sql($sql, $arr));
				}
		
			$ususQueNoExisten=array();
			array_push($arrSql, new Sql( "delete from usuarios_grupos where cd_grupo=?", array($datos['cd_grupo']) ));
			for ($i=0; $i<count($datos['miembros']); $i++ ){
				$m=$datos['miembros'][$i];

				$existe=$this->conn->lookupSimple("select cd_usuario from usuarios where cd_usuario=?", array($m));
				if ($existe!=$m){
					array_push($arrSql, new Sql( "insert into usuarios (cd_usuario) values (?)", array($m) ));
					array_push($ususQueNoExisten, $m);
					}
				array_push($arrSql, new Sql( "insert into usuarios_grupos (cd_usuario, cd_grupo) values (?, ?)", array($m, $datos['cd_grupo']) ));
				}
			}
		

		$this->conn->ejecutaLote($arrSql);
		return $ususQueNoExisten;
		}
	//////
	public function compruebaCodigoPromocional($cd_usuario, $cod){
		$sql="select 
				count(up.CD_Promocion)>p.maxUsuarios as agotada,
				now()>f_caducidad as caducada,
				(select 1 from usuarios_promociones xup 
					where xup.cd_promocion=p.cd_promocion and cd_usuario=?) as usuYaEnPromocion,
				count(up.CD_Promocion) as numUsu,
				p.*
			from 
				promociones p left join usuarios_promociones up 
					on (up.cd_promocion=p.cd_promocion)
			where 
					p.clave_promocion=?";
		$promo=$this->conn->lookupDict($sql, array($cd_usuario, $cod) );

		if ($promo['usuyaenpromocion']=='1' || 
				$promo['agotada']=='1' || 
				$promo['caducada']=='1'){
			return array(
				'usuyaenpromocion'=>$promo['usuyaenpromocion'],
				'agotada'=>$promo['agotada'],
				'caducada'=>$promo['caducada']
				);
			}
		else if ($promo['cd_promocion']==null){
			return array('promocioninexistente'=>1);
			}
		else {
			$this->conn->ejecuta("insert into usuarios_promociones (cd_usuario, cd_promocion) values (?, ?)", 
								array($cd_usuario, $promo['cd_promocion']) );
			return array(
				'cd_promocion'=>$promo['cd_promocion'],
				'ds_promocion'=>$promo['ds_promocion'],
				'resp_promocion'=>$promo['resp_promocion'],
				);
			}

		}
}
?>