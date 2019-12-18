<?php
/**
 * work リンクコンテンツ出力
 *
 * @param int $pc, $md, $sm bootstrap col
 */
if (is_home()) {
  get_work_link(3, 6, 12);
}

function get_work_link($pc, $md, $sm)
{
  printf('<li class="work-link__item col-md-%1$s col-sm-%2$s col-%3$s">', $pc, $md, $sm);
  echo '<a href="' . get_permalink() . '">';
  echo get_work_link_thumbnail();
  echo get_work_link_info();
  echo '</a></li>';
}
