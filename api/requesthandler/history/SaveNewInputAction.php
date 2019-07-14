<?php
class SaveNewInput extends ActionHandler {
    public $response;
    function __construct()
    {
        $this->db = new HistoryDBHandler(); 
        $this->response = new Response(new RequestService());
    }
    function execute($data){
        // $this->getDB()->getAllVersions();
        $parsedData = json_decode($data,true);
        $input = $parsedData['content'];
        $name = $parsedData['name'];

        $versions = $this->getDB()->saveNewInput($input, $name);
        $this->response->setParameter("histories","done");
        $this->response->out();
    }
}
?>