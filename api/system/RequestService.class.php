<?php

class RequestService {
    private $dbHandler;
    function __construct()
    {
        $this->dbHandler = new DatabaseHandler();
    }
    function handle($postData){
        $request = new Request();
        $request->setParameter("action",$postData['action']);
        if($postData['action']=="getAllVersions"){
            $getVersions = new GetAllVersionAction();
            $getVersions->execute();
        }
        if($postData['action']=="save"){
            // print_r($postData);
            $saver = new SaveNewInput();
            $saver->execute($postData['data']);
        }
        if($postData['action']=="getHistory"){
            // print_r($postData);
            $saver = new GetHistory();
            $saver->execute($postData['historyID']);
        }
        
    }
    // getDbHandler(){
    
    // }
}   
?>