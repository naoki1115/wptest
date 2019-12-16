<section class="home__work">
  <h2 class="ttl--border-vertical">
    <span class="en">WORKS</span>
    <span class="jp">制作実績</span>
  </h2>

  <div class="content-inner">
    <p class="section-lead-txt">非掲載実績をご希望の方は、別途ご対応させていただきます。<br>お問い合わせ、または各種SNSツールよりご連絡いただきますようお願いいたします。</p>

<?php
$args = array(
  'post_type' => MYORIGINAL_WORK,
  'orderby' => 'rand',
  'order' => 'desc',
  'post_per_page' => 6,
  'post_status' => 'publish'
);
$works_query = new WP_Query($args);

if ($works_query->have_posts()) {
  // 公開サれている記事の数を取得
  $count = wp_count_posts();
  $work_posts = $count->publish;

  echo '<div class="home__works-link__wrapper"><ul class="works-link__list row -inline">';
  while ($works_query->have_posts()) {
    $works_query->the_post();

    echo get_template_part('includes/theme/views/work/work', 'link');
  }
  echo '</ul>';

  if ($wrok_posts > 6) {
    echo '<div class="btn-container">';
    echo '<a class="btn -primary" href="' . home_url('/works') . '">view more</a>';
    echo '</div>';
  }

  echo '</div>'; // END home__works-link__wrapper
}
wp_reset_postdata();
?>

  </div><!-- / .content__onner -->
</section>
