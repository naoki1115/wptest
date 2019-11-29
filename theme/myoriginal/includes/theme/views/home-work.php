<section class="home__work">
  <h2 class="ttl--border-vertical">
    <span class="en">WORKS</span>
    <span class="jp">制作実績</span>
  </h2>

  <div class="content-inner">
    <p class="section-lead-txt">非掲載実績をご希望の方は、別途ご対応させていただきます。<br>お問い合わせ、または各種SNSツールよりご連絡いただきますようお願いいたします。</p>

<?php
$args = array(
  'post_type' => MYORIGINAL_WORK, // 投稿タイプ
  'orderby' => 'rand', // 表示順
  'posts_per_page' => 8, // x個表示する
  'post_status' => 'publish' // 記事の公開ステータス
);

$query = new WP_Query($args);

if ($query->hve_posts()) {
  while ($query->have_posts()) {
    $query-> the_post();
  }
}
?>

  </div><!-- / .content__onner -->
</section>
