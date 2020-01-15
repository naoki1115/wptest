<?php
/******************************************/
## MYORIGINAL theme archive.php
## 実績アーカイブ
/******************************************/
get_header();
?>

<main class="page-child page-works page-works-archive">
  <div class="page-ttl-head">
    <h2><span class="en">WORKS</span><span class="jp">制作実績</span></h2>
  </div>
  <article class="content-wrapper">
    <div class="content-inner">
      <h3 class="ttl--line-side">
        <span class="ttl-row">
          <span class="en">WEB DESIGN</span>
          <span class="ja">webデザイン</span>
        </span>
      </h3>

      <div class="works__content row -reverse">
<?php
$args = array(
  'post_type' => MYORIGINAL_WORK,
  'orderby' => 'rand',
  'order' => 'desc',
  'post_per_page' => -1,
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
    echo get_work_link(3, 6, 12);
  }
  echo '</ul></div>';
}
wp_reset_postdata();
?>

<?php get_template_part('includes/theme/views/work/work', 'navigation'); ?>
      </div>

    </div>
  </article>
</main>

<?php
get_footer();
