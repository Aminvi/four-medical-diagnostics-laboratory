<?php

if($_SERVER["REQUEST_METHOD"] == "POST"){

    $name    = htmlspecialchars($_POST["text-648"]);
    $email   = htmlspecialchars($_POST["email-571"]);
    $phone   = htmlspecialchars($_POST["number-900"]);
    $subject = htmlspecialchars($_POST["text-777"]);
    $message = htmlspecialchars($_POST["textarea-941"]);

    $to = "Fourstarmedicaldiagnostics@gmail.com";

    $fullMessage = "
    New Contact Form Submission

    Name: $name
    Email: $email
    Phone: $phone
    Subject: $subject

    Message:
    $message
    ";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    if(mail($to, $subject, $fullMessage, $headers)){
        echo "<script>alert('Message sent successfully'); window.history.back();</script>";
    } else {
        echo "<script>alert('Message failed to send'); window.history.back();</script>";
    }
}
?>