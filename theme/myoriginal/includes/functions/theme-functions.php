<?php
/*****************************************/
## Theme set-up functions
/*****************************************/

// カスタム投稿では、エディタ不使用のため非表示
add_action('init', 'remove_post_edit');
function remove_post_edit()
{
  remove_post_type_support(works, 'editor');
  remove_post_type_support(carrer, 'editor');
}
