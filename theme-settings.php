<?php

declare(strict_types=1);

use Drupal\Core\Form\FormStateInterface;

/**
 * Implements hook_form_system_theme_settings_alter().
 */
function ekn_tokens_form_system_theme_settings_alter(array &$form, FormStateInterface $form_state): void {
  $form['active_token_theme'] = [
    '#type' => 'select',
    '#title' => t('Active design-token theme'),
    '#description' => t('Only the selected complete :root token file is attached.', [':root' => ':root']),
    '#default_value' => theme_get_setting('active_token_theme') ?: 'react_light',
    '#options' => [
      'react_light' => t('React Light'),
      'react_dark' => t('React Dark'),
      'react_brand_a' => t('React Brand A'),
    ],
  ];
}
