<?php
// index.php — Landing & Registration Portal
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Management — Registration</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Portal Management System</h1>
            <p class="subtitle">Teacher & Student Registration</p>
        </header>

        <?php if (!empty($_GET['success'])): ?>
            <div class="alert alert-success">Registration successful. You can log in now.</div>
        <?php endif; ?>

        <form action="submit.php" method="POST" class="portal-form">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required maxlength="100" placeholder="Enter your full name">
            </div>

            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required maxlength="100" placeholder="Enter your email">
            </div>

            <div class="form-group">
                <label>System Role</label>
                <div class="role-group">
                    <label class="radio-label">
                        <input type="radio" name="role" value="Teacher" required>
                        <span>Teacher</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="role" value="Student" required>
                        <span>Student</span>
                    </label>
                </div>
            </div>

            <div class="form-group" id="password-group">
                <label for="password">Password <small>(Teachers only)</small></label>
                <input type="password" id="password" name="password" maxlength="255" placeholder="Min 8 characters">
            </div>

            <button type="submit" class="btn-submit">Register</button>
        </form>

        <div class="auth-links">
            <a href="login.php" class="btn-link">Existing User? Login</a>
        </div>
    </div>
</body>
</html>
