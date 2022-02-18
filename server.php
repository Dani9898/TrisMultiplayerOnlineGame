<?php 

$folder = 'room/';
$file  = $_GET ['stanza'];
$file = $folder .= $file.= '.json';


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
  'lastUser' => '',
];

if (!is_file($file)) {
    $json = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($file, $json);
    $json = json_decode($json);
} else {
    $json = file_get_contents($file);
    $json = json_decode($json);
}

// $_GET['player'] può essere o X o O

if (isset($_GET['stanza']) && isset($_GET['position']) && isset($_GET['player'])) {
  $position  = $_GET['position'];
  $player    = $_GET['player'];
  $json->lastUser = $player;
  $json->$position = $player;

  $json->winner = asWinner($json, $player);
  $json = json_encode($json, JSON_PRETTY_PRINT);
  file_put_contents($file, $json); 
  echo $json;
  die;
}

if (isset($_GET['stanza']) && isset($_GET['reset'])) {
  $json = json_encode($data, JSON_PRETTY_PRINT);
  file_put_contents($file, $json);
  $json = json_decode($json); die;
}

if (isset($_GET['stanza'])) {
    echo json_encode($json, JSON_PRETTY_PRINT); die;
}


function asWinner($json, $player) {
    if ( // Horizontal
        ($json->s1_1 == $player && $json->s1_2 == $player && $json->s1_3 == $player) ||
        ($json->s2_1 == $player && $json->s2_2 == $player && $json->s2_3 == $player) ||
        ($json->s3_1 == $player && $json->s3_2 == $player && $json->s3_3 == $player)
        ) {
        return true;
    }

    if ( // Vertical
      ($json->s1_1 == $player && $json->s2_1 == $player && $json->s3_1 == $player) ||
      ($json->s1_2 == $player && $json->s2_2 == $player && $json->s3_2 == $player) ||
      ($json->s1_3 == $player && $json->s2_3 == $player && $json->s3_3 == $player)
      ) {
      return true;
  }

    if ( // Diagonali
      ($json->s1_1 == $player && $json->s2_2 == $player && $json->s3_3 == $player) ||
      ($json->s1_3 == $player && $json->s2_2 == $player && $json->s3_1 == $player)
      ) {
      return true;
  }

    return false;
}

?>