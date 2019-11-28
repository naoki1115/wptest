<?php
/******************************************/
## theme front-page.php
/******************************************/
get_header();
?>

<main class="">
  <div class="mv__wrapper">
    <div class="mv__inner">
      <div class="mv">
        <h2 class="mv__ttl">Hello World.</h2>
        <p class="mv__lead">
          <span>Thank you for visiting my website :)</span>
          <span>I’m NAOKI working as a WEB Creator.</span>
          <span>I like creating website and interesting thing.</span>
        </p>
      </div>
      <div class="mv__scroll-sign">
        <span class="t-italic">SCROLL</span>
      </div>
    </div>
  </div><!-- / .mv__wrapper -->

  <article class="content-wrapper">
    <?php
    get_template_part('includes/theme/views/home', 'about');
    get_template_part('includes/theme/views/home', 'work');
    get_template_part('includes/theme/views/home', 'contact');
    ?>
  </article>
</main>

<?php
get_footer();
