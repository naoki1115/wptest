<?php

function register_custom_posts() {
  // 実績
  register_post_type(
    works,
    array(
      'label' => '制作実績',
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
}

add_action('init', 'register_custom_posts');