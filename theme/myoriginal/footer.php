<?php
/******************************************/
## theme footer.php
/******************************************/
?>

    <div class="footer__wrapper">
      <div class="btn-gotop" id="btnGoTop">
        <a href="#"></a>
      </div>

      <footer class="site-footer" id="siteFooter">
        <nav class="footer__nav">
          <div class="footer__nav__primary">

          </div>
          <!-- footer__nav__primary -->

          <div class="footer__nav__secondary">
          </div>
          <!-- footer__nav__secindary -->
        </nav>

        <p class="footer__copyright">
          <small>Copyright <?php echo date('Y'); ?> Naoki Yoshikawa All Right Reserved.</small>
        </p>
      </footer>
    </div>
    <!-- footer__wrpper -->

  </div>
  <!-- site-wrapper -->

  <div class="site-overlay" id="siteOverlay"></div>
  <?php wp_footer(); ?>
  </body>
</html>