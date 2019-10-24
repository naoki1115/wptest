<?php
/******************************************/
## File Name: functions.php
## Description: Core functions file of theme.
/******************************************/


/*********************************************************/
## theme define
/**********************************************************/
define('THEME_INC_DIR', get_template_directory() . '/includes');

define('THEME_CSS_URL', get_template_directory_uri() . '/assets/css');
define('THEME_JS_URL', get_template_directory_uri(). '/assets/js');
define('THEME_IMG_URL', get_template_directory_uri(). '/assets/img');

/*********************************************************/
## theme functions files
/**********************************************************/
require_once THEME_INC_DIR . '/functions/custom-post-type.php';
require_once THEME_INC_DIR . '/functions/theme-functions.php';
require_once THEME_INC_DIR . '/functions/navigations.php';

/**
 * 下記の設定をまとめて after_setup_theme アクションフック
 */
add_action('after_setup_theme', 'theme_setup');
function theme_setup() {
  // 投稿のサムネイル
  add_theme_support('post-thumbnails');

  // 画像サイズセット

  // css, js ファイルの読み込み
  // filter 第3引数はorder 初期値10 第4引数は取得する引数の数
  add_action('wp_enque_scripts', 'theme_enque_styles');
  add_filter('style_loader_tag', 'custom_style_tag', 10);
  add_action('wp_enque_scripts', 'theme_enque_scripts');
  add_filter('script_loader_tag', 'custom_script_tag', 10, 3);

  // 不要な機能を削除・非表示
  remove_action('wp_head', 'wp_generator');
  remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10);
  remove_action('wp_head', 'rest_output_link_wp_head');
  remove_action('wp_head', 'wlwmanifest_link');
  remove_action('wp_head', 'rsd_link');
  remove_action('wp_head', 'wp_shortlink_wp_head');
  remove_action('wp_head', 'wp_oembed_add_discovery_links');
  remove_action('wp_head', 'wp_oembed_add_host_js');
  remove_action('template_redirect', 'rest_output_link_header', 11);
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('wp_print_styles', 'print_emoji_styles');
  add_filter('emoji_svg_url', '__return_false');
  add_filter('comments_open', '__return_false');
  // yoast seo plugin
  add_filter('wpseo_next_rel_link', '__return_false');
  add_filter('wpseo_prev_rel_link', '__return_false');

  // 拡張
  add_action('wp_head', extend_wp_head);
  add_action('wp_footer', extend_wp_footer);
}

/**********************************************/
## Attach stylesheets
/**********************************************/
function theme_enque_styles() {
  // 不要cssの削除
  wp_dequeue_style('wp-block-library');


}

/**
 * CSS読み込みタグから余分な箇所を削除
 *
 * @param string $tag
 * @return string 余分な箇所を削除したタグ
 */
function custom_style_tag($tag) {
  return preg_replace(array("| type='.+?'s*|", "| id='.+?'s*|", '| />|'), array(' ', ' ', '>'), $tag);
}

/*******************************************/
## Attach theme javascripts
/*******************************************/
function theme_enque_scripts() {
  wp_deregister_script('jquery');
  wp_deregister_script('jquery-migrate');
}


/**
 * JS読み込みタグから余分な箇所を削除 + 一部async追加
 *
 * @param string $tag タグ
 * @param string $handle register ハンドル
 * @param string $src URL
 * @return string 変換したタグ
 */
function custom_script_tag($tag, $handle, $src) {
  return str_replace("type='text/javascript' ", '', $tag);
}


/*******************************************/
## theme extends
/*******************************************/

/**
 * wp_head拡張
 */
function extend_wp_head() {
  $inline_css = '';
  if (is_user_logged_in()) {
    $inline_css .= <<< EOF
@media screen and (min-width: 783px) {
  .admin-bar header { top: 32px !important; }
  .admin-bar .content-wrapper { padding-top: 118px; }
  .admin-bar.english .content-wrapper { padding-top: 128px; }
}
@media screen and (min-width: 992px) {
  .admin-bar .content-wrapper { padding-top: 129px; }
  .admin-bar.english .content-wrapper { padding-top: 148px; }
}
@media screen and (max-width: 782px) {
  html #wpadminbar { display: none !important; }
}
EOF;
  }
  if (is_user_logged_in()) {
    $inline_css .= <<< EOF
#wpadminbar {
  background: #0f3c81;
}
EOF;
  }
  if ($inline_css) {
    echo '<style type="text/css">' . $inline_css . '</style>';
  }
}
/**
 * wp_footer拡張
 */
function extend_wp_footer() {

}

function custom_login_message() {
  $message = '<h2 style="text-align:center; margin-bottom:20px;">This is a myoriginal-wp-site</h2>';
  return $message;
}
add_filter('login_message', 'custom_login_message');


/*********************************************************/
## theme admin functions
/**********************************************************/
if (is_admin()) {
  require_once THEME_INC_DIR . '/functions/admin-functions.php';
}
