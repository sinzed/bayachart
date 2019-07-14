<?php

class Request
{
  protected $_parameters = array();

  public function __construct()
  {
    $this->_parameters = array();
  }

  public function getParameters()
  {
    return $this->_parameters;
  }

  public function setParameters($parameters)
  {
    $this->_parameters = $parameters;
  }

  public function setParameter($parameter, $value)
  {
    return $this->_parameters[$parameter] = $value;
  }

  public function getParameter($parameter)
  {
    $default = "";
      if (isset($this->_parameters[$parameter]))
      {
        return $this->_parameters[$parameter];
      }
    return $default;
  }

}
