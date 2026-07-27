<?php
// submit.php — Process Registration Form

require_once 'config/db.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$name  = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$role  = $_POST['role'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($name) || empty($email) || empty($role)) {
    die("All fields except password are required.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email format.");
}

try {
    if ($role === 'Teacher') {
        if (empty($password)) {
            die("Password is required for Teacher registration.");
        }
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $hash]);
    } elseif ($role === 'Student') {
        $stmt = $pdo->prepare("INSERT INTO students (name, email) VALUES (?, ?)");
        $stmt->execute([$name, $email]);
    } else {
        die("Invalid role selected.");
    }

    $table = ($role === 'Teacher') ? 'teachers' : 'students';
    $idCol = ($role === 'Teacher') ? 'teacher_id' : 'student_id';
    $stmt = $pdo->prepare("SELECT $idCol FROM $table WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    $teacherId = ($role === 'Teacher') ? $user['teacher_id'] : null;
    $studentId = ($role === 'Student') ? $user['student_id'] : null;

    $stmt = $pdo->prepare("INSERT INTO activity_logs (log_date, teacher_id, student_id, status) VALUES (CURDATE(), ?, ?, 'Registered')");
    $stmt->execute([$teacherId, $studentId]);

    header('Location: index.php?success=1');
    exit;

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        die("Email already registered.");
    }
    error_log("Registration error: " . $e->getMessage());
    die("An error occurred during registration. Please try again later.");
}
