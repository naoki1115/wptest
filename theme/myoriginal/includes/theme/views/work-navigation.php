<?php
/*****************************************/
## work - common
## 実績カテゴリナビゲーション
/****************************************/

/**
 * 実績 サイドカテゴリナビゲーション
 *
 * @param object $terms カテゴリ
 */
$works_case = get_terms(MYORIGINAL_WORK_CASE);

function work_case_navigation($terms)
{
  if ($terms) {
    echo '<aside class="works__category-nav__wrapper col-md-3 col-12">';
    echo '<nav class="works__category-nav"><ul class="works__category-nav__list">';

    // foreach ($terms as $term) {
    //   printf(
    //     '<li class="works__category-nav__item">
    //       <a href="/works/%1$s">
    //         <span class="category"></span>
    //       </a>
    //     </li>'
    //   );
    // }

    echo '</ul></nav>';
    echo '</aside>';
  }
}
