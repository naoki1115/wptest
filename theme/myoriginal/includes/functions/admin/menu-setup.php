<?php
/**
 * 管理画面 設定
 */

// フッターテキスト削除
add_filter('admin_footer_text', '__return_empty_string');

/**
 * ダッシュボード表示設定
 */
add_action('wp_dashboard_setup', 'myoriginal_dashboard_widgets');
function myoriginal_dashboard_widgets()
{
  // 表示する
  wp_add_dashboard_widget('serverinfo_widget', 'サーバー情報', 'myoriginal_dashboard_widget_serverinfo');

  // 非表示にする
  remove_meta_box('dashboard_right_now', 'dashboard', 'normal'); // 概要
  remove_meta_box('dashboard_activity', 'dashboard', 'normal'); // アクティビティ
  remove_meta_box('dashboard_quick_press', 'dashboard', 'side'); // クイックドラフト
  remove_meta_box('dashboard_primary', 'dashboard', 'side'); // WordPressニュース
  remove_meta_box('vk_dashboard_widget', 'dashboard', 'normal'); // vk target news
  remove_meta_box('wpseo-dashboard-overview', 'dashboard', 'normal'); // yoast
}

// ダッシュボードにサーバー情報を表示する
function myoriginal_dashboard_widget_serverinfo()
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

/**
 * ダッシュボードサイドメニューの項目整理
 */
add_filter('custom_menu_order', 'myoriginal_custom_menu_order');
add_filter('menu_order', 'myoriginal_custom_menu_order');
function myoriginal_custom_menu_order($menu_ord)
{
  if (!$menu_ord) {
    return true;
  }

  return array(
    'index.php', // ダッシュボード
    'separator1', // 区切り線1
    'edit.php?post_type=work', // 実績カスタム投稿
    'edit.php?post_type=career', // 経歴カスタム投稿
    'edit.php?post_type=page', // 固定ページ
    'separator2', // 区切り線2
    'upload.php', // メディア
    'users.php', // ユーザー
    'separator-last', // 区切り線3
    'themes.php', // 外観
    'plugins.php', // プラグイン
    'tools.php', // ツール
    'options-general.php' // 設定
  );
}

/**
 * サイドナビゲーションから項目を非表示にする
 */
add_action('admin_menu', 'myoriginal_remove_side_menus');
function myoriginal_remove_side_menus()
{
  remove_menu_page('edit.php'); // 投稿
  remove_menu_page('edit-comments.php'); // コメント
  remove_filter('update_footer', 'core_update_footer'); // 画面下に表示されているバージョン
}

/**
 * サイドナビゲーションアイコン
 */
add_action('admin_print_styles', 'myoriginal_dashbord_icons');
function myoriginal_dashbord_icons()
{
  ?>
    <style>
    #menu-posts-work .dashicons-admin-post:before { content: '\f330' !important; }
    #menu-posts-career .dashicons-admin-post:before { content: '\f483' !important; }
    </style>
  <?php
}

/**
 * カスタム投稿 エディタ非表示
 */
add_action('init', 'myoriginal_remove_post_support');
function myoriginal_remove_post_support()
{
  remove_post_type_support(MYORIGINAL_WORK, 'editor');
  remove_post_type_support(MYORIGINAL_CAREER, 'editor');
}

/**
 * カスタム投稿一覧にサムネイルを表示
 */
add_filter('manage_posts_columns', 'recipe_add_posts_columns');
add_action('manage_posts_custom_column', 'recipe_add_posts_columns_row', 10, 2);
function recipe_add_posts_columns($columns) {
  $columns['thumbnail'] = 'イメージ';
  return $columns;
}
function recipe_add_posts_columns_row($column_name, $post_id) {
  if ('thumbnail' == $column_name) {
    $thumb = get_the_post_thumbnail($post_id, array(100,100), 'thumbnail');
    echo ( $thumb ) ? $thumb : '－';
  }
}


