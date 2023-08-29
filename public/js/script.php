<?php

$mysqli = new mysqli('tourmetoday.co', 'myuser', 'mypass', 'TourMeDB');
host: 'tourmetoday.co',    
    
if ( $mysqli -> connect_error != 0) {
    echo $mysqli -> connect_error;
    exit();
}

$result = $mysqli -> query (
    "SELECT id, name, image, price, quantity FROM products"
);

while ($row = $result -> fetch_assoc()) {
    $products[] = $row;
}

foreach($products as $product) {
    echo $product['name'];
}


while ($row = $result -> fetch_object()) {
    $products[] = $row;
}

foreach($products as $product) {
    echo $product -> price;
}



?>