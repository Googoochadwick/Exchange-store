<?php 

include 'connect.php';

if(isset($_POST['signUp'])){
    $firstnam=$_POST['fName'];
    $lastnam=$_POST['lName'];
    $email=$_POST['email'];
    $passwd=$_POST['password'];
    $passwd=md5($passwd);
    $mobile=$_POST['mnum'];
    $registration=$_POST['reg'];
    $accommodation=$_POST['acom'];
    $major=$_POST['maj'];

     $checkEmail="SELECT * From users where email='$email'";
     $result=$conn->query($checkEmail);
     if($result->num_rows>0){
        echo "Email Address Already Exists !";
     }
     else{
        $insertQuery="INSERT INTO users(firstnam,lastnam,email,passwd,mobile,registration,accommodation,major)
                       VALUES ('$firstnam','$lastnam','$email','$passwd','$mobile','$registration','$accommodation','$major')";
            if($conn->query($insertQuery)==TRUE){
                header("location: index.php");
            }
            else{
                echo "Error:".$conn->error;
            }
     }
   

}

if(isset($_POST['signIn'])){
   $email=$_POST['email'];
   $password=$_POST['password'];
   $password=md5($password) ;
   
   $sql="SELECT * FROM users WHERE email='$email' and passwd='$password'";
   $result=$conn->query($sql);
   if($result->num_rows>0){
    session_start();
    $row=$result->fetch_assoc();
    $_SESSION['email']=$row['email'];
    header("Location:  home-index.php");
    exit();
   }
   else{
    echo "Not Found, Incorrect Email or Password";
   }

}
?>