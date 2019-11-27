<?php
/******************************************/
## File Name: functions.php
## Description: Core functions file of MYORIGINAL theme.
## MYORIGINAL theme directories setup
/******************************************/


/*********************************************************/
## MYORIGINAL theme define
/**********************************************************/
define('MYORIGINAL_INC_DIR', get_template_directory() . '/includes');

define('MYORIGINAL_CSS_URL', get_template_directory_uri() . '/assets/css');
define('MYORIGINAL_JS_URL', get_template_directory_uri() . '/assets/js');
define('MYORIGINAL_IMG_URL', get_template_directory_uri() . '/assets/img');

// custom post type
define('MYORIGINAL_WORK', 'work');
define('MYORIGINAL_CARRER', 'carrer');

// caustom taxonomy
define('MYORIGINAL_WORK_CASE', 'case');


/*********************************************************/
## MYORIGINAL theme functions files
/*********************************************************/
require_once MYORIGINAL_INC_DIR . '/functions/custom-post-type.php';
require_once MYORIGINAL_INC_DIR . '/functions/custom-functions.php';
require_once MYORIGINAL_INC_DIR . '/functions/theme-functions.php';
require_once MYORIGINAL_INC_DIR . '/functions/navigations.php';
require_once MYORIGINAL_INC_DIR . '/functions/editer-filters.php';


/*********************************************************/
## MYORIGINAL theme admin functions
/*********************************************************/
if (is_admin()) {
  require_once MYORIGINAL_INC_DIR . '/functions/admin-functions.php';
}
