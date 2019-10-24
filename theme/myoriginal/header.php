<?php
/******************************************/
## theme header.php
/******************************************/
?>

<!DOCTYPE html>
<html lang="<?php bloginfo('language'); ?>">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="format-detection" content="telephone=no">
  <title><?php bloginfo('name')?></title>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?> id="siteBody">
  <div class="site-wrapper">
    <header class="header" id="siteHeader">
      <div class="header__inner">

        <div class='header__info'>
          <h1 class="header__logo">
            <a href=<?php echo home_url(); ?>>WP Test Site</a>
          </h1>
          <div class="header__nav__trigger">
            <button id="spNavTrigger">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
        <!-- header__info -->

        <div class="header__nav__wrapper">
          <nav class="header__nav">
            <?php
            $args = array(
              'theme_location' => 'global-navigation',
              'menu' => '',
              'menu_class' => 'header__nav__list',
              'menu_id' => '',
              'container' => false,
              'container_class' => '',
              'items_wrap' => '<ul class="%2$s">%3$s</ul>'
            );
            wp_nav_menu($args);
            ?>
          </nav>
        </div>

      </div>
      <!-- header_inner -->
    </header>