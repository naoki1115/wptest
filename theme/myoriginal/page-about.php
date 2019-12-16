<?php
/******************************************/
## theme page-about.php
/******************************************/
get_header();

/**
 * 使用できるツール
 *
 * @param array $args ツールのリスト
 */
function useTools($args)
{
  $html = '';
  if (!empty($args)) {
    $html .= '<ul class="skills__tool row -inline">';

    foreach ($args as $key => $data) {
      $html .= '<li>';
      $html .= '<img src="' . MYORIGINAL_IMG_URL . '/about/' . $data['img'] . '"' . 'alt="' . $data['alt'] . '">';
      $html .= '</li>';
    }

    $html .= '</ul>';
  }

  return $html;
}

/**
 * できること
 *
 * @param array $args スキルのリスト
 */
function mySKills($args) {
  $html = '';
  if (!empty($args)) {
    $html .= '<ul class="skills__ability__list row">';

    foreach ($args as $key => $data) {
      $html .= '<li class="col-md-6 col-12 row"><div class="skills__ability__figure col-sm-6 col-12">';
      $html .= '<figure>';
      $html .= '<img src="' . MYORIGINAL_IMG_URL . '/about/' . $data['img'] . '">';
      $html .= '</figure>';
      $html .= '<span class="ability-number t-serif t-italic">' . $data['number'] . '</span>';
      $html .= '</div>';

      $html .= '<div class="skills__ability__info col-md-6 col-12"><div class="info__inner"">';
      $html .= '<h5>' . $data['ttl'] . '</h5>';
      $html .= '<p>' . $data['txt'] . '</p>';
      $html .= '</div></div>';

      $html .= '</li>';
    }

    $html .= '</ul>';
  }
  return $html;
}
?>

<main class="<?php get_page_main_class();?>">
  <div class="page-ttl-head">
    <h2>
      <span class="en">ABOUT</span>
      <span class="jp">わたしについて</span>
    </h2>
  </div>

  <article class="content-wrapper">
    <div class="content-inner">
      <section class="about__profile">
        <h3 class="ttl--inline-side">
          <span class="ttl-row">
            <span class="en">PROFILE</span>
            <span class="jp">自己紹介</span>
          </span>
        </h3>
        <div class="profile__content row">
          <div class="col-lg-6 col-md-7 col-12">
            <div class="profile__txt__container">
              <div class="profile__txt bg-container">
                <p>この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。</p>
                <p>この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。</p>
                <p>この文章はダミーです。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-12">
            <figure class="profile__figure shadow-bg-container">
              <img src="<?php echo DIR; ?>/assets/img/about/profile_face.jpg">
            </figure>
          </div>
        </div><!-- / .profile__content -->
      </section>

      <section class="about__slills">
        <h3 class="ttl--line-side">
          <span class="ttl-row">
            <span class="en">SKILLS</span>
            <span class="jp">できること</span>
          </span>
        </h3>

        <div class="skills__content">
          <h4 class="ttl--border">できること</h4>

          <div class="skills__ability">
<?php
$args = array(
  'design' => array(
    'number' => '01',
    'img' => 'skills_design.jpg',
    'ttl' => 'Web Design',
    'txt' => '見た目と機能性を兼ね備え、ユーザー目線を忘れず使いやすいWebデザインをご提案します。'
  ),
  'coding' => array(
    'number' => '02',
    'img' => 'skills_coding.jpg',
    'ttl' => 'Coding',
    'txt' => 'HTML、CSS、jQueryなどを使い、育てやすいサイトを作ることを意識してコーディングします。'
  ),
);
echo mySKills($args);
?>

          </div><!-- / .skills__ability -->
          <div class="skills__strength bg-container">
            <p>わたしの強みは、デザインとコーディングの兼任ができることです。</p>
            <p>コーダーがデザインもきっちり出来るようになると凄い強いんですよ。デザインがわかってる上に、コーディング上で「あ。これ難しいよね」とか「難しそうに見えるけどこれはシンプルに書けるし見た目もいいから最高だね」とか。フリーランスの場合は提案力の強化に繋がります。</p>
            <p>HTMLやCSSを書く、所謂コーダーの人はデザインを一から作るのが苦手な人が結構いると思います。まぁ私もデザインとかクソ苦手なんですけど、私のデザインがハマる人も一応いらっしゃるようで有り難いですね。</p>
          </div><!-- / .skills__strength -->
        </div><!-- / .skills__content -->

        <div class="skills__content">
          <h4 class="ttl--border">使用ツール</h4>

<?php
$tools = array(
  'xd' => array(
    'img' => 'logo_xd.png',
    'alt' => 'xd'
  ),
  'photoshop' => array(
    'img' => 'logo_ps.png',
    'alt' => 'photoshop'
  ),
  'illustrator' => array(
    'img' => 'logo_ai.png',
    'alt' => 'illustrator'
  ),
  'vscode' => array(
    'img' => 'logo_vsc.png',
    'alt' => 'vscode'
  ),
  'git' => array(
    'img' => 'logo_git.png',
    'alt' => 'git'
  ),
  'npm' => array(
    'img' => 'logo_npm.png',
    'alt' => 'npm'
  ),
  'wp' => array(
    'img' => 'logo_wp.png',
    'alt' => 'wordpress'
  ),
);
echo useTools($tools);
?>

        </div><!-- / .skills__content -->
      </section>

      <?php get_template_part('includes/theme/views/about/about', 'career');?>

    </div><!-- / .content-inner -->
  </article>
</main>

<?php
get_footer();
