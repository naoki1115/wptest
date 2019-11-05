<?php

add_action('init', 'register_custom_posts');
function register_custom_posts() {
  // 実績
  register_post_type(
    works,
    array(
      'labels' => array(
        'name' => __('制作実績'),
        'singular_name' => __('制作実績'),
        'add_new' => __('制作実績を追加'),
        'add_new_item' => __('制作実績を追加'),
        'edit_item' => __('制作実績を編集'),
        'view_item' => __('制作実績を表示'),
        'search_items' => __('制作実績を探す'),
        'not_found' => __('制作実績はありません'),
        'not_found_in_trash' => __('ゴミ箱に制作実績はありません'),
        'all_items' => __('制作実績一覧')
      ),
      'has_archive' => true,
      'public' => true,
      'show_ui' => true
    )
  );

  // ニュースカテゴリー
  register_taxonomy(
    works_cate,
    works,
    array(
      'label' => '実績カテゴリー',
      'public' => true,
      'show_admin_column' => true,
      'show_ui' => true,
      'hierarchical' => true,
    )
  );

  // 経歴
  register_post_type(
    carrer,
    array(
      'labels' => array(
        'name' => __('経歴'),
        'singular_name' => __('経歴'),
        'add_new' => __('経歴を追加'),
        'add_new_item' => __('経歴を追加'),
        'edit_item' => __('経歴を編集'),
        'view_item' => __('経歴を表示'),
        'search_items' => __('経歴を探す'),
        'not_found' => __('経歴はありません'),
        'not_found_in_trash' => __('ゴミ箱に経歴はありません'),
        'all_items' => __('経歴一覧')
      ),
      'has_archive' => false,
      'public' => false,
      'show_ui' => true,
    )
  );
}
