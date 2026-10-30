<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
