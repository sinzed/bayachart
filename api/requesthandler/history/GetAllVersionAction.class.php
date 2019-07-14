<?php
class GetAllVersionAction extends ActionHandler {
    public $response;
    function __construct()
    {
        $this->db = new HistoryDBHandler(); 
        $this->response = new Response(new RequestService());
    }
    function execute(){
        // $this->getDB()->getAllVersions();
        $versions = $this->getDB()->getAllVersions();
        $this->response->setParameter("histories",$versions);
        $this->response->out();
    }
}
?>