<?php
class GetHistory extends ActionHandler {
    public $response;
    function __construct()
    {
        $this->db = new HistoryDBHandler(); 
        $this->response = new Response(new RequestService());
    }
    function execute($historyID){
        $history = $this->getDB()->getHistory($historyID);
        $this->response->setParameter("history",json_encode($history));
        $this->response->out();
    }
}
?>