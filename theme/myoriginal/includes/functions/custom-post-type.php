<?php

/**
 * カスタム投稿
 */
add_action('init', 'myoriginal_register_custom_posts');
function myoriginal_register_custom_posts() {
  // 実績
  register_post_type(
    MYORIGINAL_WORK,
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
      'show_ui' => true,
      'supports' => array(
        'title', 'thumbnail'
      ),
      'rewrite' => array(
        'with_front' => false
      )
    )
  );

  // 経歴
  register_post_type(
    MYORIGINAL_CAREER,
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

/**
 * タクソノミー
 */
add_action('init', 'myoriginal_work_taxonomy');
function myoriginal_work_taxonomy()
{
  // 実績カテゴリ
  register_taxonomy(
    MYORIGINAL_WORK_CASE,
    MYORIGINAL_WORK,
    array(
      'labels' => array(
        'name' => __('実績カテゴリ'),
        'singular_name' => __('実績カテゴリ'),
        'all_items' => __('実績カテゴリ一覧'),
        'edit_item' => __('実績カテゴリを編集'),
        'view_item' => __('実績カテゴリを表示'),
        'parent_item' => null,
        'parentitem_colon' => null
      ),
      'public' => true,
      'show_admin_column' => true,
      'show_ui' => true,
      'hierarchical' => false,
      'rewrite' => array(
        'slug' => MYORIGINAL_WORK,
      )
    )
  );
}
