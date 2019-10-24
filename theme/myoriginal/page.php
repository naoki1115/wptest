<?php
/******************************************/
## theme page.php
/******************************************/

get_header();
?>

<?php

echo '<p>ここにコンテンツが表示されます。</p>';

$content = str_replace('src="/assets/img', 'src="' . THEME_IMAGE_URL, get_the_content());

echo $content;


add_filter($content, function() {
  return str_replace(' 。', '--------------', $content);
});


?>

<?php
get_footer();
