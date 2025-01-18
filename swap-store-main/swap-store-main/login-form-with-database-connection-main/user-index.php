<?php
session_start();
include("connect.php");


$firstName = "John";
$lastName = "Doe";
$registrationNumber = "ST12345";
$mobileNumber = "+1 (555) 123-4567";
$accommodation = "On-campus Dormitory";
$email = "john.doe@example.com";
$major = "Computer Science";
$yearOfStudy = "3rd Year";


if (isset($_SESSION['email'])) {
    $email = $_SESSION['email'];
    
    
    $query = mysqli_query($conn, "SELECT * FROM `users` WHERE email='$email'");
    
    
    if ($row = mysqli_fetch_assoc($query)) {
        $firstName = $row['firstnam'];
        $lastName = $row['lastnam'];
        $registrationNumber = $row['registration'];
        $mobileNumber = $row['mobile'];
        $accommodation = $row['accommodation'];
        $email = $row['email'];
        $major = $row['major'];
        
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
    <link rel="stylesheet" href="profile-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</head>
<body>
    <div class="container">
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-img">
                    <img src="https://via.placeholder.com/150" alt="Profile Picture">
                </div>
                <h1 class="profile-name"><?php echo $firstName . ' ' . $lastName; ?></h1>
                <p class="profile-title">Student</p>
            </div>
            <div class="profile-body">
                <div class="info-group">
                    <i class="fas fa-id-card"></i>
                    <span>Registration Number:</span>
                    <p><?php echo $registrationNumber; ?></p>
                </div>
                <div class="info-group">
                    <i class="fas fa-phone"></i>
                    <span>Mobile Number:</span>
                    <p><?php echo $mobileNumber; ?></p>
                </div>
                <div class="info-group">
                    <i class="fas fa-home"></i>
                    <span>Accommodation:</span>
                    <p><?php echo $accommodation; ?></p>
                </div>
                <div class="info-group">
                    <i class="fas fa-envelope"></i>
                    <span>Email:</span>
                    <p><?php echo $email; ?></p>
                </div>
                <div class="info-group">
                    <i class="fas fa-graduation-cap"></i>
                    <span>Major:</span>
                    <p><?php echo $major; ?></p>
                </div>
            </div>

        </div>
    </div>
    <script src="profile-script.js"></script>
</body>
</html>
