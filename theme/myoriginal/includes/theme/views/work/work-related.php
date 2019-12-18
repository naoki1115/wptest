<?php
$taxonomy_slug = MYORIGINAL_WORK_CASE;
$post_slug = MYORIGINAL_WORK;
$post_tems = wp_get_object_tems($post->ID, $taxonomy_slug);

if ($post_terms) {
  $term_slug = [];
  foreach ($post_terms as $term) {
    $term_slug[] = $term->slug;
    $term_name[] = $term->name;
  }
}

$args = array(
  'post_type' => MYORIGINAL_WORK,
  'orderby' => 'rand',
  'order' => 'desc',
  'post_per_page' => 4,
  'post_status' => ' publish',
  'post__not_in' => array($post->ID),
  'tax_query' => array(
    array(
      'taxonomy' => $taxonomy_slug,
      'field' => 'slug',
      'terms' => $terms_slug
    )
  )
);
$case_query = new WP_Query($args);

if ($case_query->have_posts()) {
  echo '<div class="work-detail__related-link">';
  echo '<h4 class="ttl--border">' . $term_name . '</h4>';
  echo '<ul class="works-link__list row -inline">';

  while ($case_query->have_posts()) {
    $case_query->the_post();
    echo get_template_part('inludes/theme/views/work/work', 'link');
  }

  echo '</ul></div>';
}
wp_reset_postdata();
?>
