<?php
function errorResponse($e) {
    return json_encode([
        'status' => 'error'
        'error' => $e
    ]);
}
?>