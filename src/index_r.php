<?php
error_reporting(E_ALL | E_STRICT);
$usu=null;
global $tz;

$getopost=filter_input(INPUT_SERVER, 'REQUEST_METHOD', FILTER_SANITIZE_STRING);
$accion = ($getopost == 'GET')? filter_input(INPUT_GET, 'accion', FILTER_SANITIZE_STRING): filter_input(INPUT_POST, 'accion', FILTER_SANITIZE_STRING);
$REQ=($getopost == 'GET'?INPUT_GET:INPUT_POST);

require_once('metadatos.php'); 
try{
    @session_start();
    // if ($accion=='login' || $accion=='loginNativo' || $accion=='noHayUsuario'){
    //     }
    // else {
    $usu=new Usuario();//saca los datos de la sesión
    $_SESSION['LAST_ACTIVITY'] = time(); // update last activity time stamp
    // $tz=$_SESSION['tz'];
    // }
    }
catch (Exception $ee){
    echo json_encode(array('retorno'=>0, 
                    'error'=>1, 
                    'msgError'=>$ee->getMessage(),
                    'sql' => $conn->arrResultSet,
                    ));
    exit;
    }

$md=new Metadatos($conn, $usu);

$ret=null;

global $showSQL;

$json_order=null;
try {
    $cd_usuario=null;//$usu->cd_usuario;
    switch ($accion) {
        // case 'getDestacados':
        //     if ($cd_usuario==null && isset($_POST['cd_device']) ){
        //         $cd_usuario=$_POST['cd_device'];
        //         }

        //     $catsDinamicas=getCatsDinamicas();
        //     $testsCat=array();
        //     $testsCat=array_merge($md->getIDsCategoriaGratuitos($cd_usuario, -3)->filas, $testsCat);
        //     $testsCat=array_merge($md->getIDsCategoriaValorados($cd_usuario, -2)->filas, $testsCat);
        //     $testsCat=array_merge($md->getIDsCategoriaNuevosActualizados($cd_usuario, -1)->filas, $testsCat);

        //     $ret=array('retorno' => 1, 
        //                'categorias' => $catsDinamicas,
        //                'tests' => $testsCat, 
        //                'sql' => $md->__logSQL($showSQL),
        //                );
        //     echo json_encode($ret);
        //     break;
        case 'getPortadaTienda'://obsoleto 18-feb-2016
            if ($cd_usuario==null && isset($_POST['cd_device']) ){
                $cd_usuario=$_POST['cd_device'];
                }

            if ($cd_usuario!=null){
                $categorias=$md->getCategoriasPersonalizadas($cd_usuario)->filas;
                if (count($categorias)==0)
                    $categorias=$md->getCategorias()->filas;
                }
            else
                $categorias=$md->getCategorias()->filas;

            array_splice($categorias, 0, 0, getCatsDinamicas() );
            
            $tests=array(); $arrCats=array();
            for ($i=0; $i<count($categorias); $i++){
                $fila=$categorias[$i];

                if ($fila['cd_categoria']>0 && $fila['numtestsporcat']>0)
                    array_push($arrCats, $fila['cd_categoria'] );
                }
            $testsCat=$md->getPreviewCategoria($cd_usuario, $arrCats )->filas;
            // #optimizar: en vez de hacer merge, añadir únicamente aquellos tests que no estén ya
            $testsCat=array_merge($md->getPreviewCategoriaGratuitos($cd_usuario, -3)->filas, $testsCat);
            $testsCat=array_merge($md->getPreviewCategoriaValorados($cd_usuario, -2)->filas, $testsCat);
            $testsCat=array_merge($md->getPreviewCategoriaNuevosActualizados($cd_usuario, -1)->filas, $testsCat);

            $ret=array('retorno' => 1, 
                       'categorias' => $categorias,
                       'tests' => convierteBoolLista($testsCat), 
                       'sql' => $md->__logSQL($showSQL),
                       );
            echo json_encode($ret);
            break;
        case 'cargarMasCat': //obsoleto 18-feb-2016
            $cd_categoria=filter_input($REQ, 'cat', FILTER_VALIDATE_INT);
            $desde=filter_input($REQ, 'desde', FILTER_VALIDATE_INT);
            
            $cuantos=filter_input($REQ, 'cuantos', FILTER_VALIDATE_INT);
            global $limitePreview;

            if ($cuantos>$limitePreview) $cuantos=$limitePreview;

            $test=$md->cargarMasCat($cd_categoria, $desde, $cuantos+1);

            $ret=array('retorno' => 1, 
                        'tests' => array_slice($test, 0, $cuantos), 
                        'sql' => $md->__logSQL($showSQL),
                        'hayMas' => count($test)>$cuantos
                       );
            echo json_encode($ret);
            break;
        case 'getPreviewTest':
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);
            $matricula=filter_input($REQ, 'matricula', FILTER_SANITIZE_STRING);
           
            $test=$md->getPreviewTest($cd_usuario, $cd_test, $matricula);
            $ret=array('retorno' => 1, 
                        'test' => $test, 
                        'sql' => $md->__logSQL($showSQL),
                       );
            echo json_encode($ret);
            break;
        case 'getTestComprado':
            $json_order=json_decode( filter_input($REQ, 'pruebaCompra', FILTER_UNSAFE_RAW) );
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);

            $valido=$md->compruebaCert($json_order, $cd_test);
            if ($valido==false){
                $ret=array('retorno'=> 0, 
                            'error'=> 1,
                            'msgError'=> 'La firma de la orden de compra no coincide con la firma del desarrollador'
                       );
                echo json_encode($ret);
                return;
                }
            //sin break, continua a getTest
        case 'getTest':
            if ($cd_usuario==null && isset($_POST['cd_device']) ){
                $cd_usuario=$_POST['cd_device'];
                }
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);
            
            $ret=array('retorno' => 1, 
                       'test' => convierteBool ($md->getTest($cd_usuario, $cd_test, $json_order) ),
                       //'cats' => $md->getCategorias()->filas,
                       'sql' => $md->__logSQL($showSQL),
                       );
            echo json_encode($ret);
            break;
        case 'getMuestraGratis':
            if ($cd_usuario==null && isset($_POST['cd_device']) ){
                $cd_usuario=$_POST['cd_device'];
                }
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);

             $ret=array('retorno' => 1, 
                       'test' => $md->getMuestraGratis($cd_usuario, $cd_test),
                       'sql' => $md->__logSQL($showSQL),
                       );
            echo json_encode($ret);
            break;
        // case 'getDatosTest': //datos generales
        //     $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);
        //     $ret=array('retorno' => 1, 
        //             'test'=> $md->getDatosTest($cd_test),
        //             'sql' => $md->__logSQL($showSQL),);

        //     echo json_encode($ret);
        //     break;
        case 'creaBorradorTest':
            $datos=json_decode( filter_input($REQ, 'datos', FILTER_UNSAFE_RAW) );
            $knowssecret=filter_input($REQ, 'secret', FILTER_SANITIZE_STRING);

            $cd_test=$md->creaBorradorTest($datos, $cd_usuario, $knowssecret);

            $ret=array('retorno' => 1, 
                        'cd_test'=>$cd_test,
                        'sql' => $md->__logSQL($showSQL),);
            echo json_encode($ret);
            break;
        case 'like+':
        case 'like-':
            if (isset($_POST['cd_device']) ){
                $cd_usuario=$_POST['cd_device'];
                }
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);

            $md->toggleLike($accion, $cd_usuario, $cd_test);

            $ret=array('retorno' => 1, 
                    'sql' => $md->__logSQL($showSQL),);
            echo(json_encode($ret));
            break;
        case 'getNumLikes':
            if (isset($_POST['cd_device']) ){
                $cd_usuario=$_POST['cd_device'];
                }
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);
            
            $info=$md->getNumLikes($cd_usuario, $cd_test);

            $ret=array('retorno' => 1, 
                        'likes'=>$info['likes'], 
                        'likeit'=> $info['likeit'], 
                        'sql' => $md->__logSQL($showSQL),);
            echo(json_encode($ret));
            break;
        case 'buscaTests':
            if (isset($_POST['cd_device']) ){
                $cd_usuario=$_POST['cd_device'];
                }

            if (isset($_POST['search']) && $_POST['search']!=''){
                $q=filter_input($REQ, 'search', FILTER_SANITIZE_STRING);
                $res=convierteBoolLista($md->buscaTests($cd_usuario, $q) );
                }
            else if (isset($_POST['cd_test'])){
                $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);
                $res=convierteBoolLista( array( $md->getPreviewTest($cd_usuario, $cd_test) ));
                }
            else
                $res=array();
            
            $ret=array('retorno' => 1, 
                        'tests' => $res, 
                        'sql' => $md->__logSQL($showSQL),
                       );
            echo json_encode($ret);
            break;
        //--------------------------------------------------------
        case 'compruebaCodigoPromocional':
            $cod=filter_input($REQ, 'cod', FILTER_UNSAFE_RAW);
            $resp=$md->compruebaCodigoPromocional($cd_usuario, $cod);

            $ret=array('retorno'=> 1, 
                        'resp'=>    $resp,
                        'sql'=>     $md->__logSQL($showSQL),);
            echo(json_encode($ret));

            break;
        case 'informarErrorPregunta':
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);
            $cd_pregunta=filter_input($REQ, 'cd_pregunta', FILTER_VALIDATE_INT);
            $motivo=filter_input($REQ, 'msg', FILTER_SANITIZE_STRING);

            $md->informarErrorPregunta($cd_usuario, $cd_test, $cd_pregunta, $motivo);
            $ret=array('retorno'=> 1, 
                        'sql'=>     $md->__logSQL($showSQL),);
            echo(json_encode($ret));
            break;
        case 'guardaResultadosTest':
            if (isset($_POST['cd_device']) ){
                $cd_usuario=$_POST['cd_device'];
                }
            
            $cd_test=filter_input($REQ, 'cd_test', FILTER_VALIDATE_INT);
            $datos_json=filter_input($REQ, 'datos', FILTER_UNSAFE_RAW);

            $md->guardaResultadosTest($cd_usuario, $cd_test, $datos_json);
            $ret=array('retorno'=> 1, 
                        'sql'=> $md->__logSQL($showSQL),);
            echo(json_encode($ret));
            break;
        //--------------------------------------------------------
        // case 'loginNativo':
        //     $obj=json_decode( filter_input($REQ, 'datosUsu', FILTER_UNSAFE_RAW) );
        //     $tz=filter_input($REQ, 'tz', FILTER_SANITIZE_STRING);
            
        //     $datosUsu=array(
        //         'cd_usuario'=>$obj->email,
        //         'email'=>$obj->email,
        //         'family_name'=>$obj->family_name,
        //         'given_name'=>$obj->given_name,
        //         'picture'=>$obj->picture
        //         );

        //     Usuario::guardaEnSesion($datosUsu, $tz);
        //     $conn->logInfo('Login '.$datosUsu['cd_usuario'], 'LOGIN');

        //     $esUsuarioNuevo=$md->altaUsuario($datosUsu, $tz);

        //     $ret=array('retorno' => 1, 
        //                 'sql' => $md->__logSQL($showSQL), 
        //                 );
        //     echo json_encode($ret);
        //     break;
        // case 'login':
        //     $token=filter_input($REQ, 'token', FILTER_SANITIZE_STRING);
        //     $tz=filter_input($REQ, 'tz', FILTER_SANITIZE_STRING);
            
        //     $datosUsu=$md->getGoogleUserProfile($token);
        //     Usuario::guardaEnSesion($datosUsu, $tz);
        //     $conn->logInfo('Login '.$datosUsu['cd_usuario'], 'LOGIN');

        //     $esUsuarioNuevo=$md->altaUsuario($datosUsu);

        //     $ret=array('retorno' => 1, 
        //                 'userData'=>$datosUsu, 
        //                 'esUsuarioNuevo'=>$esUsuarioNuevo,
        //                 'sql' => $md->__logSQL($showSQL), 
        //                 );
        //     echo json_encode($ret);
        //     break;
        // case 'logout':
        //     $conn->logInfo('Logout', 'LOGIN');
        //     session_destroy();

        //     $ret=array('retorno' => 1, 
        //         'sesionDestruida'=>1,
        //         'sql' => $md->__logSQL($showSQL),
        //         );
        //     echo json_encode($ret);
        //     break;
        // case 'sendPushDeviceID':
        //     $cd_usuario=$usu->cd_usuario;
        //     $cd_gcm=filter_input($REQ, 'cd_gcm', FILTER_UNSAFE_RAW);
        //     $md->guardaID_Dispositivo($cd_usuario, $cd_gcm);

        //     $ret=array('retorno' => 1, 
        //                 'sql' => $md->__logSQL($showSQL),);
        //     echo(json_encode($ret));
        //     break;
        default:
            trigger_error('¡Accion '. $accion . ' no implementada!');
        }
    }
