<?php
// login.php — Authentication Gateway (Teacher & Admin)

require_once 'config/db.php';

session_start();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $portal = $_POST['portal'] ?? 'teacher';

    if (empty($email) || empty($password)) {
        $error = "Email and password are required.";
    } else {
        if ($portal === 'admin') {
            $adminEmail = 'admin@portal.local';
            $adminPass  = 'admin123';

            if ($email === $adminEmail && $password === $adminPass) {
                $_SESSION['user'] = ['role' => 'Admin', 'email' => $adminEmail, 'name' => 'Administrator'];
                header('Location: admin/dashboard.php');
                exit;
            } else {
                $error = "Invalid admin credentials.";
            }
        } else {
            $stmt = $pdo->prepare("SELECT teacher_id, name, email, password FROM teachers WHERE email = ?");
            $stmt->execute([$email]);
            $teacher = $stmt->fetch();

            if ($teacher && password_verify($password, $teacher['password'])) {
                $_SESSION['user'] = [
                    'id'   => $teacher['teacher_id'],
                    'role' => 'Teacher',
                    'name' => $teacher['name'],
                    'email' => $teacher['email']
                ];
                header('Location: admin/dashboard.php');
                exit;
            } else {
                $error = "Invalid teacher credentials.";
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Management — Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container login-container">
        <header>
            <h1>Portal Login</h1>
            <p class="subtitle">Teacher ESS & Admin Portal</p>
        </header>

        <?php if ($error): ?>
            <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <form action="login.php" method="POST" class="portal-form">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required placeholder="Enter your email">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required placeholder="Enter your password">
            </div>

            <div class="form-group">
                <label>Portal</label>
                <div class="role-group">
                    <label class="radio-label">
                        <input type="radio" name="portal" value="teacher" checked required>
                        <span>Teacher ESS</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="portal" value="admin" required>
                        <span>Admin</span>
                    </label>
                </div>
            </div>

            <button type="submit" class="btn-submit">Login</button>
        </form>

        <div class="auth-links">
            <a href="index.php" class="btn-link">New user? Register</a>
        </div>
    </div>
</body>
</html>
