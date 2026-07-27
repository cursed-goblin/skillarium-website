<?php
// admin/dashboard.php — Admin Control Dashboard

require_once '../config/db.php';

session_start();

if (empty($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['Admin', 'Teacher'])) {
    header('Location: ../login.php');
    exit;
}

$user = $_SESSION['user'];
$isAdmin = ($user['role'] === 'Admin');

$teachers = $pdo->query("SELECT teacher_id, name, email, created_at FROM teachers ORDER BY created_at DESC")->fetchAll();
$students = $pdo->query("SELECT student_id, name, email, created_at FROM students ORDER BY created_at DESC")->fetchAll();
$logs    = $pdo->query("SELECT log_id, log_date, teacher_id, student_id, status FROM activity_logs ORDER BY log_date DESC")->fetchAll();

function getName($id, $list, $col) {
    foreach ($list as $item) {
        if ($item[$col] == $id) return $item['name'];
    }
    return 'N/A';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal — Dashboard</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <div class="container dashboard-container">
        <div class="dashboard-nav">
            <h2>Welcome, <?php echo htmlspecialchars($user['name']); ?> <small>(<?php echo $user['role']; ?>)</small></h2>
            <div class="nav-links">
                <a href="../index.php">Home</a>
                <a href="../logout.php" class="btn-danger">Logout</a>
            </div>
        </div>

        <?php if ($isAdmin): ?>
            <h3 class="section-title">Teachers</h3>
            <table>
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Registered</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($teachers as $t): ?>
                        <tr>
                            <td><?php echo $t['teacher_id']; ?></td>
                            <td><?php echo htmlspecialchars($t['name']); ?></td>
                            <td><?php echo htmlspecialchars($t['email']); ?></td>
                            <td><?php echo $t['created_at']; ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($teachers)): ?>
                        <tr><td colspan="4" style="text-align:center">No teachers registered.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <h3 class="section-title">Students</h3>
            <table>
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Registered</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($students as $s): ?>
                        <tr>
                            <td><?php echo $s['student_id']; ?></td>
                            <td><?php echo htmlspecialchars($s['name']); ?></td>
                            <td><?php echo htmlspecialchars($s['email']); ?></td>
                            <td><?php echo $s['created_at']; ?></td>
                        </tr>
                    <?php endforeach; ?>
                    <?php if (empty($students)): ?>
                        <tr><td colspan="4" style="text-align:center">No students registered.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        <?php endif; ?>

        <h3 class="section-title">Activity Logs</h3>
        <table>
            <thead>
                <tr><th>ID</th><th>Date</th><th>Teacher</th><th>Student</th><th>Status</th></tr>
            </thead>
            <tbody>
                <?php foreach ($logs as $log): ?>
                    <tr>
                        <td><?php echo $log['log_id']; ?></td>
                        <td><?php echo $log['log_date']; ?></td>
                        <td><?php echo getName($log['teacher_id'], $teachers, 'teacher_id'); ?></td>
                        <td><?php echo getName($log['student_id'], $students, 'student_id'); ?></td>
                        <td><?php echo htmlspecialchars($log['status']); ?></td>
                    </tr>
                <?php endforeach; ?>
                <?php if (empty($logs)): ?>
                    <tr><td colspan="5" style="text-align:center">No activity logs.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
