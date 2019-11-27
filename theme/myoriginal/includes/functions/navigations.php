<?php
/********************************************/
## theme navigation register
/********************************************/

// カスタムメニューを有効化
add_theme_support('menus');

/**
 * カスタムメニュー
 */
add_action('after_setup_theme', 'myoriginal_navigation_register');
function myoriginal_navigation_register() {
  register_nav_menu('global-navigation', 'グローバルナビゲーション');
}