catch (Exception $ee){
    $ret=array('retorno'=>0, 
                'error'=>1, 
                'msgError'=>$ee->getMessage(),
                'sql' => $conn->arrResultSet,
                );
    echo json_encode($ret);
    }

function fnGetMisGrupos($cd_usuario, $from=null){
    global $md;
    $gru=$md->getMisGrupos($cd_usuario);
    $arrIDs=array();
    for ($i=0; $i<count($gru->filas); $i++){
        $cd_grupo=$gru->filas[$i]['cd_grupo'];

        $gru->filas[$i]['miembros']=$md->getMiembrosGrupo($cd_grupo)->filas;
        $gru->filas[$i]['msg']=$md->getMsgGrupo($cd_grupo, $from)->filas;
        }
    return $gru->filas;
    }
function convierteBoolLista($lista){
    for ($i=0; $i<count($lista); $i++){
        $lista[$i]=convierteBool($lista[$i]);
        }
    return $lista;
    }
function convierteBool($el){
    if (isset($el['lotengo'])){
        $el['lotengo']= ($el['lotengo']=='1');
        return $el;
        }
    return $el;
    }

function getCatsDinamicas(){
    $d1=array(
        'ds_categoria'=>'Nuevos y actualizados',
        'cd_categoria'=>-1,
        'i'=>'cat--1.jpg',
        'numtestsporcat'=>10, 'listarComoCategoria'=>1, 'cd_categoriapadre'=>null, 
        );
    $d2=array(
        'ds_categoria'=>'Los más valorados',
        'cd_categoria'=>-2,
        'i'=>'cat--1.jpg',
        'numtestsporcat'=>10, 'listarComoCategoria'=>1, 'cd_categoriapadre'=>null,
        );
    $d3=array(
        'ds_categoria'=>'Gratuitos',
        'cd_categoria'=>-3,
        'i'=>'cat--3.jpg',
        'numtestsporcat'=>10, 'listarComoCategoria'=>1, 'cd_categoriapadre'=>null,
        );
    /* 
    $d3=array(
        'ds_categoria'=>'(título dinamico recomendaciones para ti)',
        'cd_categoria'=>-3,
        'i'=>'fa-birthday-cake',
        'numtestsporcat'=>10, 'listarComoCategoria'=>1, 'cd_categoriapadre'=>null,
        ); */
    return array($d3, $d2, $d1);
    }
?>
