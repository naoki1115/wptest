<?php
/******************************************/
## theme single-work.php
## post_type => work
/******************************************/
get_header();

/**
 * 実績 デバイスデザイン
 */
function get_device_design($id = 0)
{
  $html;
  $design = get_field('device', $id);

  if (!empty($design)) {
    $html .= '<div class="works-detail__info__device">';
    $html .= wp_get_attachment_image($design, 'full');
    $html .= '</div>';
  }

  return $html;
}

/**
 * 実績 概要情報取得
 */
function get_work_info()
{
  $contents = array(
    'client' => array(
      'ttl' => 'クライアント',
      'field' => 'client',
    ),
    'year' => array(
      'ttl' => '制作年',
      'field' => 'year',
    ),
    'purpose' => array(
      'ttl' => '制作目的',
      'field' => 'purpose',
    ),
    'url' => array(
      'ttl' => 'URL',
      'field' => 'url',
    ),
    'time' => array(
      'ttl' => '制作年',
      'field' => 'time'
    )
  );

  $html = '<dl class="works-detail__info row">';

  foreach ($contents as $key => $data) {

    $html .= '<dt class="col-lg-4 col-sm-3 col-12">' . $data['ttl'] . '</dt>';

    switch ($key) {
      case 'url':
        $html .= '<dd class="col-lg-8 col-sm-9 col-12">';
        $html .= '<a class="t-link-underline" href="' . get_field('url') . '" target="_blank" rel="noopener">' . get_field('url') . '</a><span class="link-icon icon-new-window"></span>';
        $html .= '</dd>';
        continue 2;
    }
    $html .= '<dd class="col-lg-8 col-sm-9 col-12">' . get_field($data['field']) . '</dd>';
  }
  $html .= '</dl>';
  return $html;
}

/**
 * 実績 詳細情報取得
 */
function get_work_detail() {
  $contents = array(
    'part' => array(
      'ttl' => '担当範囲',
      'field' => 'part'
    ),
    'tool' => array(
      'ttl' => '使用ツール',
      'field' => 'tool'
    )
  );

  $html = '<dl class="works-detail__info row">';

  foreach ($contents as $key => $data) {
    $html .= '<dt class="col-lg-4 col-sm-3 col-12">' . $data['ttl'] . '</dt>';
    $html .= '<dd class="col-lg-8 col-sm-9 col-12"><ul class="ib-row list--slash">';

    $fields = get_field($data['field']);
    foreach ($fields as $field) {
      $html .= '<li>' . $field['label'] . '</li>';
    }

    $html .= '</ul></dd>';
  }
  $html .= '</dl>';

  return $html;
}

/**
 * 実績 コメント取得
 */
function get_work_comment()
{
  $html = '';

  $comments = get_field('comments');
  $contents = array();

  foreach ($comments as $comment) {
    if ($comment['title'] && $comment['text']) {
      $contents[] = $comment;
    }
  }

  if (!empty($contents)) {
    $html .= '<div class="works-detail__info__point bg-container">';

    foreach ($contents as $k => $v) {
      if ($v['title']) {
        $html .= '<h5 class="ttl--underline">' . $v['title'] . '</h5>';
      }
      if ($v['text']) {
        $html .= '<p>' . $v['text'] . '</p>';
      }
    }

    $html .= '</div>';
  }

  return $html;
}

/**
 * 実績 デザイン取得
 */
function get_work_design($type, $name)
{
  $html ='';
  $images = get_field($type . '_designs');
  $designs = array();

  foreach ($images as $image) {
    if ($images['design1']) {
      $designs[] = $image;
    }
  }

  if (!empty($designs)) {
    $html .= sprintf('<div class="works-detail__design -%1$s-case">', $type);
    $html .= sprintf('<h4 class="ttl--border">%1$sデザイン</h4>', $name);
    $html .= '<ul class="works-detail__design__visual row">';

    foreach ($designs as $i => $v) {
      $html .= '<li class="col-md-4 col-sm-6 col-12">';
      $html .= wp_get_attachment_image($v, 'full');
      $html .= '</li>';
    }

    $html .= '</ul></div>';
  }

  return $html;
}
?>

<main class="">
  <div class="page-ttl-head">
    <h2>
      <span class="en">Works</span>
      <span class="jp">制作実績</span>
    </h2>
  </div>

  <article class="content-wrapper">
    <div class="content-inner">
      <h3 class="ttl--line-side">
        <span class="ttl-row">
          <span class="en"><?php the_title();?></span>
        </span>
      </h3>

      <div class="works__content row -reverse">
        <div class="works-detail__wrapper col-lg-9 col-12">
          <div class ="works-detail__info__content">
            <?php echo get_device_design(); ?>
            <?php echo get_work_info(); ?>
            <?php echo get_work_detail(); ?>
          </div>

          <?php echo get_work_comment();?>
          <?php echo get_work_design('pc', 'PC');?>
          <?php echo get_work_design('sp', 'SP');?>
          <?php get_template_part('includes/theme/views/work/work', 'related');?>
        </div><!-- / .works-detail__wrapper -->

        <?php get_template_part('includes/theme/views/work/work', 'navigation');?>
      </div>

    </div><!-- / .content-inner -->
  </article>
</main>
