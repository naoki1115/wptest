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

work_case_navigation($works_case);
function work_case_navigation($terms)
{
  if ($terms) {
    echo '<aside class="works__category-nav__wrapper col-md-3 col-12">';
    echo '<nav class="works__category-nav"><ul class="works__category-nav__list">';

    echo '
      <li class="works__category-nav__item">
        <a href="/work/">全ての実績</a>
      </li>
    ';

    foreach ($terms as $term) {
      printf(
        '<li class="works__category-nav__item">
          <a href="/work/%1$s">
            <span class="category">%2$s</span>
          </a>
        </li>',
        $term->slug, $term->name
      );
    }

    echo '</ul></nav>';
    echo '</aside>';
  }
}
