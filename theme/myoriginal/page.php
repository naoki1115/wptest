<?php
/******************************************/
## theme page.php
/******************************************/
get_header();
?>

<main class="<?php get_page_main_class();?>">
<?php the_content();?>
</main>

<?php
get_footer();
