<?php
/********************************************/
## theme navigation register
/********************************************/

// カスタムメニューを有効化
add_theme_support('menus');

add_action('after_setup_theme', 'theme_navigation_register');

function theme_navigation_register() {
  register_nav_menu('global-navigation', 'グローバルナビゲーション');
}