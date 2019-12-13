<?php
/**
 * 経歴
 * コンテンツ出力
 *
 * @param int $id 投稿ID
 * @param int $number 記事総数
 */
function get_career_content($id, $number)
{
  $html;

  if (!empty($year = get_field('year') && $detail = get_field('detail'))) {

    if ($id === $number) {
      $html = '<li class="career__item -new">';
    } else {
      $html = '<li class="career__item">';
    }

    $html .= '<dl class="career-detail row">';

    $html .= '<dt class="career-detail__year t-serif">';
    $html .= '<span class="year">' . get_field('year') . '</span>';

    if ($id === $number) {
      $html .= '<span class="new">NEW</span>';
    }

    $html .= '</dt>';

    $html .= '<dd class="career-detail__info"><div class="info-line"><span class="info-icon icon-circle-double"></span></div>';
    $html .= '<div class="info-content">';

    $html .= '<h6>' . get_the_title() . '</h6>';
    $html .= '<p>' . $detail . '</p>';

    $html .= '</div></dd></dl>';
    $html .= '</li>';
  }

  return $html;
}
?>

<section class="about__career">
  <h3 class="ttl--line-side">
    <span class="ttl-row">
      <span class="en">CAREER</span>
      <span class="jp">経歴</span>
    </span>
  </h3>

<?php
$args = array(
  'post_type' => 'career',
  'orderby' => 'id',
  'order' => 'ASC',
  'post_per_page' => -1,
  'post_status' => 'publish'
);

$career_query = new WP_Query($args);

if ($career_query->have_posts()) {
  echo '<div class="career__contet"><ul class="career__list">';

  while ($career_query->have_posts()) {
    $number = $career_query->post_count - 2;
    $postid = $career_query->current_post;

    $career_query->the_post();
    echo get_career_content($postid, $number);
  }
  echo '</ul></div>';
}
wp_reset_postdata();
?>

</section>
