FROM drupal:11-apache

WORKDIR /opt/drupal

# Drush is used to install Drupal and enable the theme from the command line.
RUN composer require drush/drush --no-interaction --no-progress
