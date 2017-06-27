<?php
$tz='+00:00';

require_once(__DIR__.'/paramBD.nosvn.php'); 
$dsn = "mysql:host={$dbhost};port={$dbport};dbname={$dbname};charset=utf8";

class nullableInt{
	public $value;
	function __construct($nv){
		if ($nv=='') $nv=null;
		$this->value=$nv;
		}
	}

class Conn{
	private $con=null;
	private $usu=null;
	public $arrResultSet=array();

	function __construct(){
		global $dsn;
		global $username;
		global $password;
		
		// try{
			$this->con = new PDO($dsn, $username, $password);
		// 	}
		// catch (Exception $ee){
		//     $ret=array('retorno'=>0, 
		//                 'error'=>1, 
		//                 'msgError'=>$ee->getMessage(),
		//                 // 'sql' => $conn->arrResultSet,
		//                 );
		//     echo json_encode($ret);
		//     }
		    
		$this->con->setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);
		$this->set_timezone();
		}
	//////
	function setUsu($nusu){
		$this->usu=$nusu;
		}
	private function logQuitanl($s){
		$ret= trim(preg_replace('/\s\s+/', ' ', $s ));
		$ret= trim(preg_replace('/\s+/', ' ', $s ));
		// $ret=str_replace('[]', '', $ret);
		return $ret;
		// return json_encode($s);
	 	}
	function logInfo($texto, $tipo='INFO', $param=null){
		$t=microtime();
		$this->log('['.$tipo.'] '.$texto, $param, $t, $t, null);
		}
	function log($sql, $param, $t1, $t2, $nfilas){
		$this->log2Arr($sql, $param, $t1, $t2, $nfilas);
		// $this->log2File($sql, $param, $t1, $t2, $nfilas);
		}
	private function log2Arr($sql, $param, $t1, $t2, $nfilas){
		$el=array( 't='.substr($t2-$t1,0,5).'/numFilas='.$nfilas, $sql, $param, $t1, $t2 );
		array_push($this->arrResultSet, $el);
		}
	private function log2File($sql, $param, $t1, $t2, $nfilas){
		if (!array_key_exists('LOG_SQL', $_SERVER))
			return ;
		else if ($_SERVER['LOG_SQL']!=1) 
			return;

		$xp=$this->logQuitanl( print_r($param, true) );

		$arch = fopen($_SERVER['LOG_SQL_ROOT'].date("Ymd").".log", "a+"); 

		$uri=$_SERVER['REQUEST_URI']; 
		$accion='';
		if ($_SERVER['REQUEST_METHOD'] == 'POST'){
			if (isset($_POST['accion']) ){
				$accion='?accion='.$_POST['accion'];
				}
			}

		// $accion = ($_SERVER['REQUEST_METHOD'] == 'POST') ? ('?accion='.$_POST['accion']) : '' ;

		$s="[".date("Y-m-d H:i:s")."] [" . 
		$this->usu ."] [".
		$uri . $accion .
		"] [t:" . ($t2-$t1)."] [" .
		$xp . "] [".$nfilas." filas] [".
		$sql."]\n--------------------\n";

		fwrite($arch, $s);
		fclose($arch);
		}
	//////
	function set_timezone(){ //esto debería ir en un init de la conexión pero si lo haces así NO FUNCIONA
		global $tz;
		if ( substr($tz,0, 2)=='--' )
			$tz=substr($tz, 1);
		try {
			$this->con->query("set time_zone='". $tz ."'");
			$this->logInfo("set time_zone='". $tz ."'");
			} 
		catch (Exception $e){
			$this->con->query("set time_zone='-00:30'");
			}
		}
	function lookup($sql, $param=null, $devolverResultado=1) {
		$t1=microtime();
		$stmt = $this->con->prepare($sql);
		$i = 1;

		if (isset($param)){
			foreach ($param as $key => &$val) {
				$par = $this->getPDOConstantType($val);
				$stmt->bindParam($i, $par[0], $par[1]);
				$i++;
				}
			}

		$ok=$stmt->execute();

		if (!$ok) {
			//var_dump($sql); var_dump($param);
			$err=$stmt->errorInfo();
			$err['sql']=$sql;
			$err['stacktrace']=debug_backtrace();

			$this->logInfo($stmt->errorInfo()[2].'
				*********** 
				'.$sql, 'ERROR', $param);

	 		throw new Exception( $err[2] );
			}

		if ($devolverResultado==1) {
			$result = $stmt;
			}
		else {
			$result=$stmt->rowCount() . ' filas afectadas';
			}
		$t2=microtime();

		$this->log($sql, $param, $t1, $t2, $stmt->rowCount());
		return $result;
		}
	function ejecuta($sql, $param=null){
		$ret=$this->lookup($sql, $param, 0);
		return $ret;
		}
	function ejecuta_RetID($sql, $param=null){
		$ret=$this->lookup($sql, $param, 1);
		$retid = array('id' =>  -1);
		$retid['id'] =  $this->con->lastInsertId();
		return $retid;
		}
	function ejecutaLote($arrSql){
		$sql0; $param0;
		if (count($arrSql)>0) {
			try {
				$this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$this->con->beginTransaction();

				$this->logInfo('Inicio transacción');
				for ($i=0; $i<count($arrSql); $i++){
					$sql=$arrSql[$i];
					$sql0=$sql->sql; $param0=$sql->param; //para el log
	 				$this->lookup($sql->sql, $sql->param, 0);
					}
				$this->con->commit();
				$this->logInfo('Fin transacción');
				}
			catch (Exception $e){
				// var_dump ($e);
				// var_dump($sql);
				$this->con->rollBack();

				$this->logInfo($e->getMessage().'
						 *********** 
						'.$sql0, 'ERROR', $param0);
				$this->logInfo('RollBack transacción');
				throw $e;
				}
			}
		}
	function lookupFilas($sql, $param=null) {
		$result=$this->lookup($sql, $param);
		return new Filas($result);
		}
	function lookupFilasCt($sql, $param=null, $arrDescripciones=null) {
		// en arrDescripciones viene un array con descripciones bonitas
		$result=$this->lookup($sql, $param);

		$ret= new FilasCt($result);

		if (isset($arrDescripciones)){
			if (count($arrDescripciones)!=count($ret->columnas))
				throw new ErrorException('Error en lookupFilasCt: no coincide el número de columnas de arrDescripciones');
			for ($i=0; $i<count($ret->columnas); $i++){
				$ret->columnas[$i]['ds']=$arrDescripciones[$i];
				}
			}
		return $ret;
		}
	function lookupSimple($sql, $param=null) {
		$result=$this->lookup($sql, $param);
		return $result->fetchColumn();
		}
	function lookupDict($sql, $param=null) {
		$result=$this->lookup($sql, $param);

		$ret = $result->fetchAll(PDO::FETCH_ASSOC);

		if(count($ret)==0) {
			return null;
		} else {
			return $ret[0];
			}
		}

	function getPDOConstantType($var) {
		if(is_int($var))
			return array(intval($var), PDO::PARAM_INT);
		elseif(is_numeric($var)) //decimales
			return array($var, PDO::PARAM_STR);
		elseif(is_null($var))
			return array(null, PDO::PARAM_NULL);
		else if ($var instanceof nullableInt)
			return array($var->value, PDO::PARAM_INT);
		else
			return array($var, PDO::PARAM_STR);
	 	}
	function __destruct(){
		$this->con = null;
		}
	}

class Sql{
	public $sql;
	public $param;
	public $comentario;
	function __construct($s, $p, $comentario=null){
		$this->sql = $s;
		$this->param =$p;
		$this->comentario = $comentario;
		}
	}

class Filas{
	public $numFilas=-1;
	public $numColumnas=0;
	public $columnas=array(); // array
	public $filas=null; // array 2x2
 
	function leeCols($result){
		for($i=0; $i<$this->numColumnas; $i++){
		 	$field_info = $result->getColumnMeta($i);
		 	$this->columnas[$i]=$field_info['name'];
			}
		}
	function __construct($result){
		$this->numColumnas = $result->columnCount();

		$this->leeCols($result);
		$this->filas=$result->fetchAll(PDO::FETCH_ASSOC);
		$this->numFilas=$result->rowCount();
		}
	function toString(){
		return sprintf (
				 '{numFilas:%d, numColumnas:%d, columnas:[%s]}',
									 $this->numFilas
									 , $this->numColumnas
									 , print_r($this->columnas, true)
				);
			}
	function json(){
		return json_encode(array('columnas'=>$this->columnas , 'filas'=>$this->filas));
		}
	}
// Filas con información de tipo de dato en la colección de columnas: {ds: Valor, t: tipo}
class FilasCt extends Filas{
	function leeCols($result){
		for($i=0; $i<$this->numColumnas; $i++){
			$field_info = $result->getColumnMeta($i);

			$col=array();
			$col['cd'] = $field_info['name'];

			if (array_key_exists('native_type', $field_info))
				$col['t'] = $field_info['native_type'];
			else
				$col['t'] = 'BOOL';

			array_push($this->columnas, $col);
			}
		}
	}

class Usuario{
	// public static function guardaEnSesion($arrUsuario, $tz=null){
	// 	if (PHP_VERSION >= 5.1) {session_regenerate_id(true);} else {session_regenerate_id();}

	// 	$_SESSION['cd_usuario'] = $arrUsuario['cd_usuario'];
	// 	$_SESSION['datosUsuario'] = json_encode($arrUsuario);
		
	// 	$_SESSION['tz'] = $tz;
	// 	}

	function __construct(){
		// if (! isset($_SESSION['cd_usuario'])){
		// 	throw new Exception('Sesión perdida');
		// 	}

		// global $tz;
		// $this->cd_usuario = $_SESSION['cd_usuario'];
		// $tz = $_SESSION['tz'];
		}
	}

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
	throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
	}
set_error_handler("exception_error_handler");

?>