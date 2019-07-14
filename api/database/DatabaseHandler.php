<?php
//include "Connection.php";
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class DatabaseHandler extends Connection {

    function __construct(){
             
            parent::__construct();
   
            $this->connection->query ( "SET NAMES utf8" );
                    
	}
  
        
}
?>