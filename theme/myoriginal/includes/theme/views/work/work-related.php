
<?php
$taxonomy_slug = MYORIGINAL_WORK_CASE;
$post_slug = MYORIGINAL_WORK;
$post_terms = wp_get_object_terms($post->ID, $taxonomy_slug);

if ($post_terms) {
  $terms_slug = array();
  $terms_name = array();
  foreach ($post_terms as $term) {
    $terms_slug[] = $term->slug;
    $terms_name[] = $term->name;
  }
}

$args = array(
  'post_type' => $post_slug,
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

// var_dump($case_query);

if ($case_query->have_posts()) {
  echo '<div class="work-detail__related-link">';
  echo '<h4 class="ttl--border">その他の制作実績</h4>';
  echo '<ul class="works-link__list row -inline">';

  while ($case_query->have_posts()) {
    $case_query->the_post();
    echo get_work_link(3, 6, 12);
  }

  echo '</ul></div>';
}
wp_reset_postdata();
?>
