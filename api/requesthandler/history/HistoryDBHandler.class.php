<?php
class HistoryDBHandler extends DatabaseHandler {
    function getAllVersions(){
        $queryResult = $this->connection->query("SELECT id,name,timestamp FROM inputs")  or die ( $this->connection->error );
        while($result = mysqli_fetch_assoc($queryResult) ){
            $inputs[] = $result;
        }
        return $inputs;

    }
    function getHistory($historyID){
        $queryResult = $this->connection->query("SELECT content FROM inputs where id=$historyID ")  or die ( $this->connection->error );
        // while($result = mysqli_fetch_assoc($queryResult) ){
        //     $inputs[] = $result;
        // }
        return $input = mysqli_fetch_assoc($queryResult);

    }
    function saveNewInput($input,$name){
        // $input = mysqli_real_escape_string($input);
        $input = json_encode($input);
        $query = "INSERT into inputs (name,content)
        Values(
        '".$name."',
        '".$input."')";
        $queryResult = $this->connection->query(
            $query
            )  or die ( $this->connection->error );
    }
}