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
        <?php get_template_part('includes/theme/views/works/work', 'navigation'); ?>
      </div>

    </div>
  </article>
</main>

<?php
get_footer();
