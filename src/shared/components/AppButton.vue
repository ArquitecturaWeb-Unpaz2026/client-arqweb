<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    class="ui-btn"
    :class="`ui-btn--${variant}`"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
