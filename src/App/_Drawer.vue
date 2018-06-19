<template lang="pug">
v-navigation-drawer.elevation-0(app v-model="isOpen" disable-resize-watcher disable-route-watcher fixed)
  v-list()
    v-btn(flat icon large @click="toggle")
      v-icon mdi-arrow-left
    template(v-for="(item, i) in menuItems")
      v-list-group(v-if="item.children")
        v-list-tile(slot="item", @click="")
          v-list-tile-action
            v-icon {{ item.icon }}
          v-list-tile-content
            v-list-tile-title {{ item.text }}
          v-list-tile-action
            v-icon keyboard_arrow_down
        v-list-tile(v-for="(child, i) in item.children", :key="i", @click="")
          v-list-tile-action(v-if="child.icon")
            v-icon {{ child.icon }}
          v-list-tile-content
            v-list-tile-title {{ child.text }}
      v-list-tile(v-else, @click="")
        v-list-tile-action
          v-icon {{ item.icon }}
        v-list-tile-content
          v-list-tile-title {{ item.text }}
    v-divider
</template>

<script>
var menuItems = [
	{ icon: 'create', text: 'New document' },
	{ icon: 'insert_drive_file', text: 'Open file' },
	{ icon: 'save', text: 'Save as file' },
	{ icon: 'storage', text: 'Save to web strorage' },
	{
		icon: 'more_horiz',
		text: 'More',
		children: [
			{ icon: 'add', text: 'Create label' }
		]
	},
	{ icon: 'settings', text: 'Settings' },
	{ icon: 'help', text: 'Help' },
]

export default {
  data () {
    return {
      isOpen: false,
			menuItems: menuItems,
		}
  },
  methods: {
    toggle() { this.isOpen = !this.isOpen }
  },
}
</script>

<style>

</style>
