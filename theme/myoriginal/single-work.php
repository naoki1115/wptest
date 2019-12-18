<?php
/******************************************/
## theme single-work.php
## post_type => work
/******************************************/
get_header();

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
      'ttl' => '制作期間',
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

    $lists = explode("\n" , get_field($data['field']));
    foreach ($lists as $list) {
      $html .= '<li>' . $list . '</li>';
    }

    $html .= '</ul></dd>';
  }
  $html .= '</dl>';

  return $html;
}

function get_work_comment()
{
  $html = '';

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
          <?php echo get_work_info(); ?>
          <?php echo get_work_detail(); ?>
          </div>

        </div>
        <?php get_template_part('includes/theme/views/work/work', 'navigation');?>
      </div>

    </div><!-- / .content-inner -->
  </article>
</main>
