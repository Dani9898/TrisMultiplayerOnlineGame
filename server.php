<?php 
  
$file=$_GET ['stanza'] . '.json';

if(is_file($file)) {
    echo ("$file is a regular file");
  } else {
    echo ("$file is not a regular file");
  }

$data = (Object)[
    's1_1' => '',
    's1_2' => '',
    's1_3' => '',
    's2_1' => '',
    's2_2' => '',
    's2_3' => '',
    's3_1' => '',
    's3_2' => '',
    's3_3' => '',
];

// var_dump($data);
$json = json_encode($data);
$bytes = file_put_contents($file, $json); 

$content = file_get_contents($file);
$content = json_decode($content);

var_dump($content->s1_1);
  
?>