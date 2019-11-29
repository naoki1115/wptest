<?php
/**
 * 経歴
 */
function get_carrer_content()
{
  $args = array(
    'post_type' => 'carrer',
    'orderby' => '',
    'posts_per_page' => -1,
    'post_status' => 'publish'
  )
}
?>

<section class="about__carrer">
  <h3 class="ttl--line-side">
    <span class="ttl-row">
      <span class="en">CARRER</span>
      <span class="jp">経歴</span>
    </span>
  </h3>
  <div class="carrer__content">

  </div><!-- / .carrer__content -->
</section>
