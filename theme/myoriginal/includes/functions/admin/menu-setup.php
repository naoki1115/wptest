<?php

// ダッシュボード
add_action('wp_dashboard_setup', 'theme_dashboard_widgets');
function theme_dashboard_widgets()
{
  wp_add_dashboard_widget('serverinfo_widget', 'サーバー情報', 'theme_dashboard_widget_serverinfo');
  remove_action('welcome_panel', 'wp_welcome_panel'); // wpへようこそ
  remove_meta_box('dashboard_right_now', 'dashboard', 'normal'); // 概要
  remove_meta_box('dashboard_activity', 'dashboard', 'normal'); // アクティビティ
  remove_meta_box('dashboard_quick_press', 'dashboard', 'side'); // クイックドラフト
  remove_meta_box('dashboard_primary', 'dashboard', 'side'); // WordPressニュース
  remove_meta_box('vk_dashboard_widget', 'dashboard', 'normal'); // vk target news
  remove_meta_box('wpseo-dashboard-overview', 'dashboard', 'normal'); // yoast
}
// ダッシュボードにサーバー情報を表示させる
function theme_dashboard_widget_serverinfo()
{
  global $wpdb;
  $d = array(
    'Domain' => $_SERVER['SERVER_NAME'],
    'php' => phpversion(),
    'MySQL' => mysqli_get_server_info($wpdb->dbh),
    'DOCUMENT_ROOT' => $_SERVER['DOCUMENT_ROOT'],
    'Server IP' => $_SERVER['SERVER_ADDR'],
    'User IP' => $_SERVER['REMOTE_ADDR'],
    'WordPress' => get_bloginfo('version'),
  );
  foreach ($d as $k => $v) {
    $d[$k] = '<li><strong>' . $k . ':</strong> ' . $v . '</li>';
  }
  echo '<ul>' . implode('', $d) . '</ul>';
}
