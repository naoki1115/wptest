<?php
/******************************************/
## theme page-about.php
/******************************************/
get_header();
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
              <img src="/assets/img/about/profile_face.jpg">
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
            <ul class="skills__ability__list row">
              <li class="col-md-6 col-12 row">
                <div class="skills__ability__figure col-sm-6 col-12">
                  <figure>
                    <img src="/assets/img/about/skills_design.jpg">
                  </figure>
                  <span class="ability-number t-serif t-italic">01</span>
                </div>
                <div class="skills__ability__info">
                  <div class="info__inner">
                    <h5>Web Design</h5>
                    <p>見た目と機能性を兼ね備え、ユーザー目線を忘れず使いやすいWebデザインをご提案します。</p>
                  </div>
                </div>
              </li>
              <li class="col-md-6 col-12 row">
                <div class="skills__ability__figure col-sm-6 col-12">
                  <figure>
                    <img src="/assets/img/about/skills_cording.jpg">
                  </figure>
                  <span class="ability-number t-serif t-italic">02</span>
                </div>
                <div class="skills__ability__info">
                  <div class="info__inner">
                    <h5>Coding</h5>
                    <p>HTML、CSS、jQueryなどを使い、育てやすいサイトを作ることを意識してコーディングします。</p>
                  </div>
                </div>
              </li>
            </ul>
          </div><!-- / .skills__ability -->
          <div class="skills__strength bg-container">
            <p>わたしの強みは、デザインとコーディングの兼任ができることです。</p>
            <p>コーダーがデザインもきっちり出来るようになると凄い強いんですよ。デザインがわかってる上に、コーディング上で「あ。これ難しいよね」とか「難しそうに見えるけどこれはシンプルに書けるし見た目もいいから最高だね」とか。フリーランスの場合は提案力の強化に繋がります。</p>
            <p>HTMLやCSSを書く、所謂コーダーの人はデザインを一から作るのが苦手な人が結構いると思います。まぁ私もデザインとかクソ苦手なんですけど、私のデザインがハマる人も一応いらっしゃるようで有り難いですね。</p>
          </div><!-- / .skills__strength -->
        </div><!-- / .skills__content -->

        <div class="skills__content">
          <h4 class="ttl--border">使用ツール</h4>
          <ul class="skills__tool row -inline">
            <li><img src="/assets/img/about/logo_xd.png" alt="xd"></li>
            <li><img src="/assets/img/about/logo_ps.png" alt="photoshop"></li>
            <li><img src="/assets/img/about/logo_ai.png" alt="illustrator"></li>
            <li><img src="/assets/img/about/logo_vsc.png" alt="visual studio code"></li>
            <li><img src="/assets/img/about/logo_git.png" alt="git"></li>
            <li><img src="/assets/img/about/logo_npm.png" alt="npm"></li>
            <li><img src="/assets/img/about/logo_gulp.png" alt="gulp"></li>
            <li><img src="/assets/img/about/logo_wp.png" alt="wordpress"></li>
          </ul>
        </div><!-- / .skills__content -->
      </section>

      <?php get_template_part('includes/theme/views/about', 'carrer');?>

    </div><!-- / .content-inner -->
  </article>
</main>

<?php
get_footer();
