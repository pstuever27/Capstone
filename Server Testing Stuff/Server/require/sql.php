<?php
function SQLConnect() {
  $sql = new mysqli("localhost", "u394330643_songsync", 'o~9>@Kxd4UF9pVzpKi#Z$', 'u394330643_database');
  if($sql -> connect_errno) {
    throw new Exception("MySQL database: Connection Failed");
  }
  return $sql;
}
?>