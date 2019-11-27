<?php
/************************************************************/
# THeme header navigation part
/************************************************************/
?>

<div class="header__inner">
  <div class="header-info">

    <div class="header-info__bar">
      <h1 class="header-info__bar__logo">
        <a href="<?php echo home_url();?>">COMPANY NAME</a>
      </h1>
      <div class="header-info__bar__nav-trugger hidden-md-up">
        <button class="nav-trigger" id="spNavTrigger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <?php if (has_nav_menu('global-navigation')): ?>
    <div class="header-info__nav__wrapper">
      <nav class="header-info__nav">
      <?php
      $args = array(
        'theme_location' => 'global-navigation',
        'menu' => '',
        'menu_class' => 'header-info__nav__list',
        'menu_id' => '',
        'container' => false,
        'container_class' => false,
        'items_wrap' => '<ul class="%2$s">%3$s</ul>'
      );

      wp_nav_menu($args);
      endif;
      ?>
      </nav>
    </div>

  </div><!-- / .header__info -->
</div><!-- / .header__inner -->
