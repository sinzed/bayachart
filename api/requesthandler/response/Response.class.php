<?php

class Response
{
  protected
    $template_file,
    $parameters = array();
    private $rqHandler;

  public function __construct()
  {
    $this->rqHandler = "";
    $this->setAllow(false);
  }

  public function setParameter($name, $value)
  {
    $this->parameters[$name] = $value;
    return $this;
  }
  public function setAllow($allow){
    $this->setParameter("allow",$allow);
  }

  public function getParameter($name, $default = null)
  {
    return isset($this->parameters[$name]) ? $this->parameters[$name] : $default;
  }
  public function getJsonStringData(){
    return json_encode($this->parameters);
  }
  public function setTemplate($filename)
  {
    if (is_readable($filename))
    {
      $this->template_file = $filename;
    }
  }

  public function getTemplate()
  {
    return $this->template_file;
  }

  public function render()
  {
    return $this->readTemplate();
  }

  protected function readTemplate()
  {
    $template = file_get_contents($this->getTemplate());

    $tpl = preg_replace('/{\s*\$([\w_\d]+)\s*\}/e', "\$this->getParameter('\\1');", $template);

    return $tpl;
  }
  public function send(){
    $responseData =$this->getJsonStringData();
    $request = $this->getRequestHandler()->getRequest();
    $response = json_encode(array(
      "type" => $this->getRequestHandler()->getRequest()->getParameter("type"),
      "msg"=> $responseData,
      "owner"=>$this->getRequestHandler()->getRequest()->getParameter("action"),
      "query"=>$this->getRequestHandler()->getRequest()->getParameter("query"))
    );
    $this->getRequestHandler()->getRequestManager()->user->send($response);
  }
  public function out(){
    $responseData =$this->getJsonStringData();
    // $request = $this->getRequestHandler()->getRequest();
    $response = json_encode(array(
      "response"=> $responseData
    ));
    echo json_encode($responseData, true);
  }
  // public function sendBinary($binaryData){
  //   $this->getRequestHandler()->getRequestManager()->user->sendBinary($binaryData);
  // }

}
