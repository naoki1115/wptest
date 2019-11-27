<?php
/******************************************/
## theme header.php
/******************************************/
?>
<!doctype html>
<html <?php language_attributes();?> prefix="og: http://ogp.me/ns#">
  <head>
    <meta charset="<?php bloginfo('charset');?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <?php wp_head();?>
  </head>

  <body <?php body_class();?> id="siteBody">
    <div class="site-wrapper" id="siteWrapper">
      <div class="site-line -line--01"></div>
      <div class="site-line -line--02"></div>
      <div class="site-line -line--03"></div>
      <div class="site-line -line--04"></div>
      <div class="site-line -line--05"></div>

      <header class="header" id="siteHeader">
        <?php get_template_part('includes/theme/header/global', 'navigation');?>
      </header>

