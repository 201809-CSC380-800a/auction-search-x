<?php
$servername = "localhost";
$username = "root";
$password = "Bosman23%";
$dbName = "customers";
$port = 3306;

$conn = new mysqli($servername, $username, $password, $dbName, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query($_REQUEST['sql']);
$ret = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $ret[] = $row;
    }
}
echo json_encode($ret);
$conn->close();
?>