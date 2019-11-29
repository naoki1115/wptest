<?php
/**********************************************/
## Custom Post functions
/**********************************************/

/**
 * 実績アーカイブ １つ出力
 *
 * @param integer $col item-column-width
 * @return string $html htmlcode
 */
// function get_work_link($col)
// {
//   switch ($col) {
//     case 3:
//       $html = '<li class="works-link__item col-md-4 col-sm-6 col-12">';
//       continue;
//     case 4:
//       $html = '<li class="works-link__item col-md-3 col-sm-6 col-12">';
//       continue;
//   }

//   $html .= '<a class="works-link" href="' . get_permalink(get_the_ID()) . '">';
//   $html .= get_work_link_thumbnail();
//   $html .= get_work_link_info();
//   $html .= '</a></li>';
// }

/**
 * 実績アーカイブ サムネイル取得
 *
 * @param string $before htmltag
 * @param string $after htmltag
 * @param integer $id postID
 * @param string $size thumbnail size
 * @return string $html htmlcode
 */
function get_work_link_thumbnail($before = '', $after = '', $id = 0, $size = 'full')
{
  if (has_post_thumbnail($id)) {
    $html = '<div class="work-link__thumbnail">';
    $html .= get_the_post_thumbnail($id, $size);
    $html .= '</div>';
  }
}

/**
 * 実績アーカイブ 情報取得
 *
 * @param integer $id postID
 * @return string $html htmlcode
 */
function get_work_link_info($id = 0)
{
  if ($post) {
    $html = '<div class="work-link__info">';
    $html .= '<span class="info-company">' . get_field('client', $id) . '</span>';
    $html .= '<h4 class="info-ttl">' . get_title($id) . '</h4>';
    $html .= '</div>';
  }
}

