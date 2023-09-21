<?php
function SQLConnect() {
  $sql = new mysqli("mysql.eecs.ku.edu", "p953s470", 'password', 'p953s470');
  if($sql -> connect_errno) {
    throw new Exception("MySQL database: Connection Failed");
  }
  return $sql;
}
?>