<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// open fire database 
// user : openfire pass : wfxru6QfBXMnXchp
class Connection {
	private static $servername = "127.0.0.1";
	private static $database = "musiceri_bayachart";
	private static $username = "musiceri_chart";
	private static $password= 'MdmcIn1~K(EL';
	public  static $singleConnection = null;
	public  $connection;
	function __construct(){
		// if(isset($_SERVER['SERVER_NAME']) && $_SERVER['SERVER_NAME']=="localhost"){
		// 	$this->username = "root";
		// 	$this->password = "";
		// 	echo " does it us this?????";
		// }
		$this->connect();
		
	}
	public static function getConnection(){
		if(Connection::$singleConnection == null){
			// echo "connecting once 1";
			Connection::$singleConnection = new mysqli(Connection::$servername, Connection::$username, Connection::$password, Connection::$database) or die(Connection::$singleConnection->error);
			// echo "no error?";
		}
		return Connection::$singleConnection;
	}
	public function setConnection($connection){
		$this->connection = $connection;
	}
	public function  connect(){
		// global $connection ;
		// $this->connection = $connection;
		$this->connection = Connection::getConnection();
		if ($this->connection->connect_error) {
			die("Connection failed: " . $this->connection->connect_error);
		}
	
	}	
	// public function setConnection($connection){
	// 	echo PHP_EOL."setting connection is";
	// 	print_r($connection);
	// 	$this->connection = $connection;
	// }
	public function  connectIndividual(){
		$this->connection = new mysqli($this->servername, $this->username, $this->password, $this->database);
		if ($this->connection->connect_error) {
			die("Connection failed: " . $this->connection->connect_error);
		}
	
	}
	public function disconnect(){
		mysql_close($this->connection);
	}
	
	
}


?>