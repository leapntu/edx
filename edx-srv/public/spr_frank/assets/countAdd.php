<?php
$str = file_get_contents("count.json");
$count = json_decode($str,true);
$count["count"] += 1;
$new = fopen("count.json","w");
fwrite($new, json_encode($count));
fclose($new);
?>
