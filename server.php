<?php 

// gestione stanza e creazione percorso file json
$file  = $_GET ['stanza'];
$folder = 'room/';
$file = $folder .= $file.= '.json';

// dati partita
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
  'nclick' => 0,
  'winnerData' => (Object)[]
];

// gestione creazione dei file json
// se il file/stanza non esiste
if (!is_file($file)) {
    // salvo i dati in una variabile
    $json = json_encode($data, JSON_PRETTY_PRINT);
    // stampo i dati nel file che ho creato
    file_put_contents($file, $json);
    // decodifico i file
    $json = json_decode($json);
} else {
    // prendo i dati del file
    $json = file_get_contents($file);
    // decodifico i dati
    $json = json_decode($json);
}

// $_GET['player'] può essere o X o O
// gestisto la chiamata dal client
if (isset($_GET['stanza']) 
    && isset($_GET['position']) 
    && isset($_GET['player'])) {
  
    // salvo la coordinata
    $position  = $_GET['position'];
    // salvo il player
    $player    = $_GET['player'];
    // creo il dato lastuser e lo valorizzo
    $json->lastUser = $player;
    // tengo traccia del numero di click
    $json->nclick++;
    
    $json->$position = $player;
    // creo e valorizzo una variabile che gestisce il reset
    $json->reset = false;
    // tramite una func valorizzo object winnerdata(dati sul vincitore)
    $json->winnerData = asWinner($json, $player);
    // codifico i dati
    $json = json_encode($json, JSON_PRETTY_PRINT);
    // sovrascrivo i nuovi dati sul file 
    file_put_contents($file, $json); 
    // ritorno al client il file json contentente i dati
    echo $json;
    die;
}

// gestione reset
// gestisto la chiamata dal client
if (isset($_GET['stanza']) 
    && isset($_GET['reset'])) {
    
    // valorizzo reset con true
    $data->reset = true;  
    // codifico i dati
    $json = json_encode($data, JSON_PRETTY_PRINT);
    // sovrascrivo i nuovi dati sul file 
    file_put_contents($file, $json);
    die;
}

if (isset($_GET['stanza'])) {
    if (!$json->nclick && strlen($_GET['player']) == 1 && !$json->lastUser) {
      $json->lastUser = $_GET['player'];
      $json = json_encode($json, JSON_PRETTY_PRINT);
      file_put_contents($file, $json);
      $json = json_decode($json);
    }

    if (!$json->nclick && $_GET['player'] == 'null') {
      $json->player = $json->lastUser == 'x' ? 'o' : 'x';
    }

    echo json_encode($json, JSON_PRETTY_PRINT); die;
}

// gestione vittoria
function asWinner($json, $player) {

  // horizontal
  if ($json->s1_1 == $player && $json->s1_2 == $player && $json->s1_3 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s1_1','s1_2','s1_3']
    ];
  }

  if ($json->s1_2 == $player && $json->s2_2 == $player && $json->s3_2 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s1_2','s2_2','s2_3']
    ];
  }

  if ($json->s3_1 == $player && $json->s3_2 == $player && $json->s3_3 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s3_1','s3_2','s3_3']
    ];
  }

  // Vertical
  if ($json->s1_1 == $player && $json->s2_1 == $player && $json->s3_1 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s1_1','s2_1','s3_1']
    ];
  }

  if ($json->s1_2 == $player && $json->s2_2 == $player && $json->s3_2 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s1_2','s2_2','s3_2']
    ];
  }

  if ($json->s1_3 == $player && $json->s2_3 == $player && $json->s3_3 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s1_3','s2_3','s3_3']
    ];
  }

  // Diagonali
  if ($json->s1_1 == $player && $json->s2_2 == $player && $json->s3_3 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s1_1','s2_2','s3_3']
    ];
  }

  if ($json->s1_3 == $player && $json->s2_2 == $player && $json->s3_1 == $player) {
    return (Object)[
      'winner' => true,
      'ceilWin' => ['s1_3','s2_2','s3_1']
    ];
  }
  return false;

}


?>