<?php
/********************************************/
## ビジュアルエディタ 入出力 - 制御
/********************************************/

// pタグ、brタグの自動挿入を制御する
remove_filter('the_content', 'wpautop');
remove_filter('the_excerpt', 'wpautop');

// 特定文字の自動変換制御
remove_filter('the_content', 'wptexturize');
remove_filter('the_excerpt', 'wptexturize');

// ビジュアルエディタの変換機能を無効化
/**
 * 全てのタグ・全ての属性を許可（空の <span> タグや <div> タグなどが削除されるのを防ぐ）
 * <a> タグに全てのタグを入れられるようにする
 * 自動的に <p> タグで囲われることを防ぐ
 */
add_filter('tiny_mce_before_init', 'override_mce_options');
function override_mce_options($init_array)
{
  global $allowedposttags;
  $init_array['valid_elements'] = '*[*]';
  $init_array['extended_valid_elements'] = '*[*]';
  $init_array['valid_children'] = '+a[' . implode('|', array_keys($allowedposttags)) . ']';
  $init_array['indent'] = true;
  $init_array['wpautop'] = false;
  $init_array['force_p_newlines'] = false;
  return $init_array;
}
