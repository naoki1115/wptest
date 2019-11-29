<?php
/**********************************************/
## Custom functions
/**********************************************/

/**
 * themeフォルダの画像パスを短くする
 *
 */
add_action('the_content', 'myoriginal_replace_imgpath');
function myoriginal_replace_imgpath($arg) {
  $content = str_replace( '"assets/img', '"' . get_template_directory_uri() . '/assets/img/', $arg );
  return $content;
}

/**
 * main クラスを付与する
 *
 * @return string
 */
function get_page_main_class()
{
  global $post;
  $parent = $post->post_parent;

  // 親ページがあればループ
  if ($parent) {
    while ($parent) {
      $page = get_post($post);

      // ページのslugを取得する
      $result[] = $page->post_name;
      $parent = $page->post_parent;
    }
    $result = array_reverse($result);

    echo $result;
  }

  // 取得したスラッグを配列に格納する
  // $result[] = $post->post_name;

  // $classes = [];
  // foreach ($result as $r) {
  //   if ($r === re)
  // }
}


