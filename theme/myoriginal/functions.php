<?php
/******************************************/
## File Name: functions.php
## Description: Core functions file of MYORIGINAL theme.
## MYORIGINAL theme directories setup
/******************************************/


/*********************************************************/
## MYORIGINAL theme define
/**********************************************************/
define('DIR', get_template_directory_uri());

define('MYORIGINAL_INC_DIR', get_template_directory() . '/includes');

define('MYORIGINAL_CSS_URL', DIR . '/assets/css');
define('MYORIGINAL_JS_URL', DIR . '/assets/js');
define('MYORIGINAL_IMG_URL', DIR . '/assets/img');

// custom post type
define('MYORIGINAL_WORK', 'work');
define('MYORIGINAL_CAREER', 'career');

// caustom taxonomy
define('MYORIGINAL_WORK_CASE', 'case');


/*********************************************************/
## MYORIGINAL theme functions files
/*********************************************************/
require_once MYORIGINAL_INC_DIR . '/functions/custom-post-type.php';
require_once MYORIGINAL_INC_DIR . '/functions/custom-functions.php';
require_once MYORIGINAL_INC_DIR . '/functions/custom-post-functions.php';
require_once MYORIGINAL_INC_DIR . '/functions/theme-functions.php';
require_once MYORIGINAL_INC_DIR . '/functions/navigations.php';
require_once MYORIGINAL_INC_DIR . '/functions/editer-filters.php';


/*********************************************************/
## MYORIGINAL theme admin functions
/*********************************************************/
if (is_admin()) {
  require_once MYORIGINAL_INC_DIR . '/functions/admin-functions.php';
}
