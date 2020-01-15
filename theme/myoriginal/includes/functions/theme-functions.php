<?php
/*****************************************/
## Theme set up functions
/*****************************************/

/**
 * 下記の設定をまとめてaster_setup_theme アクションフック
 */
add_action('after_setup_theme', 'myoriginal_setup');
function myoriginal_setup()
{
// 投稿のアタッチメント画像機能の有効化
  add_theme_support('post-thumbnails');

  // 画像サイズセット
  add_image_size('work-thumbnail', 800, '100%', false);

  // css, js読み込み
  add_action('wp_enqueue_scripts', 'myoriginal_styles');
  add_filter('style_loader_tag', 'custom_style_tag', 10);
  add_action('wp_enqueue_scripts', 'myoriginal_scripts');
  add_filter('script_loader_tag', 'custom_script_tag', 10, 3);

  // 不要な機能を無効化
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
  add_filter('wpseo_next_rel_link', '__return_false');
  add_filter('wpseo_prev_rel_link', '__return_false');

  // 拡張
  add_action('wp_head', 'extend_wp_head');
  // add_action('wp_footer', 'extend_wp_footer');
  add_filter('body_class', 'extend_body_class');

  // 拡張 - 管理系
  add_action('admin_head', 'extend_admin_head');
  add_action('admin_bar_menu', 'admin_bar_remove_item', 1000);
}

/**********************************************/
## Attach stylesheets
/**********************************************/
function myoriginal_styles()
{
  wp_deregister_style('wp-block-library');

  // main style
  $v = date('YmdHis', filemtime(get_template_directory() . '/assets/css/styles.min.css'));
  wp_register_style('myoriginal-style', MYORIGINAL_CSS_URL . '/styles.min.css', array(), $v, 'all');

  wp_enqueue_style('myoriginal-style');
}

/**
 * CSS読み込みタグから余分な箇所を削除
 * CSS読み込みタグからtyoe, idを削除する
 *
 * @param string $tag
 * @return string 余分な箇所を削除したタグ
 */
function custom_style_tag($tag)
{
  return preg_replace(array("| type='.+?'s*|", "| id='.+?'s*|", '| />|'), array(' ', ' ', '>'), $tag);
}

/*******************************************/
## Attach theme javascripts
/*******************************************/
function myoriginal_scripts()
{
  $plugins = array(
    'jquery'
  );

  $v = date('YmdHis', filemtime(get_template_directory() . '/assets/js/polyfill.min.js'));
  wp_register_script('myoriginal-polyfill', MYORIGINAL_JS_URL . '/polyfill.min.js', array(), $v, false);

  $v = date('YmdHis', filemtime(get_template_directory() . '/assets/js/scripts.min.js'));
  wp_register_script('myoriginal-scripts', MYORIGINAL_JS_URL . '/scripts.min.js', $plugins, $v, true);

  wp_enqueue_script('myoriginal-polyfill');
  wp_enqueue_script('myoriginal-scripts');

  if (!is_admin()) {
    wp_deregister_script('jquery');
    wp_deregister_script('jquery-migrate');
    wp_enqueue_script('jquery', MYORIGINAL_JS_URL . '/plugins/jquery.min.js', array(), '1.12.4', false);
    wp_enqueue_script('jquery-migrate', MYORIGINAL_JS_URL . '/plugins/jquery-migrate.min.js', array('jquery'), '1.4.1', false);
  }
}

/**
 * JS読み込みタグから余分な箇所を削除 + 一部async追加
 *
 * @param string $tag タグ
 * @param string $handle register ハンドル
 * @param string $src URL
 * @return string 変換したタグ
 */
function custom_script_tag($tag, $handle, $src)
{
  // if ('seishin-scripts' !== $handle) {
  return str_replace("type='text/javascript' ", '', $tag);
  // }
  // return '<script src="' . $src . '" async></script>';
}

/*******************************************/
## extends
/*******************************************/
/**
 * bodyクラス拡張
 *
 * @param array $wp_classes
 * @return array $wp_classes
 */

function extend_body_class($wp_classes)
{
  // 共通
  if (!is_home()) {
    $wp_classes[] = 'content';
  }

  if (wp_is_mobile()) {
    $wp_classes[] = 'mobile';
  }

  return $wp_classes;
}

/**
 * wp_head拡張
 */
function extend_wp_head()
{
  if (is_user_logged_in()) {
    $inline_css .= <<< EOF
#wpadminbar {
  background: #0000cd;
}
#wp-admin-bar-new-post {
  display:none;
}
@media screen and (max-width: 782px) {
  html { margin-top: 0 !important; }
  html #wpadminbar { display: none !important; }
}
@media screen and (min-width: 783px) {
  .admin-bar header { top: 32px !important; }
  .admin-bar .content-wrapper { padding-top: 118px; }
  .admin-bar { margin-top: 32px !important; }
}
EOF;
  }

  if ($inline_css) {
    echo '<style type="text/css">' . $inline_css . '</style>';
  }
}

/*******************************************/
## Admin
/*******************************************/
function extend_admin_head()
{
  $inline_css = '';
  if (is_user_logged_in()) {
    $inline_css .= <<< EOF
#adminmenu, #adminmenu .wp-submenu, #adminmenuback, #adminmenuwrap {
  background: #0000cd;
  }
#wpadminbar {
  background: #0000cd;
  }
#adminmenu .wp-has-current-submenu .wp-submenu, #adminmenu .wp-has-current-submenu .wp-submenu.sub-open, #adminmenu .wp-has-current-submenu.opensub .wp-submenu, #adminmenu a.wp-has-current-submenu:focus+.wp-submenu, .no-js li.wp-has-current-submenu:hover .wp-submenu {
  background: rgba(255,255,255, .1);
  }
EOF;
  }

  if ($inline_css) {
    echo '<style type="text/css">' . $inline_css . '</style>';
  }
}

/**
 * 管理バー整理
 *
 * @param Object $wp_admin_bar
 */
function admin_bar_remove_item($wp_admin_bar)
{
  $wp_admin_bar->remove_node('wp-logo');
  $wp_admin_bar->remove_node('customize');
  $wp_admin_bar->remove_node('updates');
  $wp_admin_bar->remove_node('wpseo-menu');
  $wp_admin_bar->remove_node('search');
  $wp_admin_bar->remove_node('comments');

  $my_account = $wp_admin_bar->get_node('my-account');
  $searchword = array('こんにちは、', ' さん');
  $newtitle = str_replace($searchword, '', $my_account->title);
  $wp_admin_bar->add_node(array(
    'id' => 'my-account',
    'title' => $newtitle,
  ));
}

function remove_admin_login_header()
{
  remove_action('wp_head', '_admin_bar_bump_cb');
}
add_action('get_header', 'remove_admin_login_header');
