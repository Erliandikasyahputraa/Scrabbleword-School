<?php

$url = 'http://localhost:8000/api/auth/register';
$data = array('name' => 'Test User', 'email' => 'test' . time() . '@example.com', 'password' => 'password123', 'password_confirmation' => 'password123', 'role' => 'student');

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    echo "Register failed\n";
} else {
    echo "Register response:\n";
    echo $result . "\n";
}

$login_url = 'http://localhost:8000/api/auth/login';
$login_data = array('email' => $data['email'], 'password' => 'password123');
$login_options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($login_data),
        'ignore_errors' => true // so we can see 422 response
    )
);
$login_context = stream_context_create($login_options);
$login_result = file_get_contents($login_url, false, $login_context);

echo "Login response (should be rejected since pending):\n";
echo $login_result . "\n";
